export const enum CanvasImageStatus {
  Unsupported = 'unsupported',
  Skipped = 'skipped',
  Unstable = 'unstable',
}

export const enum AudioFingerprintStatus {
  /** The browser is known for always suspending audio context, thus making fingerprinting impossible */
  KnownForSuspending = -1,
  /** The browser doesn't support audio context */
  NotSupported = -2,
  /** An unexpected timeout has happened */
  Timeout = -3,
}

export const enum ContrastPreferenceStatus {
  Less = -1,
  None = 0,
  More = 1,
  ForcedColors = 10,
}

export const enum WebGLStatus {
  /** WebGl context is not available */
  NoWebGLContext = -1,
  /** WebGL context `getParameter` method is not a function */
  GetParameterNotAFunction = -2,
}
