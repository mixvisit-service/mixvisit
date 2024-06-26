import { UnwrapPromise } from './utils';
import type { Descriptors } from '../client-descriptors/index';

export type DescriptorsRes = {
  [K in keyof Descriptors]: UnwrapPromise<ReturnType<Descriptors[K]>>;
};

export interface FPClientInterface {
  loadTime: number | null;
  fingerprintHash: string | null;
  load(): Promise<void>;
  get(key?: keyof Descriptors): DescriptorsRes[keyof DescriptorsRes] | DescriptorsRes | null;
}

export type CanvasContext = WebGLRenderingContext & { readonly canvas: HTMLCanvasElement };
