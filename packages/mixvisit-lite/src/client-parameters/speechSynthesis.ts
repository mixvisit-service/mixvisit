import { hasProperty } from '../utils/helpers';

export async function getSpeechSynthesisVoices(): Promise<SpeechSynthesisVoice[] | null> {
  if (hasProperty(window, 'speechSynthesis')) {
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();

      if (voices.length) {
        resolve(transformVoices(voices));
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(transformVoices(voices));
        };
      }
    });
  }

  return null;
}

function transformVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.map((voice) => ({
    default: voice.default,
    lang: voice.lang,
    localService: voice.localService,
    name: voice.name,
    voiceURI: voice.voiceURI,
  }));
}
