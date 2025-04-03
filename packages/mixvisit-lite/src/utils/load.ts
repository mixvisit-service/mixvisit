/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */

import { ErrorType } from './enums';
import { TDef } from './helpers';
import type { ClientParameters } from '../client-parameters';
import type { ContextualClientParameters } from '../contextual-client-parameters';
import type { LoadOptions, Result, UnwrappedParameters } from '../types';

type UnknownParameters = Record<string, () => unknown>;
type Parameters = ClientParameters | ContextualClientParameters | UnknownParameters;

type UnwrapClient<T> = T extends ClientParameters ? UnwrappedParameters<T> : never;
type UnwrapContextual<T> = T extends ContextualClientParameters ? UnwrappedParameters<T> : never;
type UnwrapUnknowParams<T> = T extends UnknownParameters ? UnwrappedParameters<T> : never;

type LoadResult<T> = UnwrapClient<T> | UnwrapContextual<T> | UnwrapUnknowParams<T>;

const DEFAULT_TIMEOUT = 2000;
const TIMEOUT_FOR_ONLY_OPTION = 12000;

export async function loadParameters<T extends Parameters>(
  parameters: Parameters,
  options?: LoadOptions,
): Promise<Result<LoadResult<T>>> {
  const result = {} as Result<LoadResult<T>>;
  const { only, exclude, timeout } = options || {};

  // Mutually exclusive check
  if (only && exclude) {
    throw new Error('Cannot use both "only" and "exclude" options');
  }

  const requiredTimeout = only && !timeout
    ? TIMEOUT_FOR_ONLY_OPTION
    : timeout || DEFAULT_TIMEOUT;

  // Determine the list of keys to process
  const parameterKeys = only
    ? only.filter((key) => TDef.isFunc(parameters[key]))
    : Object.keys(parameters).filter((key) => TDef.isFunc(parameters[key]) && !exclude?.includes(key));

  for (const key of parameterKeys) {
    try {
      const fn = parameters[key];
      const start = Date.now();

      let value: any;

      if (fn.constructor.name === 'AsyncFunction') {
        // Handle asynchronous functions with timeout
        value = await Promise.race([
          fn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), requiredTimeout)),
        ]);
      } else {
        // Handle synchronous functions
        value = fn();

        // Ensure that if the result is still a promise, we resolve it
        if (typeof value?.then === 'function') {
          value = await value;
        }
      }

      result[key] = { value, duration: Date.now() - start };
    } catch (err) {
      const isTimeout = err.message === 'Timeout';
      result[key] = {
        error: createError(
          isTimeout ? ErrorType.TIMEOUT : ErrorType.INTERNAL,
          isTimeout ? `Timeout exceeded by ${requiredTimeout} ms` : err.message,
        ),
      };
    }
  }

  return result;
}

function createError(errorType: ErrorType.INTERNAL | ErrorType.TIMEOUT, message?: string): { code: string; message: string } {
  if (errorType === ErrorType.TIMEOUT) {
    return {
      code: ErrorType.TIMEOUT,
      message: message || 'Timeout exceeded',
    };
  }

  return {
    code: ErrorType.INTERNAL,
    message: `An unexpected error occurred while collecting parameter data.${message ? ` Error: ${message}` : ''}`,
  };
}
