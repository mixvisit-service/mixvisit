import { hasProperty } from '../utils/helpers';

export function isHaveBluetoothAPI(): boolean {
  return hasProperty(navigator, 'bluetooth');
}
