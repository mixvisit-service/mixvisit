import { hasProperty } from '../utils/helpers';

type BatteryInfo = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
};

export async function getBatteryData(): Promise<BatteryInfo | null> {
  if (hasProperty(navigator, 'getBattery')) {
    const battery = await navigator.getBattery();

    return {
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level,
    };
  }

  return null;
}
