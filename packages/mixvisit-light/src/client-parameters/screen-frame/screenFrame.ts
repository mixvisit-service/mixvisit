import { getCurrentScreenFrame, isFrameSizeNull } from './utils';
import type { FrameSize } from '../../types/index';
import { exitFullscreen, getFullscreenElement } from '../../utils/helpers';

let screenFrameBackup: Readonly<FrameSize> | null = null;
let screenFrameSizeTimeoutId: number | null = null;

export async function getBaseScreenFrame(): Promise<FrameSize> {
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
export function watchScreenFrame(): void {
  if (screenFrameSizeTimeoutId !== null) {
    return;
  }

  const screenFrameCheckInterval = 2500;

  const checkScreenFrame = () => {
    const frameSize = getCurrentScreenFrame();
    if (isFrameSizeNull(frameSize)) {
      screenFrameSizeTimeoutId = (setTimeout as typeof window.setTimeout)(checkScreenFrame, screenFrameCheckInterval);
    } else {
      screenFrameBackup = frameSize;
      screenFrameSizeTimeoutId = null;
    }
  };

  checkScreenFrame();
}
