import { descriptors } from './client-descriptors';
import type { Descriptors } from './client-descriptors';
import type { DescriptorsRes, FPClientInterface } from './types';
import { x64 } from './utils/hashing';
import { hasProperty } from './utils/helpers';
import { loadClientDescriptors } from './utils/load';

export class FPClient implements FPClientInterface {
  public loadTime: number | null = null;

  public fingerprintHash: string | null = null;

  private cache: DescriptorsRes | null = null;

  async load(): Promise<void> {
    try {
      const { results, time } = await loadClientDescriptors(descriptors);

      const strResults = JSON.stringify(results);

      this.loadTime = time;
      this.cache = results;
      this.fingerprintHash = x64.hash128(strResults);

      console.log('Data loaded and cached');
    } catch (err) {
      console.error(err);
    }
  }

  get(key?: keyof Descriptors): DescriptorsRes[keyof DescriptorsRes] | DescriptorsRes | null {
    if (key && hasProperty(this.cache, key)) {
      return this.cache?.[key];
    }

    if (!key) {
      return this.cache;
    }

    return null;
  }
}
