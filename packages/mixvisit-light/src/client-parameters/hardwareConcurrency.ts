import { replaceNaN, toInt } from '../utils/helpers';

export function getHardwareConcurrency(): number | null {
  return replaceNaN(toInt(navigator.hardwareConcurrency), null);
}
