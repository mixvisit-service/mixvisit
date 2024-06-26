import { FrameSize } from '../../types/index';
import { BrowserUtils } from '../../utils/browser';
import { getBaseScreenFrame } from './screenFrame';
import { processSize } from './utils';

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
