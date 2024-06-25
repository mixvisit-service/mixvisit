import type { Descriptors } from '../clientDescriptors/index';
import type { DescriptorsRes } from '../types/index';

type LoadClientResult = Promise<{
  time: number;
  results: DescriptorsRes;
}>;

export async function loadClientDescriptors(descriptors: Descriptors): LoadClientResult {
  const startTime = Date.now();
  const descriptorsRes = {} as DescriptorsRes;

  for (const descriptorKey of Object.keys(descriptors)) {
    const key = descriptorKey as keyof Descriptors;

    if (typeof descriptors[key] !== 'function') {
      continue;
    }

    const dataFetcher = descriptors[key]();

    (descriptorsRes as any)[key] = dataFetcher instanceof Promise
      // eslint-disable-next-line no-await-in-loop
      ? await dataFetcher
      : dataFetcher;
  }

  const endTime = Date.now();

  return {
    time: endTime - startTime,
    results: descriptorsRes,
  };
}
