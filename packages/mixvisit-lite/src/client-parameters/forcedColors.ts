import { mediaQueryMatcher } from '../utils/helpers';

export function areColorsForced(): boolean | null {
  const matchForForcedColors = mediaQueryMatcher('forced-colors') as (value: string) => boolean;

  if (matchForForcedColors('active')) {
    return true;
  }

  if (matchForForcedColors('none')) {
    return false;
  }

  return null;
}
