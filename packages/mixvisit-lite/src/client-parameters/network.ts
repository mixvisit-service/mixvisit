import { hasProperty } from '../utils/helpers';

export async function isHaveNetworkAPI(): Promise<boolean> {
  return hasProperty(navigator, 'connection');
}
