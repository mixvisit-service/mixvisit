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

      if (fn.constructor.name === 'AsyncFunction') { // Handle asynchronous functions
        const start = Date.now();
        // For asynchronous tasks timeout so that it does not run longer than TIMEOUT_MS
        // eslint-disable-next-line no-await-in-loop
        const value = await Promise.race([
          fn(),
          // eslint-disable-next-line no-promise-executor-return
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
        ]);

        result[key] = { value, duration: Date.now() - start };
      } else { // Handle synchronous functions
        const start = Date.now();
        result[key] = {
          value: fn(),
          duration: Date.now() - start,
        };
      }
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
