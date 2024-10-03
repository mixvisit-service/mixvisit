import { hasProperty } from '../utils/helpers';

export function isHaveBatteryAPI(): boolean {
  return !!hasProperty(navigator, 'getBattery');
}
