import type { ClientParameters } from '../client-parameters';
import type { ContextualClientParameters } from '../contextual-client-parameters';
import type { UnwrappedParameters } from '../types';

type UnknownParameters = Record<string, () => unknown>;
type Parameters = ClientParameters | ContextualClientParameters | UnknownParameters;

type UnwrapClient<T> = T extends ClientParameters ? UnwrappedParameters<T> : never;
type UnwrapContextual<T> = T extends ContextualClientParameters ? UnwrappedParameters<T> : never;
type UnwrapUnknowParams<T> = T extends UnknownParameters ? UnwrappedParameters<T> : never;

type LoadResult<T> = UnwrapClient<T> | UnwrapContextual<T> | UnwrapUnknowParams<T>;

export async function loadParameters<T extends Parameters>(parameters: Parameters): Promise<LoadResult<T>> {
  const result = {} as LoadResult<T>;

  for (const key of Object.keys(parameters)) {
    if (typeof parameters[key] !== 'function') {
      continue;
    }

    const dataFetcher = parameters[key]();

    (result as any)[key] = dataFetcher instanceof Promise
      // eslint-disable-next-line no-await-in-loop
      ? await dataFetcher
      : dataFetcher;
  }

  return result;
}
