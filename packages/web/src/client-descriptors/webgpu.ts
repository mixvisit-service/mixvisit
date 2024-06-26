/* eslint-disable no-empty */

import type {
  AdaptersOption,
  WebGPUAPI,
  WebGPUInfo,
  WebGPUParams,
  WebGPUSupportedAdapters,
  WebGPUSupportedAdaptersParam,
} from '../types/index';
import { TEXTURE_FORMATS } from '../utils/constants';

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

async function getWebgGPUAPI(): Promise<WebGPUAPI> {
  const res: WebGPUAPI = {};

  const canvas = document.createElement('canvas');
  const offscreen = !!canvas.transferControlToOffscreen;
  const offscreenCanvas = offscreen && canvas.transferControlToOffscreen();

  try {
    if (navigator.gpu) {
      res.gpu = true;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (adapter) {
      res.adapter = true;

      const compatAdapter = await navigator.gpu.requestAdapter({ compatibilityMode: true });
      res.compat = !!compatAdapter;

      const device = await adapter.requestDevice();
      if (device) {
        res.device = true;
        if (offscreenCanvas) {
          res.context = !!offscreenCanvas.getContext('webgpu');
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const newOffscreenCanvas = new OffscreenCanvas(300, 150);
    const ctx = newOffscreenCanvas.getContext('2d');
    res.offscreen = true;
    res.twoD = !!ctx;
  } catch (err) {
    console.error(err);
  }

  return res;
}

async function getWebGPUParams(options: AdaptersOption): Promise<WebGPUParams | null> {
  try {
    const adapter = await navigator.gpu.requestAdapter(options);
    if (!adapter) {
      return null;
    }

    const features: string[] = Array.from(adapter.features);
    const { limits: limitsObject } = adapter;
    const [device, adapterInfo] = await Promise.all([
      adapter.requestDevice({ requiredFeatures: features as Iterable<GPUFeatureName> }),
      adapter.requestAdapterInfo(),
    ]);

    const textureFormatCapabilities = await getSupportedFormats(device);

    const limits = {} as GPUSupportedLimits;
    for (const key in limitsObject) {
      limits[key] = limitsObject[key];
    }

    const info = {} as GPUAdapterInfo;
    for (const key in adapterInfo) {
      info[key] = adapterInfo[key];
    }

    return {
      info,
      limits,
      features,
      textureFormatCapabilities,
      flags: {
        isCompatibilityMode: adapter.isCompatibilityMode,
        isFallbackAdapter: adapter.isFallbackAdapter,
      },
    };
  } catch (err) {
    console.error(err);

    return null;
  }
}

async function getSupportedFormats(device: GPUDevice): Promise<string[] | null> {
  try {
    const res: string[] = [];

    for (const format of TEXTURE_FORMATS) {
      try {
        let width = 1;
        let height = 1;

        if (format.startsWith('bc') || format.startsWith('e')) {
          width = 4;
          height = 4;
        }

        if (format.startsWith('astc')) {
          const match = format.match(/(\d+)x(\d+)/);
          if (match) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
          }
        }

        const GPUTexture = (GPUTextureUsage as ExtendedGPUTextureUsage);

        device.createTexture({
          size: [width, height, 1],
          format,
          usage: GPUTexture.SAMPLED
            | GPUTexture.OUTPUT_ATTACHMENT
            | GPUTexture.STORAGE
            | GPUTexture.COPY_SRC
            | GPUTexture.COPY_DST,
        });

        res.push(format);
      } catch (err) { }
    }

    return res;
  } catch (err) {
    console.error(err);

    return null;
  }
}
