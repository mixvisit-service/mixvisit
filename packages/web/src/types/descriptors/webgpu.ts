export type WebGPUInfo = {
  api: WebGPUAPI;
  supportedAdapters?: WebGPUSupportedAdapters;
};

export type WebGPUAPI = {
  gpu?: boolean;
  adapter?: boolean;
  device?: boolean;
  context?: boolean;
  compat?: boolean;
  offscreen?: boolean;
  twoD?: boolean;
};

export type WebGPUSupportedAdapters = {
  fallback: WebGPUParams | null;
  highPerformance: WebGPUParams | null;
};

export type WebGPUParams = {
  info: GPUAdapterInfo;
  limits: GPUSupportedLimits;
  features: string[];
  textureFormatCapabilities: string[] | null;
  flags: {
    isCompatibilityMode: boolean;
    isFallbackAdapter: boolean;
  }
};

export type WebGPUSupportedAdaptersParam = {
  fallback: AdaptersOption;
  highPerformance: AdaptersOption;
};

export type AdaptersOption = {
  powerPreference: 'high-performance' | 'low-power';
  forceFallbackAdapter?: boolean;
};
