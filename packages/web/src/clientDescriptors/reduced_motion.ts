import { mediaQueryMatcher } from '../utils/utils';

export function isMotionReduced(): boolean | null {
  const matchForReducedMotion = mediaQueryMatcher('prefers-reduced-motion') as (value: string) => boolean;

  if (matchForReducedMotion('reduce')) {
    return true;
  }

  if (matchForReducedMotion('no-preference')) {
    return false;
  }

  return null;
}
