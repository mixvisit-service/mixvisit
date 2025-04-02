/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-empty */

import {
  getNoiseFactor,
  getRenderedBuffer,
  getSnapshot,
  hasFakeAudio,
} from './utils';
import { getSum, miniHash, TDef } from '../../utils/helpers';

type AudioContextData = {
  lies: {
    sampleNoiseDetected: boolean;
    channelDataMismatch: boolean;
    audioFake: boolean;
    unexpectedFrequency: boolean;
  };
  noise: number;
  binsSample: string;
  copySample: string;
  sampleSum: number;
  totalUniqueSamples: number;
  compressorGainReduction: number;
  floatFrequencyDataSum: number;
  floatTimeDomainDataSum: number;
  analyserNode: {
    channelCount: number;
    channelCountMode: ChannelCountMode;
    channelInterpretation: ChannelInterpretation;
    fftSize: number;
    frequencyBinCount: number;
    maxDecibels: number;
    minDecibels: number;
    numberOfInputs: number;
    numberOfOutputs: number;
    smoothingTimeConstant: number;
    context: {
      sampleRate: number;
      listener: {
        forwardX: {
          maxValue: number;
        };
      };
    }
  };
  biquadFilterNode: {
    gain: {
      maxValue: number;
    };
    frequency: {
      defaultValue: number;
      maxValue: number;
    };
  };
  dynamicsCompressorNode: {
    attack: {
      defaultValue: number;
    };
    knee: {
      defaultValue: number;
      maxValue: number;
    };
    ratio: {
      defaultValue: number;
      maxValue: number;
    };
    release: {
      defaultValue: number;
      maxValue: number;
    };
    threshold: {
      defaultValue: number;
      minValue: number;
    };
  };
  oscillatorNode: {
    detune: {
      maxValue: number;
      minValue: number;
    };
    frequency: {
      defaultValue: number;
      maxValue: number;
      minValue: number;
    };
  };
};

export async function getAudioContext(): Promise<AudioContextData | null> {
  try {
    // @ts-expect-error if unsupported
    window.OfflineAudioContext = OfflineAudioContext || webkitOfflineAudioContext;
  } catch (err) { }

  if (!window.OfflineAudioContext) {
    return null;
  }

  const bufferLen = 5000;
  const lies = {
    sampleNoiseDetected: false,
    channelDataMismatch: false,
    audioFake: false,
    unexpectedFrequency: false,
  };

  const context = new OfflineAudioContext(1, bufferLen, 44100);
  const analyser = context.createAnalyser();
  const oscillator = context.createOscillator();
  const dynamicsCompressor = context.createDynamicsCompressor();
  const biquadFilter = context.createBiquadFilter();

  // detect lie -> floatFrequencyUniqueDataSize
  const dataArray = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData?.(dataArray);
  const floatFrequencyUniqueDataSize = new Set(dataArray).size;
  if (floatFrequencyUniqueDataSize > 1) {
    lies.unexpectedFrequency = true;
  }

  const [
    audioData,
    audioIsFake,
  ] = await Promise.all([
    getRenderedBuffer(new OfflineAudioContext(1, bufferLen, 44100)),
    hasFakeAudio().catch(() => false),
  ]);

  // detect lies -> audioIsFake
  if (audioIsFake) {
    lies.audioFake = true;
  }

  const {
    floatFrequencyData,
    floatTimeDomainData,
    buffer,
    compressorGainReduction,
  } = audioData || {};

  const floatFrequencyDataSum = getSum(floatFrequencyData);
  const floatTimeDomainDataSum = getSum(floatTimeDomainData);

  const copy = new Float32Array(bufferLen);
  let bins: Float32Array | [] = new Float32Array();
  if (buffer) {
    buffer.copyFromChannel(copy, 0);
    bins = buffer.getChannelData(0) || [];
  }

  const copySample = getSnapshot([...copy], 4500, 4600);
  const binsSample = getSnapshot([...bins], 4500, 4600);
  const sampleSum = getSum(getSnapshot([...bins], 4500, bufferLen));

  // detect lies -> sample matching
  const matching = `${binsSample}` === `${copySample}`;
  const copyFromChannelSupported = 'copyFromChannel' in AudioBuffer.prototype;
  if (copyFromChannelSupported && !matching) {
    lies.channelDataMismatch = true;
  }

  const totalUniqueSamples = new Set([...bins]).size;

  const noiseFactor = getNoiseFactor();
  const noise = noiseFactor || [...new Set(bins.slice(0, 100))].reduce((acc, n) => (acc += n), 0);

  // detect lies -> sample noise factor
  if (noise) {
    lies.sampleNoiseDetected = true;
  }

  const binsSampleValue = !TDef.isUndefined(binsSample[0]) ? miniHash(`${binsSample}`) : null;
  const copySampleValue = !TDef.isUndefined(copySample[0]) ? miniHash(`${copySample}`) : null;

  return {
    lies,
    noise,
    binsSample: binsSampleValue,
    copySample: copySampleValue,
    sampleSum: sampleSum || null,
    totalUniqueSamples,
    compressorGainReduction: compressorGainReduction || null,
    floatFrequencyDataSum: floatFrequencyDataSum || null,
    floatTimeDomainDataSum: floatTimeDomainDataSum || null,
    analyserNode: {
      channelCount: analyser.channelCount,
      channelCountMode: analyser.channelCountMode,
      channelInterpretation: analyser.channelInterpretation,
      fftSize: analyser.fftSize,
      frequencyBinCount: analyser.frequencyBinCount,
      maxDecibels: analyser.maxDecibels,
      minDecibels: analyser.minDecibels,
      numberOfInputs: analyser.numberOfInputs,
      numberOfOutputs: analyser.numberOfOutputs,
      smoothingTimeConstant: analyser.smoothingTimeConstant,
      context: {
        sampleRate: analyser.context.sampleRate,
        listener: {
          forwardX: {
            maxValue: analyser.context.listener.forwardX.maxValue,
          },
        },
      },
    },
    biquadFilterNode: {
      gain: {
        maxValue: biquadFilter.gain.maxValue,
      },
      frequency: {
        defaultValue: biquadFilter.frequency.defaultValue,
        maxValue: biquadFilter.frequency.maxValue,
      },
    },
    dynamicsCompressorNode: {
      attack: {
        defaultValue: dynamicsCompressor.attack.defaultValue,
      },
      knee: {
        defaultValue: dynamicsCompressor.knee.defaultValue,
        maxValue: dynamicsCompressor.knee.maxValue,
      },
      ratio: {
        defaultValue: dynamicsCompressor.ratio.defaultValue,
        maxValue: dynamicsCompressor.ratio.maxValue,
      },
      release: {
        defaultValue: dynamicsCompressor.release.defaultValue,
        maxValue: dynamicsCompressor.release.maxValue,
      },
      threshold: {
        defaultValue: dynamicsCompressor.threshold.defaultValue,
        minValue: dynamicsCompressor.threshold.minValue,
      },
    },
    oscillatorNode: {
      detune: {
        maxValue: oscillator.detune.maxValue,
        minValue: oscillator.detune.minValue,
      },
      frequency: {
        defaultValue: oscillator.frequency.defaultValue,
        maxValue: oscillator.frequency.maxValue,
        minValue: oscillator.frequency.minValue,
      },
    },
  };
}
