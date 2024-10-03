export function isHaveFlash(): boolean {
  const { mimeTypes } = navigator;
  let flash: boolean = false;

  try {
    flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
  } catch (err) {
    if (
      mimeTypes
      && mimeTypes['application/x-shockwave-flash']
      && mimeTypes['application/x-shockwave-flash'].enabledPlugin
    ) {
      flash = true;
    }
  }

  return flash;
}
