/* eslint-disable no-empty */

import { createCanvasImage, getCanvasImageHash } from './canvas';
import {
  getBestFloatPrecision,
  getFloatIntPrecision,
  getMaxAnisotropy,
  getParamFromObject,
  getParamsAndReturnArray,
} from './utils';
import type {
  BasicsParams,
  CanvasContext,
  CanvasWithContextRes,
  ExtendedParams,
  ShaderPrecisions,
  ShaderType,
  Values,
  WebGLInfo,
} from '../../types/index';
import {
  NOT_APPLICABLE,
  PRECISION_TYPES,
  SHADER_TYPES,
  WEBGL_FUNCTIONS,
  WEBGL_PARAMS,
} from '../../utils/constants';

type WebGLStatuses = Values<typeof WebGLStatus>;

export const enum WebGLStatus {
  /** WebGl context is not available */
  NoWebGLContext = -1,
  /** WebGL context `getParameter` method is not a function */
  GetParameterNotAFunction = -2,
}

const cache: { webgl: CanvasWithContextRes | null } = {
  webgl: null,
};

export function getWebGL(): WebGLInfo | WebGLStatuses {
  const { context: ctx } = getCanvasWithContext() || {};
  if (!ctx) {
    return WebGLStatus.NoWebGLContext;
  }

  const isValidParamGetter = typeof ctx.getParameter === 'function';
  if (!isValidParamGetter) {
    return WebGLStatus.GetParameterNotAFunction;
  }

  createCanvasImage(ctx);

  const basics = getWebGLBasicParams();
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
  } = getWebGLExtendedParams() || {};

  return {
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
  };
}

function getCanvasWithContext(): CanvasWithContextRes | null {
  if (cache.webgl) {
    return cache.webgl;
  }

  const webglVariants = ['webgl2', 'experimental-webgl2', 'webgl', 'experimental-webgl', 'moz-webgl'] as const;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;

  let context: CanvasContext | null = null;
  let contextName = '';

  canvas.addEventListener('webglCreateContextError', () => { context = null; });

  for (contextName of webglVariants) {
    try {
      context = canvas.getContext(contextName) as CanvasContext;
    } catch (err) { }

    if (context) {
      break;
    }
  }

  if (!context) {
    return null;
  }

  const res = {
    canvas,
    context,
    contextName,
  };

  cache.webgl = res;

  return res;
}

function getWebGLBasicParams(): BasicsParams | null {
  const {
    canvas,
    context: ctx,
    contextName,
  } = getCanvasWithContext() || {};

  if (!ctx) {
    return null;
  }

  const canvasImageHash = getCanvasImageHash(canvas, ctx);
  const debugRenderExt = ctx.getExtension('WEBGL_debug_renderer_info');
  const version = ctx.getParameter(ctx.VERSION) || NOT_APPLICABLE;
  const shadingLanguageVersion = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION) || NOT_APPLICABLE;
  const vendor = ctx.getParameter(ctx.VENDOR) || NOT_APPLICABLE;
  const renderer = ctx.getParameter(ctx.RENDERER) || NOT_APPLICABLE;
  const unmaskedVendor = (debugRenderExt && ctx.getParameter(debugRenderExt.UNMASKED_VENDOR_WEBGL)) || NOT_APPLICABLE;
  const unmaskedRenderer = (debugRenderExt && ctx.getParameter(debugRenderExt.UNMASKED_RENDERER_WEBGL)) || NOT_APPLICABLE;

  return {
    canvasImageHash,
    contextName,
    version,
    shadingLanguageVersion,
    vendor,
    renderer,
    unmaskedVendor,
    unmaskedRenderer,
  };
}

function getWebGLExtendedParams(): ExtendedParams | null {
  const { context: ctx } = getCanvasWithContext() || {};
  if (!ctx) {
    return null;
  }

  const res = {} as ExtendedParams;

  // Supported functions
  const isWebGLRenderContextExist = !!window.WebGL2RenderingContext;
  if (isWebGLRenderContextExist) {
    const supportedFunctions: string[] = [];

    for (const elem of WEBGL_FUNCTIONS) {
      if (ctx[elem]) {
        supportedFunctions.push(elem);
      }
    }

    res.supportedFunctions = supportedFunctions.sort();
  }

  // Context attributes
  const contextAttributes = ctx.getContextAttributes();
  if (contextAttributes) {
    res.contextAttributes = contextAttributes;
  }

  // WebGL parameters
  for (const paramType in WEBGL_PARAMS) {
    const params = {};

    for (const param of WEBGL_PARAMS[paramType as keyof typeof WEBGL_PARAMS]) {
      let parameter = null;

      const specialHandlers = {
        ALIASED_LINE_WIDTH_RANGE: () => getParamFromObject(ctx, param),
        ALIASED_POINT_SIZE_RANGE: () => getParamFromObject(ctx, param),
        DEPTH_STENCIL_BITS: () => getParamsAndReturnArray(ctx, ['DEPTH_BITS', 'STENCIL_BITS']),
        FLOAT_INT_PRECISION: () => getFloatIntPrecision(ctx),
        FRAGMENT_BEST_FLOAT_PRECISION: () => getBestFloatPrecision(ctx, 'FRAGMENT_SHADER'),
        MAX_TEXTURE_MAX_ANISOTROPY_EXT: () => getMaxAnisotropy(ctx),
        MAX_VIEWPORT_DIMS: () => getParamFromObject(ctx, param),
        RGBA_BITS: () => getParamsAndReturnArray(ctx, ['RED_BITS', 'GREEN_BITS', 'BLUE_BITS', 'ALPHA_BITS']),
        VERTEX_BEST_FLOAT_PRECISION: () => getBestFloatPrecision(ctx, 'VERTEX_SHADER'),
      };

      try {
        if (specialHandlers[param]) {
          parameter = specialHandlers[param]();
        } else {
          parameter = ctx.getParameter(ctx[param]);
        }
      } catch (err) { }

      params[param] = parameter ?? NOT_APPLICABLE;
    }

    res[paramType] = params;
  }

  // Shader precision
  const shaderPrecisions = {} as ShaderPrecisions;
  for (const shaderType of SHADER_TYPES) {
    shaderPrecisions[shaderType] = {} as ShaderPrecisions[ShaderType];
    for (const precisionType of PRECISION_TYPES) {
      const shaderPrecision = ctx.getShaderPrecisionFormat(ctx[shaderType], ctx[precisionType]);
      const shaderPrecisionArr = shaderPrecision ? [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision] : [];
      shaderPrecisions[shaderType][precisionType] = shaderPrecisionArr.join(',');
    }
  }

  res.shaderPrecisions = shaderPrecisions;

  // Extensions
  const supportedExtensions = ctx.getSupportedExtensions();
  if (supportedExtensions) {
    const extensions: string[] = [];

    for (const elem of supportedExtensions) {
      extensions.push(elem);
    }

    res.extensions = extensions.sort();
  }

  return res;
}
