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

export async function loadParameters<T extends Parameters>(parameters: Parameters, options: LoadOptions): Promise<Result<LoadResult<T>>> {
  const result = {} as Result<LoadResult<T>>;

  for (const key of Object.keys(parameters)) {
    try {
      if (!TDef.isFunc(parameters[key]) || options?.exclude?.includes(key)) {
        continue;
      }

      const start = Date.now();
      const dataFetcher = parameters[key]();

      const value = dataFetcher instanceof Promise
        // eslint-disable-next-line no-await-in-loop
        ? await dataFetcher
        : dataFetcher;

      const duration = Date.now() - start;

      result[key] = {
        value,
        duration,
      };
    } catch (err) {
      result[key] = {
        error: {
          code: 'InternalError',
          message: `An unexpected error occurred while collecting parameter data. Error: ${err.message}`,
        },
      };
    }
  }

  return result;
}
