import { MixVisit, type ClientData } from '@mix-visit/lite';

import type { MixVisitResult } from '../types';

export async function getMixVisitClientData(): Promise<MixVisitResult> {
  const mixvisit = new MixVisit();
  await mixvisit.load({ timeout: 1000 });

  const data: ClientData = mixvisit.get();
  const { fingerprintHash, loadTime } = mixvisit;

  return {
    fingerprintHash,
    loadTime,
    data,
  };
}
