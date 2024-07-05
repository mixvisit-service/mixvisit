import { ContrastPreferenceStatus } from '../utils/enums';
import { mediaQueryMatcher } from '../utils/helpers';

export function getContrastPreference(): number | null {
  const matchForPrefersContrast = mediaQueryMatcher('prefers-contrast') as (value: string) => boolean;

  if (matchForPrefersContrast('no-preference')) {
    return ContrastPreferenceStatus.None;
  }

  if (matchForPrefersContrast('high') || matchForPrefersContrast('more')) {
    return ContrastPreferenceStatus.More;
  }

  if (matchForPrefersContrast('low') || matchForPrefersContrast('less')) {
    return ContrastPreferenceStatus.Less;
  }

  if (matchForPrefersContrast('forced')) {
    return ContrastPreferenceStatus.ForcedColors;
  }

  return null;
}
