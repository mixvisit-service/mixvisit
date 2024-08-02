import { isPromise, suppressUnhandledRejectionWarning } from '../../utils/helpers';

/**
 * Renders the given audio context with configured nodes.
 * Returns `null` when the rendering runs out of attempts
 */
export function renderAudio(context: OfflineAudioContext): Promise<AudioBuffer | null> {
  return new Promise<AudioBuffer | null>((resolve, reject) => {
    const retryDelay = 200;
    let attemptsLeft = 25;

    context.oncomplete = (event) => resolve(event.renderedBuffer);

    const tryRender = () => {
      try {
        const renderingPromise = context.startRendering();

        // `context.startRendering` has two APIs: Promise and callback, we check that it's really a promise just in case
        if (isPromise(renderingPromise)) {
          // Suppresses all unhandled rejections in case of scheduled redundant retries after successful rendering
          suppressUnhandledRejectionWarning(renderingPromise);
        }

        // Sometimes the audio context doesn't start after calling `startRendering`
        // (in addition to the cases where audio context doesn't start at all).
        // A known case is starting an audio context when the browser tab is in background on iPhone.
        // Retries usually help in this case
        if (context.state === 'suspended') {
          // The audio context can reject starting until the tab is in foreground.
          // Long fingerprint duration in background isn't a problem, therefore the retry attempts don't count in background.
          // It can lead to a situation when a fingerprint takes very long time and finishes successfully.
          // FYI, the audio context can be suspended when `document.hidden === false` and start running after a retry
          if (!document.hidden) {
            attemptsLeft--;
          }

          if (attemptsLeft > 0) {
            setTimeout(tryRender, retryDelay);
          } else {
            resolve(null);
          }
        }
      } catch (error) {
        reject(error);
      }
    };

    tryRender();
  });
}

export function extractFingerprint(baseSignal: AudioBuffer, clonedSample: Float32Array): number {
  let fingerprint: number | null = null;
  let needsDenoising = false;

  for (let i = 0; i < clonedSample.length; i += Math.floor(clonedSample.length / 10)) {
    // In some cases the signal is 0 on a short range for some reason. Ignoring such samples
    if (!clonedSample[i]) {
      continue;
    }

    if (fingerprint === null) {
      fingerprint = clonedSample[i];
      continue;
    }

    if (fingerprint !== clonedSample[i]) {
      needsDenoising = true;
      break;
    }
  }

  // The looped buffer source works incorrectly in old Safari versions (>14 desktop, >15 mobile).
  // The looped signal contains only 0s. To fix it, the loop start should be `baseSignal.length - 1.00000000001` and
  // the loop end should be `baseSignal.length + 0.00000000001` (there can be 10 or 11 0s after the point).
  // But this solution breaks the looped signal in other browsers. Instead of checking the browser version, we check that the
  // looped signals comprises only 0s, and if it does, we return the last value of the base signal, because old Safari
  // versions don't add noise that we want to cancel
  if (fingerprint === null) {
    fingerprint = baseSignal.getChannelData(0)[baseSignal.length - 1];
  } else if (needsDenoising) {
    fingerprint = getMiddle(clonedSample);
  }

  return fingerprint;
}

/**
 * Truncates some digits of the number to make it stable.
 * `precision` is the number of significant digits to keep.
 * The number may be not integer:
 *  - If it ends with `.2`, the last digit is rounded to the nearest multiple of 5;
 *  - If it ends with `.5`, the last digit is rounded to the nearest even number;
 */
export function stabilize(value: number, precision: number): number {
  if (value === 0) {
    return value;
  }

  const power = Math.floor(Math.log10(Math.abs(value)));
  const precisionPower = power - Math.floor(precision) + 1;
  const precisionBase = 10 ** -precisionPower * ((precision * 10) % 10 || 1);

  return Math.round(value * precisionBase) / precisionBase;
}

/**
 * Calculates the middle between the minimum and the maximum array item
 */
function getMiddle(signal: ArrayLike<number>): number {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < signal.length; i++) {
    const value = signal[i];
    // In very rare cases the signal is 0 on a short range for some reason. Ignoring such samples.
    if (value === 0) {
      continue;
    }

    if (value < min) {
      min = value;
    }

    if (value > max) {
      max = value;
    }
  }

  return (min + max) / 2;
}
