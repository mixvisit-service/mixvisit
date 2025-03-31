import type { UnwrapPromise } from './utils';
import type { ClientParameters } from '../client-parameters';
import type { ContextualClientParameters } from '../contextual-client-parameters';

export type ParametersResultType<T> = {
  value?: T;
  duration?: number;
  error?: {
    code: string;
    message: string;
  };
};

export type UnwrappedParameters<T extends Record<string, any>> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>;
};

export type Result<T> = {
  [K in keyof T]: T[K] extends Promise<infer R> | infer R
    ? ParametersResultType<R>
    : never;
};

export type LoadOptions = {
  exclude?: string[];
  timeout?: number;
};

export type ClientData = Result<UnwrappedParameters<ClientParameters>> & Result<UnwrappedParameters<ContextualClientParameters>>;
export type GetterResults =
  | ClientData[keyof ClientData]['value']
  | ClientData[keyof ClientData]['error']
  | ClientData
  | null;

export interface MixVisitInterface {
  loadTime: number | null;
  fingerprintHash: string | null;
  load(options?: LoadOptions): Promise<void>;
  get(key?: keyof ClientData): GetterResults;
}
