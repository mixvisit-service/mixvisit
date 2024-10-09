import { hasProperty } from '../utils/helpers';

export function getWebKitAPIsInfo(): string[] {
  const webkitAPIs = [
    'onwebkitanimationend',
    'onwebkitanimationiteration',
    'onwebkitanimationstart',
    'onwebkittransitionend',
    'onwebkitfullscreenchange',
    'onwebkitfullscreenerror',
    'webkitMatchesSelector',
    'webkitRequestFullScreen',
    'webkitRequestFullscreen',
  ] as const;

  return webkitAPIs.filter((api) => hasProperty(document.documentElement, api));
}
