/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-empty */

import { hasProperty } from '../../utils/helpers';

type AudioData = {
  floatFrequencyData: Float32Array;
  floatTimeDomainData: Float32Array;
  buffer: AudioBuffer;
  compressorGainReduction: number;
};

export function getRenderedBuffer(context: OfflineAudioContext): Promise<AudioData | null> {
  return new Promise((resolve) => {
    const analyser = context.createAnalyser();
    const oscillator = context.createOscillator();
    const dynamicsCompressor = context.createDynamicsCompressor();

    try {
      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;
      dynamicsCompressor.threshold.value = -50;
      dynamicsCompressor.knee.value = 40;
      dynamicsCompressor.attack.value = 0;
    } catch (err) { }

    oscillator.connect(dynamicsCompressor);
    dynamicsCompressor.connect(analyser);
    dynamicsCompressor.connect(context.destination);

    oscillator.start(0);
    context.startRendering();

    context.addEventListener('complete', (event) => {
      try {
        dynamicsCompressor.disconnect();
        oscillator.disconnect();

        const floatFrequencyData = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(floatFrequencyData);

        const floatTimeDomainData = new Float32Array(analyser.fftSize);
        if (hasProperty(analyser, 'getFloatTimeDomainData')) {
          analyser.getFloatTimeDomainData(floatTimeDomainData);
        }

        return resolve({
          floatFrequencyData,
          floatTimeDomainData,
          buffer: event.renderedBuffer,
          compressorGainReduction: (
            // @ts-expect-error if unsupported
            dynamicsCompressor.reduction.value || dynamicsCompressor.reduction
          ),
        });
      } catch (err) {
        return resolve(null);
      }
    });
  });
}

export function getSnapshot(arr: number[], start: number, end: number): number[] {
  const collection: number[] = [];
  for (let i = start; i < end; i++) {
    collection.push(arr[i]);
  }

  return collection;
}
