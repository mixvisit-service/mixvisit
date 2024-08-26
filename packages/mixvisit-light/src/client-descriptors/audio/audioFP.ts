import { extractFingerprint, renderAudio } from './utils';
import { BrowserUtils } from '../../utils/browser';
import { AudioFingerprintStatus } from '../../utils/enums';
import { wait, whenDocumentVisible } from '../../utils/helpers';

export async function getUnstableAudioFingerprint(): Promise<() => number> {
  let fingerprintResult: [true, number] | [false, unknown];

  // The timeout is not started until the browser tab becomes visible because some browsers may not want to render
  // an audio context in background.
  const timeoutPromise = whenDocumentVisible().then(() => wait(500));
  const fingerprintPromise = getBaseAudioFingerprint().then(
    (result) => { fingerprintResult = [true, result]; },
    (error) => { fingerprintResult = [false, error]; },
  );

  await Promise.race([timeoutPromise, fingerprintPromise]);

  return () => {
    if (!fingerprintResult) {
      return AudioFingerprintStatus.Timeout;
    }

    if (!fingerprintResult[0]) {
      throw fingerprintResult[1];
    }

    return fingerprintResult[1];
  };
}

async function getBaseAudioFingerprint(): Promise<number> {
  const cloneCount = 40000;
  const sampleRate = 44100;
  const targetSampleIndex = 3395;

  const AudioContext = window.OfflineAudioContext;
  if (!AudioContext) {
    return AudioFingerprintStatus.NotSupported;
  }

  // In some browsers, audio context always stays suspended unless the context is started in response to a user action
  // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time
  if (BrowserUtils.isWebKit() && !(BrowserUtils.isDesktopWebKit() || BrowserUtils.isWebKit606OrNewer())) {
    return AudioFingerprintStatus.KnownForSuspending;
  }

  const contextForBaseSignal = new AudioContext(1, targetSampleIndex + 1, sampleRate);
  const baseSignal = await getBaseSignal(contextForBaseSignal);
  if (!baseSignal) {
    return AudioFingerprintStatus.Timeout;
  }

  // This context copies the last sample of the base signal many times.
  // The array of copies helps to cancel the noise.
  const context = new AudioContext(1, baseSignal.length - 1 + cloneCount, sampleRate);
  const sourceNode = context.createBufferSource();
  sourceNode.buffer = baseSignal;
  sourceNode.loop = true;
  sourceNode.loopStart = (baseSignal.length - 1) / sampleRate;
  sourceNode.loopEnd = baseSignal.length / sampleRate;
  sourceNode.connect(context.destination);
  sourceNode.start();

  const clonedSignal = await renderAudio(context);
  if (!clonedSignal) {
    return AudioFingerprintStatus.Timeout;
  }

  const fingerprint = extractFingerprint(baseSignal, clonedSignal.getChannelData(0).subarray(baseSignal.length - 1));

  return Math.abs(fingerprint); // The fingerprint is made positive to avoid confusion with the special fingerprints
}

/**
 * Produces an arbitrary audio signal
 */
async function getBaseSignal(context: OfflineAudioContext): Promise<AudioBuffer | null> {
  const oscillator = context.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 1000;

  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -70;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  const filter = context.createBiquadFilter();
  filter.type = 'allpass';
  filter.frequency.value = 5.239622852977861;
  filter.Q.value = 0.1;

  oscillator.connect(compressor);
  compressor.connect(filter);
  filter.connect(context.destination);
  oscillator.start(0);

  return renderAudio(context);
}
