import { mediaQueryMatcher } from '../utils/helpers';

/**
 * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
 * If the display is not monochrome, the returned value will be 0.
 * If the browser doesn't support this feature, the returned value will be null.
 */
export function getMonochromeDepth(): number | null {
  const maxValueToCheck = 100;
  const mediaIsNotSupport = !mediaQueryMatcher('min-monochrome', '0') as boolean;
  if (mediaIsNotSupport) {
    return null;
  }

  for (let i = 0; i <= maxValueToCheck; ++i) {
    const isMatchesTrue = mediaQueryMatcher('max-monochrome', i.toString()) as boolean;
    if (isMatchesTrue) {
      return i;
    }
  }

  throw new Error('Too high value');
}
