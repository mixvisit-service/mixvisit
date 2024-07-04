import {
  getMaxCallStackSize,
  getStorage,
  getTimingResolution,
} from './metrics';
import { toGBString } from '../../utils/helpers';

type Size = {
  value: string | null;
  bytes: number | null;
};

type SystemMetrics = {
  storage: {
    isInsecure: boolean;
    size: Size;
  };
  memory: Size;
  timing: [number, number];
  stack: number;
};

export async function getSystemMetrics(): Promise<SystemMetrics | null> {
  try {
    const [storageFirst, storageSecond] = await Promise.all([getStorage(), getStorage()]);
    const isInsecure = storageFirst !== storageSecond;

    const memory = performance?.memory?.jsHeapSizeLimit || null;

    return {
      storage: {
        isInsecure,
        size: {
          value: toGBString(storageFirst),
          bytes: storageFirst,
        },
      },
      memory: {
        value: toGBString(memory),
        bytes: memory,
      },
      timing: getTimingResolution(),
      stack: getMaxCallStackSize(),
    };
  } catch (err) {
    console.error(err);

    return null;
  }
}
