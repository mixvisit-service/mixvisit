/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-empty */

import { getRenderedBuffer, getSnapshot } from './utils';
import { getSum, miniHash, TDef } from '../../utils/helpers';

type AudioContextData = {
  totalUniqueSamples: number;
  compressorGainReduction: number;
  floatFrequencyDataSum: number;
  floatTimeDomainDataSum: number;
  sampleSum: number;
  binsSample: string;
  copySample: string;
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
  const context = new OfflineAudioContext(1, bufferLen, 44100);
  const analyser = context.createAnalyser();
  const oscillator = context.createOscillator();
  const dynamicsCompressor = context.createDynamicsCompressor();
  const biquadFilter = context.createBiquadFilter();

  const audioData = await getRenderedBuffer(new OfflineAudioContext(1, bufferLen, 44100));
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

  const copyArr = [...copy];
  const binsArr = [...bins];

  const copySample = getSnapshot(copyArr, 4500, 4600);
  const binsSample = getSnapshot(binsArr, 4500, 4600);
  const sampleSum = getSum(getSnapshot(binsArr, 4500, bufferLen));

  const binsSampleValue = !TDef.isUndefined(copySample[0]) ? miniHash(`${binsSample}`) : null;
  const copySampleValue = !TDef.isUndefined(copySample[0]) ? miniHash(`${copySample}`) : null;
  const totalUniqueSamples = new Set(binsArr).size;

  return {
    totalUniqueSamples,
    compressorGainReduction: compressorGainReduction || null,
    floatFrequencyDataSum: floatFrequencyDataSum || null,
    floatTimeDomainDataSum: floatTimeDomainDataSum || null,
    sampleSum: sampleSum || null,
    binsSample: binsSampleValue,
    copySample: copySampleValue,
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
