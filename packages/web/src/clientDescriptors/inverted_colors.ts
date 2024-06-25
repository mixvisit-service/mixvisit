import { mediaQueryMatcher } from '../utils/utils';

export function areColorsInverted(): boolean | null {
  const matchForInvertedColors = mediaQueryMatcher('inverted-colors') as (value: string) => boolean;

  if (matchForInvertedColors('inverted')) {
    return true;
  }

  if (matchForInvertedColors('none')) {
    return false;
  }

  return null;
}
