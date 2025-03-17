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

const AUDIO_TRAP = Math.random();

function getRandFromRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCopyFrom(rand: number, buffer: AudioBuffer, copy: Float32Array): number[] {
  const { length } = buffer;

  const max = 20;
  const start = getRandFromRange(275, length - (max + 1));
  const mid = start + max / 2;
  const end = start + max;

  buffer.getChannelData(0)[start] = rand;
  buffer.getChannelData(0)[mid] = rand;
  buffer.getChannelData(0)[end] = rand;
  buffer.copyFromChannel(copy, 0);

  const attack = [
    buffer.getChannelData(0)[start] === 0 ? Math.random() : 0,
    buffer.getChannelData(0)[mid] === 0 ? Math.random() : 0,
    buffer.getChannelData(0)[end] === 0 ? Math.random() : 0,
  ];

  const bufferData = buffer.getChannelData(0);
  const combined = [...bufferData, ...copy, ...attack];
  const unique = [...new Set(combined)];
  const filtered = unique.filter((x) => x !== 0);

  return filtered;
}

function getCopyTo(rand: number, buffer: AudioBuffer, copy: Float32Array): number[] {
  const filledCopy = copy.map(() => rand);
  buffer.copyToChannel(filledCopy, 0);

  const bufferData = buffer.getChannelData(0);
  const [frequency] = bufferData;
  const dataAttacked = [...bufferData].map((x) => (x !== frequency || x === 0 ? Math.random() : x));

  return dataAttacked.filter((x) => x !== frequency);
}

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

export function hasFakeAudio(): Promise<boolean> {
  const context = new OfflineAudioContext(1, 100, 44100);
  const oscillator = context.createOscillator();
  oscillator.frequency.value = 0;
  oscillator.start(0);
  context.startRendering();

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 2500);

    context.oncomplete = (event) => {
      clearTimeout(timeout);

      const channelData = event.renderedBuffer.getChannelData?.(0);
      if (!channelData) {
        resolve(false);

        return;
      }

      const isFake = `${[...new Set(channelData)]}` !== '0';
      resolve(isFake);
    };
  }).finally(() => oscillator.disconnect()) as Promise<boolean>;
}

export function getNoiseFactor(): number {
  const length = 2000;

  try {
    const buffer = new AudioBuffer({ length, sampleRate: 44100 });
    const copy = new Float32Array(length);

    const copyFromResult = getCopyFrom(AUDIO_TRAP, buffer, copy);
    const copyToResult = getCopyTo(AUDIO_TRAP, buffer, copy);

    const uniqueValues = [...new Set([...copyFromResult, ...copyToResult])];
    const sum = uniqueValues.reduce((acc, n) => acc + +n, 0);

    return +(uniqueValues.length !== 1 && sum);
  } catch {
    return 0;
  }
}

export function getSnapshot(arr: number[], start: number, end: number): number[] {
  const collection: number[] = [];
  for (let i = start; i < end; i++) {
    collection.push(arr[i]);
  }

  return collection;
}
