export const enum CanvasImageStatus {
  UNSUPPORTED = 'unsupported',
  SKIPPED = 'skipped',
  UNSTABLE = 'unstable',
}

export enum ErrorType {
  TIMEOUT = 'TimeoutError',
  INTERNAL = 'InternalError',
  RESPONSE = 'ResponseError',
}

export const enum ContrastPreferenceStatus {
  LESS = -1,
  NONE = 0,
  MORE = 1,
  FORCED_COLORS = 10,
}
