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
import {
  cloneDeep,
  hasProperty,
  removeFields,
  TDef,
} from './utils/helpers';
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

      const endTime = Date.now();
      this.loadTime = endTime - startTime;

      const results: ClientData = {
        ...clientParametersResult,
        ...contextualClientParametersResult,
      };

      const clientParametersWithoutDuration = removeFields(clientParametersResult, ['duration']);
      const strForHashing = JSON.stringify(clientParametersWithoutDuration);

      const isFirstLoad = !this.cache;
      const newCache = isFirstLoad ? {} : cloneDeep(this.cache);

      // Update or load clientData to cache
      Object.assign(newCache, results);

      this.cache = newCache;
      this.fingerprintHash = x64.hash128(strForHashing);
    } catch (err) {
      console.error(err);
    }
  }

  public get(param?: keyof ClientData | (keyof ClientData)[]): GetterResults {
    if (!this.cache) {
      return null;
    }

    if (this.isClientDataKey(param)) {
      return this.cache[param].error ?? this.cache[param].value;
    }

    if (this.isArrayOfClientDataKey(param)) {
      return Object.fromEntries(param.map((key) => [key, this.cache[key]]));
    }

    return this.cache;
  }

  private isClientDataKey(key: unknown): key is keyof ClientData {
    return key && TDef.isString(key) && hasProperty(this.cache, key as string);
  }

  private isArrayOfClientDataKey(keys: unknown): keys is (keyof ClientData)[] {
    return keys && TDef.isArray(keys) && (keys as string[]).every((key) => this.isClientDataKey(key));
  }
}
