export type Values<T> = T[keyof T];
export type MaybePromise<T> = Promise<T> | T;
export type UnwrapPromise<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
