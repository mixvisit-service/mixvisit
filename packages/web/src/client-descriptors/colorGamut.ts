import { mediaQueryMatcher } from '../utils/helpers';

export type ColorGamut = 'srgb' | 'p3' | 'rec2020';

export function getColorGamut(): ColorGamut | null {
  // rec2020 includes p3 and p3 includes srgb
  for (const gamut of ['srgb', 'p3', 'rec2020'] as const) {
    const isMatchesTrue = mediaQueryMatcher('color-gamut', gamut) as boolean;
    if (isMatchesTrue) {
      return gamut;
    }
  }

  return null;
}
