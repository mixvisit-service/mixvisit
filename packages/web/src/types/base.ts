import { UnwrapPromise } from './utils';
import type { ClientParameters } from '../client-parameters/index';

export type CompleteClientData = {
  [K in keyof ClientParameters]: UnwrapPromise<ReturnType<ClientParameters[K]>>;
};

export interface FPClientInterface {
  loadTime: number | null;
  fingerprintHash: string | null;
  load(): Promise<void>;
  get(key?: keyof ClientParameters): CompleteClientData[keyof CompleteClientData] | CompleteClientData | null;
}

export type CanvasContext = WebGLRenderingContext & { readonly canvas: HTMLCanvasElement };
