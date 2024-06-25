import { BrowserUtils } from '../utils/browser';
import { replaceNaN, toInt } from '../utils/utils';

type ScreenResolution = [number | null, number | null];

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 * The window resolution is always the document size in private mode of Safari 17,
 * so the window resolution is not used in Safari 17.
 */
export function getScreenResolution(): ScreenResolution | null {
  // the window resolution is not used in Safari 17
  const isNewSafari = BrowserUtils.isWebKit() && BrowserUtils.isWebKit616OrNewer() && BrowserUtils.isSafariWebKit();
  if (isNewSafari) {
    return null;
  }

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  const parseDimension = (value: unknown) => replaceNaN(toInt(value), null);

  const dimensions = [
    parseDimension(window.screen.width),
    parseDimension(window.screen.height),
  ] as ScreenResolution;

  dimensions.sort().reverse();

  return dimensions;
}
