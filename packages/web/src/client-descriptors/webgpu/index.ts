import type {
  WebGPUInfo,
  WebGPUSupportedAdapters,
  WebGPUSupportedAdaptersParam,
} from '../../types/index';
import { getWebgGPUAPI } from './apiStatuses';
import { getWebGPUParams } from './webgpuParams';

const requestAdapterOptions: WebGPUSupportedAdaptersParam = {
  fallback: {
    powerPreference: 'low-power',
    forceFallbackAdapter: true,
  },
  highPerformance: { powerPreference: 'high-performance' },
} as const;

export async function getWebGPU(): Promise<WebGPUInfo | null> {
  try {
    const res: WebGPUInfo = {
      api: null,
    };

    res.api = await getWebgGPUAPI();

    if (!res.api.adapter) {
      return res;
    }

    res.supportedAdapters = {} as WebGPUSupportedAdapters;
    const supportedAdaptersPromises: Promise<void>[] = [];

    for (const [type, option] of Object.entries(requestAdapterOptions)) {
      const promise = getWebGPUParams(option).then((params) => {
        res.supportedAdapters[type] = params;
      });

      supportedAdaptersPromises.push(promise);
    }

    await Promise.all(supportedAdaptersPromises);

    return res;
  } catch (err) {
    console.error(err);

    return null;
  }
}
