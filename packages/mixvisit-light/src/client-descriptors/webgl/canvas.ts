/*
  eslint-disable
    no-param-reassign,
    no-empty,
    no-tabs
*/

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
  ContextInfo,
  ExtendedParams,
  ShaderPrecisions,
  ShaderType,
} from '../../types';
import {
  NOT_APPLICABLE,
  PRECISION_TYPES,
  SHADER_TYPES,
  WEBGL_FUNCTIONS,
  WEBGL_PARAMS,
} from '../../utils/constants';
import { x64, bufToHex } from '../../utils/hashing';

const vertextShaderSource = `
	precision mediump float;
	attribute vec2 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;
	void main() {
	  fragColor = vertColor;
	  gl_Position = vec4(vertPosition, 0.0, 1.0);
	}
`;

const fragmentShaderSource = `
	precision mediump float;
	varying vec3 fragColor;
	void main() {
		gl_FragColor = vec4(fragColor, 1.0);
	}
`;

export function getSupportedContexts(canvas: HTMLCanvasElement): ContextInfo[] {
  const res: ContextInfo[] = [];
  const webglVariants = ['webgl2', 'experimental-webgl2', 'webgl', 'experimental-webgl', 'moz-webgl'] as const;

  for (const contextName of webglVariants) {
    let context: CanvasContext | null = null;

    try {
      context = canvas.getContext(contextName) as CanvasContext;
    } catch (err) { }

    if (context) {
      res.push({
        context,
        contextName,
      });
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    canvas.replaceWith(newCanvas);
    canvas = newCanvas;
  }

  return res;
}

export function getWebGLBasicParams(contextInfo: ContextInfo): BasicsParams | null {
  const { context: ctx, contextName } = contextInfo || {};

  if (!ctx) {
    return null;
  }

  const debugRenderExt = ctx.getExtension('WEBGL_debug_renderer_info');
  const version = ctx.getParameter(ctx.VERSION) || NOT_APPLICABLE;
  const shadingLanguageVersion = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION) || NOT_APPLICABLE;
  const vendor = ctx.getParameter(ctx.VENDOR) || NOT_APPLICABLE;
  const renderer = ctx.getParameter(ctx.RENDERER) || NOT_APPLICABLE;
  const unmaskedVendor = (debugRenderExt && ctx.getParameter(debugRenderExt.UNMASKED_VENDOR_WEBGL)) || NOT_APPLICABLE;
  const unmaskedRenderer = (debugRenderExt && ctx.getParameter(debugRenderExt.UNMASKED_RENDERER_WEBGL)) || NOT_APPLICABLE;

  return {
    contextName,
    version,
    shadingLanguageVersion,
    vendor,
    renderer,
    unmaskedVendor,
    unmaskedRenderer,
  };
}

export function getWebGLExtendedParams(ctx: CanvasContext): ExtendedParams | null {
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

export function getCanvasImageHash(canvas: HTMLCanvasElement, ctx: CanvasContext): string {
  const { width, height } = canvas;
  const pixels = new Uint8Array(width * height * 4);

  createCanvasImage(ctx);

  ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
  const pixelString = bufToHex(pixels);

  return x64.hash128(pixelString);
}

function createCanvasImage(ctx: CanvasContext): void {
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  // Create shaders
  const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
  const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

  ctx.shaderSource(vertexShader, vertextShaderSource);
  ctx.shaderSource(fragmentShader, fragmentShaderSource);

  ctx.compileShader(vertexShader);
  if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', ctx.getShaderInfoLog(vertexShader));

    return;
  }

  ctx.compileShader(fragmentShader);
  if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', ctx.getShaderInfoLog(fragmentShader));

    return;
  }

  const program = ctx.createProgram();
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    console.error('ERROR linking program!', ctx.getProgramInfoLog(program));

    return;
  }

  ctx.validateProgram(program);
  if (!ctx.getProgramParameter(program, ctx.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', ctx.getProgramInfoLog(program));

    return;
  }

  // Create buffer
  const triangleVertices = [
    // X, Y,   R, G, B
    0.0, 0.5, 1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.1, 1.0, 0.6,
  ];

  const triangleVertexBufferObject = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, triangleVertexBufferObject);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(triangleVertices), ctx.STATIC_DRAW);

  const positionAttribLocation = ctx.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = ctx.getAttribLocation(program, 'vertColor');

  ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  ctx.vertexAttribPointer(colorAttribLocation, 3, ctx.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  ctx.enableVertexAttribArray(positionAttribLocation);
  ctx.enableVertexAttribArray(colorAttribLocation);

  // Main render loop
  ctx.useProgram(program);
  ctx.drawArrays(ctx.TRIANGLES, 0, 3);
}
