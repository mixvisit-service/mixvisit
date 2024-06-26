import { replaceNaN, toFloat } from '../utils/utils';

export function getDeviceMemory(): number | null {
  // `navigator.deviceMemory` is a string containing a number in some unidentified cases
  return replaceNaN(toFloat(navigator.deviceMemory), null);
}
