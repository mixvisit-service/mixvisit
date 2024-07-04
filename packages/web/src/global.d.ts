/* Browser APIs not described by TypeScript */

interface Window {
  openDatabase?(...args: unknown[]): void;
  ApplePaySession?: ApplePaySessionConstructor;
  __fpjs_d_m?: unknown;
}

interface Navigator {
  userAgentData?: NavigatorUAData;
  oscpu?: string;
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
  deviceMemory?: number;
  cpuClass?: string;
  readonly msMaxTouchPoints?: number;
  connection?: {
    ontypechange?: () => void;
  };
}

interface NavigatorUABrandVersion {
  readonly brand: string;
  readonly version: string;
}

interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
}

interface UADataValues {
  readonly brands?: NavigatorUABrandVersion[];
  readonly mobile?: boolean;
  readonly platform?: string;
  readonly architecture?: string;
  readonly bitness?: string;
  readonly formFactor?: string[];
  readonly model?: string;
  readonly platformVersion?: string;
  /** @deprecated in favour of fullVersionList */
  readonly uaFullVersion?: string;
  readonly fullVersionList?: NavigatorUABrandVersion[];
  readonly wow64?: boolean;
}

interface NavigatorUAData extends UALowEntropyJSON {
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
  toJSON(): UALowEntropyJSON;
}

interface Document {
  msFullscreenElement?: typeof document.fullscreenElement;
  mozFullScreenElement?: typeof document.fullscreenElement;
  webkitFullscreenElement?: typeof document.fullscreenElement;
  msExitFullscreen?: typeof document.exitFullscreen;
  mozCancelFullScreen?: typeof document.exitFullscreen;
  webkitExitFullscreen?: typeof document.exitFullscreen;
}

interface Screen {
  availLeft?: number;
  availTop?: number;
}

interface Element {
  webkitRequestFullscreen?: typeof Element.prototype.requestFullscreen;
}

interface CSSStyleDeclaration {
  zoom: string;
  textSizeAdjust: string;
}

interface ApplePaySessionConstructor {
  new(version: number, request: Record<never, never>): never;
  canMakePayments(): boolean;
}

interface HTMLAnchorElement {
  attributionSourceId?: number;
  attributionsourceid?: number | string;
}

interface GPURequestAdapterOptions {
  compatibilityMode?: boolean;
}

interface GPUAdapter {
  readonly isCompatibilityMode: boolean;
}

type ExtendedGPUTextureUsage = typeof GPUTextureUsage & {
  readonly SAMPLED: GPUFlagsConstant;
  readonly OUTPUT_ATTACHMENT: GPUFlagsConstant;
  readonly STORAGE: GPUFlagsConstant;
};

interface Performance {
  readonly memory: {
    readonly jsHeapSizeLimit: number;
  };
}
