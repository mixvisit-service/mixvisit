import { clientParameters } from './client-parameters/index';
import type { ClientParameters } from './client-parameters/index';
import { contextualClientParameters } from './contextual-client-parameters/index';
import type { ContextualClientParameters } from './contextual-client-parameters/index';
import type { CompleteClientData, FPClientInterface, GetterResults } from './types/index';
import { x64 } from './utils/hashing';
import { hasProperty } from './utils/helpers';
import { loadParameters } from './utils/load';

export class FPClient implements FPClientInterface {
  public loadTime: number | null = null;

  public fingerprintHash: string | null = null;

  private cache: CompleteClientData | null = null;

  async load(): Promise<void> {
    try {
      const startTime = Date.now();

      const [
        clientParametersResult,
        contextualClientParametersResult,
      ] = await Promise.all([
        loadParameters<ClientParameters>(clientParameters),
        loadParameters<ContextualClientParameters>(contextualClientParameters),
      ]);

      const results: CompleteClientData = {
        ...clientParametersResult,
        ...contextualClientParametersResult,
      };

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      const strForHashing = JSON.stringify(clientParametersResult);

      this.loadTime = loadTime;
      this.cache = results;

      this.fingerprintHash = x64.hash128(strForHashing);

      console.log(`Data loaded and cached in ${loadTime} ms`);
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
