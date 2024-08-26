import type { ClientParameters } from '../client-parameters/index';
import type { ContextualClientParameters } from '../contextual-client-parameters/index';
import type { UnwrappedClientParameters, UnwrappedContextualClientParameters } from '../types/index';

type Parameters = ClientParameters | ContextualClientParameters;

type UnwrapClient<T> = T extends ClientParameters ? UnwrappedClientParameters : never;
type UnwrapContextual<T> = T extends ContextualClientParameters ? UnwrappedContextualClientParameters : never;

type LoadResult<T> = UnwrapClient<T> | UnwrapContextual<T>;

export async function loadParameters<T extends Parameters>(parameters: Parameters): Promise<LoadResult<T>> {
  const parameterResult = {} as LoadResult<T>;

  for (const descriptorKey of Object.keys(parameters)) {
    const key = descriptorKey as keyof (ClientParameters & ContextualClientParameters);

    if (typeof parameters[key] !== 'function') {
      continue;
    }

    const dataFetcher = parameters[key]();

    (parameterResult as any)[key] = dataFetcher instanceof Promise
      // eslint-disable-next-line no-await-in-loop
      ? await dataFetcher
      : dataFetcher;
  }

  return parameterResult;
}
