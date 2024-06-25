import { mediaQueryMatcher } from '../utils/utils';

const enum ContrastPreference {
  Less = -1,
  None = 0,
  More = 1,
  ForcedColors = 10,
}

export function getContrastPreference(): number | null {
  const matchForPrefersContrast = mediaQueryMatcher('prefers-contrast') as (value: string) => boolean;

  if (matchForPrefersContrast('no-preference')) {
    return ContrastPreference.None;
  }

  if (matchForPrefersContrast('high') || matchForPrefersContrast('more')) {
    return ContrastPreference.More;
  }

  if (matchForPrefersContrast('low') || matchForPrefersContrast('less')) {
    return ContrastPreference.Less;
  }

  if (matchForPrefersContrast('forced')) {
    return ContrastPreference.ForcedColors;
  }

  return null;
}
