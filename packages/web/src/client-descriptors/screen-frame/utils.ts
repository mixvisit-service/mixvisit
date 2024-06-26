import { FrameSize } from '../../types/index';
import {
  replaceNaN,
  round,
  toFloat,
} from '../../utils/helpers';

export function processSize(sideSize: FrameSize[number]): number | null {
  const roundingPrecision = 10;

  return sideSize === null
    ? null
    : round(sideSize, roundingPrecision);
}

export function getCurrentScreenFrame(): FrameSize {
  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`.
  // The property values are replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`
  return [
    replaceNaN(toFloat(window.screen.availTop), null),
    replaceNaN(toFloat(window.screen.width) - toFloat(window.screen.availWidth) - replaceNaN(toFloat(window.screen.availLeft), 0), null),
    replaceNaN(toFloat(window.screen.height) - toFloat(window.screen.availHeight) - replaceNaN(toFloat(window.screen.availTop), 0), null),
    replaceNaN(toFloat(window.screen.availLeft), null),
  ];
}

export function isFrameSizeNull(frameSize: FrameSize): boolean {
  for (let i = 0; i < 4; ++i) {
    if (frameSize[i]) {
      return false;
    }
  }

  return true;
}
