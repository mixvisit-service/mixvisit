import { MixVisit, type ClientData } from '@mix-visit/lite';

import type { MixVisitResult } from '$lib/types';

/**
 * Retrieves client data using the MixVisit library.
 *
 * @returns {Promise<MixVisitResult>} A promise that resolves to an object
 * containing the fingerprint hash, load time, and client data.
 */
export async function getMixVisitClientData(): Promise<MixVisitResult> {
  const mixvisit = new MixVisit();
  await mixvisit.load({ timeout: 1000, exclude: ['webrtc'] });

  const data: ClientData = mixvisit.get();
  const { fingerprintHash, loadTime } = mixvisit;

  return {
    fingerprintHash,
    loadTime,
    data,
  };
}
