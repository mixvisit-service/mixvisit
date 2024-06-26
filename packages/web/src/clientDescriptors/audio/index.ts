import { getUnstableAudioFingerprint } from './audio_fp';
import { stabilize } from './utils';

/**
 * Calculates a stable audio fingerprint using Web Audio API
*/
export async function getAudioFingerprint(): Promise<number> {
  const stabilizationPrecision = 6.2;

  const finish = await getUnstableAudioFingerprint();
  const rawFingerprint = finish();

  return stabilize(rawFingerprint, stabilizationPrecision);
}
