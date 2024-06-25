import { mediaQueryMatcher } from '../utils/utils';

export function isTransparencyReduced(): boolean | null {
  const matchForReducedTransparency = mediaQueryMatcher('prefers-reduced-transparency') as (value: string) => boolean;

  if (matchForReducedTransparency('reduce')) {
    return true;
  }

  if (matchForReducedTransparency('no-preference')) {
    return false;
  }

  return null;
}
