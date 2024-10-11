import type { UnwrapPromise } from './utils';
import type { ClientParameters } from '../client-parameters';
import type { ContextualClientParameters } from '../contextual-client-parameters';

export type UnwrappedParameters<T extends Record<string, any>> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>;
};

export type CompleteClientData = UnwrappedParameters<ClientParameters> & UnwrappedParameters<ContextualClientParameters>;
export type GetterResults = CompleteClientData[keyof CompleteClientData] | CompleteClientData | null;

export interface MixVisitInterface {
  loadTime: number | null;
  fingerprintHash: string | null;
  load(): Promise<void>;
  get(key?: keyof CompleteClientData): GetterResults;
}

export type CanvasContext = WebGLRenderingContext & { readonly canvas: HTMLCanvasElement };
