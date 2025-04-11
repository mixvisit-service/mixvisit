import { detectCanvasFingerprinting } from './detect';
import { renderImages } from './images';
import { isWindingSupported, createCanvas, isCanvasSupported } from './utils';
import { isSafariWebKit, isWebKit, isWebKit616OrNewer } from '../../utils/browser';
import { CanvasImageStatus } from '../../utils/enums';

interface CanvasFingerprint {
  spoofing: boolean;
  winding: boolean;
  geometry: string;
  text: string;
}

export async function getCanvasFingerprint(): Promise<CanvasFingerprint> {
  let winding = false;
  let spoofing = false;
  let geometry: string;
  let text: string;

  const [canvas, context] = createCanvas();

  if (!isCanvasSupported(canvas, context)) {
    geometry = CanvasImageStatus.UNSUPPORTED;
    text = CanvasImageStatus.UNSUPPORTED;
  } else {
    winding = isWindingSupported(context);

    // Checks if the current browser is known for applying anti-fingerprinting measures in all or some critical modes
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      geometry = CanvasImageStatus.SKIPPED;
      text = CanvasImageStatus.SKIPPED;
    } else {
      const { diffIndexes } = await detectCanvasFingerprinting() ?? {};
      spoofing = !!diffIndexes && !!diffIndexes.join('');

      [geometry, text] = await renderImages(canvas, context);
    }
  }

  return {
    spoofing,
    winding,
    geometry,
    text,
  };
}
