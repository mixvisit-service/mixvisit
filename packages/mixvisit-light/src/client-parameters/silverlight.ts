import { hasProperty, TDef } from '../utils/helpers';

export function isHaveSilverlight(): boolean {
  if (hasProperty(window, 'ActiveXObject')) {
    try {
      // eslint-disable-next-line no-new
      new window.ActiveXObject('AgControl.AgControl');

      return true;
    } catch (err) {
      return false;
    }
  }

  const mimeType = navigator.mimeTypes['application/x-silverlight-2'];

  return !TDef.isUndefined(mimeType) && !TDef.isNull(mimeType.enabledPlugin);
}
