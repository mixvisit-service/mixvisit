import { MixVisit, type CompleteClientData } from '@mix-visit/light';

type MixVisitResult = {
  fingerprintHash: string | null;
  loadTime: number | null;
  data: CompleteClientData | null;
};

export async function getMixVisitClientData(): Promise<MixVisitResult> {
  const mixvisit = new MixVisit();
  await mixvisit.load();

  const data: CompleteClientData = mixvisit.get();
  const { fingerprintHash, loadTime } = mixvisit;

  return {
    fingerprintHash,
    loadTime,
    data,
  };
}
