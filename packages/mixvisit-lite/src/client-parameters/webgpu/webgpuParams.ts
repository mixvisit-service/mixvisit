/* eslint-disable no-empty */

import type { AdaptersOption, WebGPUParams } from '../../types';
import { TEXTURE_FORMATS } from '../../utils/constants';

export async function getWebGPUParams(options: AdaptersOption): Promise<WebGPUParams | null> {
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
