export function getMediaCapabilities(): MediaTrackSupportedConstraints | null {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints)) {
    console.warn('MediaDevices API is not supported');

    return null;
  }

  const result: MediaTrackSupportedConstraints = {};
  const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

  for (const constraint in supportedConstraints) {
    result[constraint] = supportedConstraints[constraint];
  }

  return result;
}
