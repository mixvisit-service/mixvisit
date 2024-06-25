import { BrowserUtils } from '../utils/browser';
import {
  exitFullscreen,
  getFullscreenElement,
  replaceNaN,
  round,
  toFloat,
} from '../utils/utils';

/**
 * The order matches the CSS side order: top, right, bottom, left
 */
type FrameSize = [
  number | null,
  number | null,
  number | null,
  number | null,
];

const screenFrameCheckInterval = 2500;
const roundingPrecision = 10;

let screenFrameBackup: Readonly<FrameSize> | undefined;
let screenFrameSizeTimeoutId: number | undefined;

/**
 * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439.
 * A possible reason: macOS Dock shrinks to fit more icons when there is too little space.
 * The rounding is used to mitigate the difference
 */
export async function getScreenFrame(): Promise<FrameSize | null> {
  // The frame width is always 0 in private mode of Safari 17, so the frame is not used in Safari 17.
  if (BrowserUtils.isWebKit() && BrowserUtils.isWebKit616OrNewer() && BrowserUtils.isSafariWebKit()) {
    return null;
  }

  const frameSize = await getBaseScreenFrame();

  // In fact, such code is used to avoid TypeScript issues without using `as`
  return [
    processSize(frameSize[0]),
    processSize(frameSize[1]),
    processSize(frameSize[2]),
    processSize(frameSize[3]),
  ];
}

async function getBaseScreenFrame(): Promise<FrameSize> {
  watchScreenFrame();

  let frameSize = getCurrentScreenFrame();

  if (isFrameSizeNull(frameSize)) {
    if (screenFrameBackup) {
      return [...screenFrameBackup];
    }

    if (getFullscreenElement()) {
      // Some browsers set the screen frame to zero when programmatic fullscreen is on.
      // There is a chance of getting a non-zero frame after exiting the fullscreen.
      await exitFullscreen();
      frameSize = getCurrentScreenFrame();
    }
  }

  if (!isFrameSizeNull(frameSize)) {
    screenFrameBackup = frameSize;
  }

  return frameSize;
}

/**
 * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
 * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
 * This trick is required to mitigate the fact that the screen frame turns null in some cases.
 */
function watchScreenFrame(): void {
  if (screenFrameSizeTimeoutId !== undefined) {
    return;
  }

  const checkScreenFrame = () => {
    const frameSize = getCurrentScreenFrame();
    if (isFrameSizeNull(frameSize)) {
      screenFrameSizeTimeoutId = (setTimeout as typeof window.setTimeout)(checkScreenFrame, screenFrameCheckInterval);
    } else {
      screenFrameBackup = frameSize;
      screenFrameSizeTimeoutId = undefined;
    }
  };

  checkScreenFrame();
}

function getCurrentScreenFrame(): FrameSize {
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

function isFrameSizeNull(frameSize: FrameSize): boolean {
  for (let i = 0; i < 4; ++i) {
    if (frameSize[i]) {
      return false;
    }
  }

  return true;
}

function processSize(sideSize: FrameSize[number]): number | null {
  return sideSize === null
    ? null
    : round(sideSize, roundingPrecision);
}
