import type { CanvasContext } from '../../types/index';

export function getBestFloatPrecision(ctx: CanvasContext, shaderType: string): readonly [number, number, number] | null {
  const high = ctx.getShaderPrecisionFormat(ctx[shaderType], ctx.HIGH_FLOAT);
  const medium = ctx.getShaderPrecisionFormat(ctx[shaderType], ctx.MEDIUM_FLOAT);

  if (!(high || medium)) {
    return null;
  }

  let best = high;
  if (!high.precision) {
    best = medium;
  }

  return [best.precision, best.rangeMin, best.rangeMax] as const;
}

export function getFloatIntPrecision(ctx: CanvasContext): string | null {
  const highFloatPrecisionInfo = ctx.getShaderPrecisionFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_FLOAT);
  const highIntPrecisionInfo = ctx.getShaderPrecisionFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_INT);

  if (!(highFloatPrecisionInfo && highIntPrecisionInfo)) {
    return null;
  }

  const floatStrResult = highFloatPrecisionInfo.precision !== 0 ? 'highp/' : 'mediump/';
  const intStrResult = highIntPrecisionInfo.rangeMax !== 0 ? 'highp' : 'lowp';

  return `${floatStrResult}${intStrResult}`;
}

export function getMaxAnisotropy(ctx: CanvasContext): number | null {
  const ext = ctx.getExtension('EXT_texture_filter_anisotropic')
    || ctx.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    || ctx.getExtension('MOZ_EXT_texture_filter_anisotropic');

  if (!ext) {
    return null;
  }

  let max: number = ctx.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  // See Canary bug: https://code.google.com/p/chromium/issues/detail?id=117450
  if (max === 0) {
    max = 2;
  }

  return max;
}

export function getParamFromObject(ctx: CanvasContext, param: string): unknown[] | null {
  const parameterResult = ctx.getParameter(ctx[param]);

  return parameterResult ? Object.values(parameterResult) : null;
}

export function getParamsAndReturnArray(ctx: CanvasContext, params: string[]): unknown[] | null {
  const collectedParams = params.map((param) => ctx.getParameter(ctx[param]));
  const hasValidParameter = collectedParams.some((param) => param !== undefined && param !== null);

  return hasValidParameter ? collectedParams : null;
}
