export function getAudioContextBaseLatency(): number | null {
  // @ts-ignore ts(2551)
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }

  const audioContext = new AudioContext();

  return audioContext.baseLatency ?? null;
}
