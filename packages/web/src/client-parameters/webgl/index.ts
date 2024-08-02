import {
  getSupportedContexts,
  getCanvasImageHash,
  getWebGLBasicParams,
  getWebGLExtendedParams,
} from './canvas';
import type { WebGLInfo } from '../../types/index';

export function getWebGL(): WebGLInfo | null {
  const res: WebGLInfo = {
    webglImageHash: '',
    supportedWebGLContexts: [],
  };

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;

  const supportedContexts = getSupportedContexts(canvas);
  if (!supportedContexts.length) {
    return null;
  }

  const [someContext] = supportedContexts;
  const webglImageHash = getCanvasImageHash(canvas, someContext.context);
  res.webglImageHash = webglImageHash;

  for (const contextInfo of supportedContexts) {
    const basics = getWebGLBasicParams(contextInfo);
    const {
      contextAttributes = null,
      shaderPrecisions = null,
      supportedFunctions = null,
      extensions = null,
      vertexShader = null,
      transformFeedback = null,
      rasterizer = null,
      fragmentShader = null,
      framebuffer = null,
      textures = null,
      uniformBuffers = null,
    } = getWebGLExtendedParams(contextInfo.context) || {};

    res.supportedWebGLContexts.push({
      basics,
      contextAttributes,
      shaderPrecisions,
      vertexShader,
      transformFeedback,
      rasterizer,
      fragmentShader,
      framebuffer,
      textures,
      uniformBuffers,
      extensions,
      supportedFunctions,
    });
  }

  return res;
}
