import { clientParameters } from './client-parameters';
import type { ClientParameters } from './client-parameters';
import { contextualClientParameters } from './contextual-client-parameters';
import type { ContextualClientParameters } from './contextual-client-parameters';
import type {
  ClientData,
  GetterResults,
  LoadOptions,
  MixVisitInterface,
} from './types';
import { x64 } from './utils/hashing';
import { hasProperty, removeFields } from './utils/helpers';
import { loadParameters } from './utils/load';

export class MixVisit implements MixVisitInterface {
  public loadTime: number | null = null;

  public fingerprintHash: string | null = null;

  private cache: ClientData | null = null;

  public async load(options?: LoadOptions): Promise<void> {
    try {
      const startTime = Date.now();

      const [clientParametersResult, contextualClientParametersResult] = await Promise.all([
        loadParameters<ClientParameters>(clientParameters, options),
        loadParameters<ContextualClientParameters>(contextualClientParameters, options),
      ]);

      const results: ClientData = {
        ...clientParametersResult,
        ...contextualClientParametersResult,
      };

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      const clientParametersWithoutDuration = removeFields(clientParametersResult, ['duration']);
      const strForHashing = JSON.stringify(clientParametersWithoutDuration);

      this.loadTime = loadTime;
      this.cache = results;

      this.fingerprintHash = x64.hash128(strForHashing);
    } catch (err) {
      console.error(err);
    }
  }

  public get(key?: keyof ClientData): GetterResults {
    if (key && hasProperty(this.cache, key)) {
      return this.cache[key].error ?? this.cache[key].value;
    }

    if (!(key && this.cache)) {
      return this.cache;
    }

    return null;
  }
}
