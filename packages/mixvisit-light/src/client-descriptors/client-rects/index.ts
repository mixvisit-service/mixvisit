import { createElementsAndGetClientRects } from './dom';
import type { ClientRect } from './dom';
import { withIframe } from '../../utils/helpers';

export async function getClientRects(): Promise<ClientRect[]> {
  return withIframe({ action: createElementsAndGetClientRects });
}
