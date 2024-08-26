import type { WebGPUAPI } from '../../types';

export async function getWebgGPUAPI(): Promise<WebGPUAPI> {
  const res: WebGPUAPI = {};

  const canvas = document.createElement('canvas');
  const offscreen = !!canvas.transferControlToOffscreen;
  const offscreenCanvas = offscreen && canvas.transferControlToOffscreen();

  try {
    if (navigator.gpu) {
      res.api = true;
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
