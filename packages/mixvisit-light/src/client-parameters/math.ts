/**
 * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
*/
export function getMathResults(): Record<string, number> {
  const fallbackFn = () => 0;

  // Native operations
  const acos = Math.acos || fallbackFn;
  const acosh = Math.acosh || fallbackFn;
  const asin = Math.asin || fallbackFn;
  const asinh = Math.asinh || fallbackFn;
  const atanh = Math.atanh || fallbackFn;
  const atan = Math.atan || fallbackFn;
  const sin = Math.sin || fallbackFn;
  const sinh = Math.sinh || fallbackFn;
  const cos = Math.cos || fallbackFn;
  const cosh = Math.cosh || fallbackFn;
  const tan = Math.tan || fallbackFn;
  const tanh = Math.tanh || fallbackFn;
  const exp = Math.exp || fallbackFn;
  const expm1 = Math.expm1 || fallbackFn;
  const log1p = Math.log1p || fallbackFn;

  // Operation polyfills
  const powPI = (value: number) => Math.PI ** value;
  const acoshPf = (value: number) => Math.log(value + Math.sqrt(value * value - 1));
  const asinhPf = (value: number) => Math.log(value + Math.sqrt(value * value + 1));
  const atanhPf = (value: number) => Math.log((1 + value) / (1 - value)) / 2;
  const sinhPf = (value: number) => Math.exp(value) - 1 / Math.exp(value) / 2;
  const coshPf = (value: number) => (Math.exp(value) + 1 / Math.exp(value)) / 2;
  const expm1Pf = (value: number) => Math.exp(value) - 1;
  const tanhPf = (value: number) => (Math.exp(2 * value) - 1) / (Math.exp(2 * value) + 1);
  const log1pPf = (value: number) => Math.log(1 + value);

  return {
    acos: acos(0.123124234234234242),
    acosh: acosh(1e308),
    acoshPf: acoshPf(1e154),
    asin: asin(0.123124234234234242),
    asinh: asinh(1),
    asinhPf: asinhPf(1),
    atanh: atanh(0.5),
    atanhPf: atanhPf(0.5),
    atan: atan(0.5),
    sin: sin(-1e300),
    sinh: sinh(1),
    sinhPf: sinhPf(1),
    cos: cos(10.000000000123),
    cosh: cosh(1),
    coshPf: coshPf(1),
    tan: tan(-1e300),
    tanh: tanh(1),
    tanhPf: tanhPf(1),
    exp: exp(1),
    expm1: expm1(1),
    expm1Pf: expm1Pf(1),
    log1p: log1p(10),
    log1pPf: log1pPf(10),
    powPI: powPI(-100),
  };
}
