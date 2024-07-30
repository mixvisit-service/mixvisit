import type { ClientParameters } from '../client-parameters/index';
import type { CompleteClientData } from '../types/index';

type LoadClientResult = Promise<{
  time: number;
  results: CompleteClientData;
}>;

export async function loadClientParameters(parameters: ClientParameters): LoadClientResult {
  const startTime = Date.now();
  const parameterResult = {} as CompleteClientData;

  for (const descriptorKey of Object.keys(parameters)) {
    const key = descriptorKey as keyof ClientParameters;

    if (typeof parameters[key] !== 'function') {
      continue;
    }

    const dataFetcher = parameters[key]();

    (parameterResult as any)[key] = dataFetcher instanceof Promise
      // eslint-disable-next-line no-await-in-loop
      ? await dataFetcher
      : dataFetcher;
  }

  const endTime = Date.now();

  return {
    time: endTime - startTime,
    results: parameterResult,
  };
}
