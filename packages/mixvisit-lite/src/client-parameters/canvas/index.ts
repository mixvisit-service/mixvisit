import { renderImages } from './images';
import { doesSupportWinding, makeCanvasContext } from './utils';
import { isSafariWebKit, isWebKit, isWebKit616OrNewer } from '../../utils/browser';
import { CanvasImageStatus } from '../../utils/enums';

interface CanvasFingerprint {
  winding: boolean;
  geometry: string;
  text: string;
}

export async function getCanvasFingerprint(): Promise<CanvasFingerprint> {
  let winding = false;
  let geometry: string;
  let text: string;

  const [canvas, context] = makeCanvasContext();
  if (!(context && canvas.toDataURL)) {
    geometry = CanvasImageStatus.UNSUPPORTED;
    text = CanvasImageStatus.UNSUPPORTED;
  } else {
    winding = doesSupportWinding(context);

    // Checks if the current browser is known for applying anti-fingerprinting measures in all or some critical modes
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      geometry = CanvasImageStatus.SKIPPED;
      text = CanvasImageStatus.SKIPPED;
    } else {
      [geometry, text] = await renderImages(canvas, context);
    }
  }

  return { winding, geometry, text };
}
