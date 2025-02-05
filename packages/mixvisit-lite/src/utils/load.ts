/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */

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

const DEFAULT_TIMEOUT_MS = 2000;

export async function loadParameters<T extends Parameters>(
  parameters: Parameters,
  options?: LoadOptions,
): Promise<Result<LoadResult<T>>> {
  const result = {} as Result<LoadResult<T>>;
  const { exclude, timeout = DEFAULT_TIMEOUT_MS } = options || {};

  for (const key of Object.keys(parameters)) {
    try {
      if (!TDef.isFunc(parameters[key]) || exclude?.includes(key)) {
        continue;
      }

      const fn = parameters[key];
      const start = Date.now();

      let value: any;

      if (fn.constructor.name === 'AsyncFunction') {
        // Handle asynchronous functions with timeout
        value = await Promise.race([
          fn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
        ]);
      } else {
        // Handle synchronous functions
        value = fn();
      }

      // Ensure that if the result is still a promise, we resolve it
      if (typeof value?.then === 'function') {
        value = await value;
      }

      result[key] = { value, duration: Date.now() - start };
    } catch (err) {
      if (err.message === 'Timeout') {
        result[key] = { error: createError('TimeoutError', `Timeout exceeded by ${timeout} ms`) };
      } else {
        result[key] = { error: createError('InternalError', err.message) };
      }
    }
  }

  return result;
}

function createError(errorType: 'InternalError' | 'TimeoutError', message?: string): { code: string; message: string } {
  if (errorType === 'TimeoutError') {
    return {
      code: 'TimeoutError',
      message: message || 'Timeout exceeded',
    };
  }

  return {
    code: 'InternalError',
    message: `An unexpected error occurred while collecting parameter data.${message ? ` Error: ${message}` : ''}`,
  };
}
