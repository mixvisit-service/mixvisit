import type { UnwrapPromise } from './utils';
import type { ClientParameters } from '../client-parameters/index';
import type { ContextualClientParameters } from '../contextual-client-parameters/index';

type UnwrappedParameters<T extends Record<string, any>> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>;
};

export type UnwrappedClientParameters = UnwrappedParameters<ClientParameters>;
export type UnwrappedContextualClientParameters = UnwrappedParameters<ContextualClientParameters>;

export type CompleteClientData = UnwrappedClientParameters & UnwrappedContextualClientParameters;

export type GetterResults =
  | CompleteClientData[keyof CompleteClientData]
  | CompleteClientData
  | null;

export interface FPClientInterface {
  loadTime: number | null;
  fingerprintHash: string | null;
  load(): Promise<void>;
  get(key?: keyof CompleteClientData): GetterResults;
}

export type CanvasContext = WebGLRenderingContext & { readonly canvas: HTMLCanvasElement };
