import { hasProperty } from '../utils/helpers';

type ColorSpaceSupport = {
  srgb: boolean;
  p3: boolean;
  rec2020: boolean;
};

export function getColorSpaceSupport(): ColorSpaceSupport {
  const colorSpaces = ['srgb', 'p3', 'rec2020'];
  const result = {} as ColorSpaceSupport;

  if (hasProperty(window, 'matchMedia')) {
    colorSpaces.forEach((space) => {
      result[space] = window.matchMedia(`(color-gamut: ${space})`).matches;
    });
  } else {
    colorSpaces.forEach((space) => {
      result[space] = false;
    });
  }

  return result;
}
