import { ContrastPreferenceStatus } from '../utils/enums';
import { mediaQueryMatcher } from '../utils/helpers';

export function getContrastPreference(): number | null {
  const matchForPrefersContrast = mediaQueryMatcher('prefers-contrast') as (value: string) => boolean;

  if (matchForPrefersContrast('no-preference')) {
    return ContrastPreferenceStatus.NONE;
  }

  if (matchForPrefersContrast('high') || matchForPrefersContrast('more')) {
    return ContrastPreferenceStatus.MORE;
  }

  if (matchForPrefersContrast('low') || matchForPrefersContrast('less')) {
    return ContrastPreferenceStatus.LESS;
  }

  if (matchForPrefersContrast('forced')) {
    return ContrastPreferenceStatus.FORCED_COLORS;
  }

  return null;
}
