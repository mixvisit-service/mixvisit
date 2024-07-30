import { clientParameters } from './client-parameters/index';
import type { CompleteClientData, FPClientInterface } from './types/index';
import { x64 } from './utils/hashing';
import { hasProperty } from './utils/helpers';
import { loadClientParameters } from './utils/load';

type GetterResults =
  | CompleteClientData[keyof CompleteClientData]
  | CompleteClientData
  | null;

export class FPClient implements FPClientInterface {
  public loadTime: number | null = null;

  public fingerprintHash: string | null = null;

  private cache: CompleteClientData | null = null;

  async load(): Promise<void> {
    try {
      const { results, time } = await loadClientParameters(clientParameters);

      const strResults = JSON.stringify(results);

      this.loadTime = time;
      this.cache = results;
      this.fingerprintHash = x64.hash128(strResults);

      console.log(`Data loaded and cached in ${time} ms.`);
    } catch (err) {
      console.error(err);
    }
  }

  get(key?: keyof CompleteClientData): GetterResults {
    if (key && hasProperty(this.cache, key)) {
      return this.cache?.[key];
    }

    if (!key) {
      return this.cache;
    }

    return null;
  }
}
