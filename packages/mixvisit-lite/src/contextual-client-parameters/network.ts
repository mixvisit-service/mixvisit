import { hasProperty } from '../utils/helpers';

export function getNetworkData(): Connection | null {
  if (hasProperty(navigator, 'connection')) {
    const { connection } = navigator;

    return {
      type: connection.type ?? null,
      effectiveType: connection.effectiveType ?? null,
      downlink: connection.downlink ?? null,
      downlinkMax: connection.downlinkMax ?? null,
      rtt: connection.rtt ?? null,
      saveData: connection.saveData ?? null,
    };
  }

  return null;
}
