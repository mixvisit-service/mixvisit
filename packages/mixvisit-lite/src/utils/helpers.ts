/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import { x86 } from './hashing';
import { MaybePromise } from '../types';

export function type(value: any): string {
  const matches = Object.prototype.toString.call(value).match(/^\[object (\S+?)\]$/) || [];

  return matches[1]?.toLowerCase() || 'undefined';
}

export const TDef = {
  isString: (value: any) => type(value) === 'string',
  isNumber: (value: any) => type(value) === 'number',
  isNumberFinity: (value: any) => Number.isFinite(value),
  isNegativeInfinity: (value: any) => value === Number.NEGATIVE_INFINITY,
  isPositiveInfinity: (value: any) => value === Number.POSITIVE_INFINITY,
  isNaN: (value: any) => Number.isNaN(value),
  isObject: (value: any) => type(value) === 'object',
  isArray: (value: any) => type(value) === 'array',
  isBoolean: (value: any) => type(value) === 'boolean',
  isSymbol: (value: any) => type(value) === 'symbol',
  isUndefined: (value: any) => type(value) === 'undefined',
  isNull: (value: any) => type(value) === 'null',
  isDate: (value: any) => type(value) === 'date',
  isBigIng: (value: any) => type(value) === 'bigint',
  isMap: (value: any) => type(value) === 'map',
  isSet: (value: any) => type(value) === 'set',
  isWeakMap: (value: any) => type(value) === 'weakmap',
  isWeakSet: (value: any) => type(value) === 'weakset',
  isRegExp: (value: any) => type(value) === 'regexp',
  isFunc: (value: any) => ['asyncfunction', 'function'].includes(type(value)),
  isError: (value: any) => type(value) === 'error',
  isNil: (value: any) => TDef.isUndefined(value) || TDef.isNull(value),
};

export function getSum(arr?: Float32Array | number[]): number {
  return !arr ? 0 : [...arr].reduce((acc, curr) => (acc += Math.abs(curr)), 0);
}

export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs, resolveWith);
  });
}
export function miniHash(str: string): string {
  if (!TDef.isString(str)) {
    throw new TypeError('Expected a string');
  }

  return !str ? str : x86.hash128(str).slice(0, 10);
}

export function toInt(value: unknown): number {
  return parseInt(value as string, 10);
}

export function toFloat(value: unknown): number {
  return parseFloat(value as string);
}

export function replaceNaN<T, U>(value: T, replacement: U): T | U {
  return typeof value === 'number' && Number.isNaN(value) ? replacement : value;
}

export function calcTruthy(values: unknown[]): number {
  return values.reduce<number>((sum, value) => sum + (value ? 1 : 0), 0);
}

export function hasProperty<T extends object, K extends PropertyKey>(
  object: T,
  key: K,
): object is T & Record<K, unknown> {
  if (TDef.isNil(object)) {
    return false;
  }

  if (Object.hasOwn(object, key)) {
    return true;
  }

  return key in object;
}

export function isPromise<T>(value: PromiseLike<T> | unknown): value is PromiseLike<T> {
  return !!value && typeof (value as PromiseLike<T>).then === 'function';
}

export function isFunctionNative(func: (...args: unknown[]) => unknown): boolean {
  return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func));
}

export function mediaQueryMatcher(field: string, value?: string): boolean | ((value: string) => boolean) {
  if (value) {
    return matchMedia(`(${field}: ${value})`).matches;
  }

  return (valueForField: string): boolean => matchMedia(`(${field}: ${valueForField})`).matches;
}

/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises.
 * Otherwise, promise emits a console warning unless it has a `catch` listener
 */
export function suppressUnhandledRejectionWarning(promise: PromiseLike<unknown>): void {
  promise.then(null, () => null);
}

class ResponseError extends Error {
  data: any;

  response: Response;

  status: number;

  constructor(response: Response, data: any) {
    super(`Request failed with status ${response.status}`);

    this.data = data;
    this.name = 'ResponseError';
    this.response = response;
    this.status = response.status;
  }
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data: T = await response.json();

  if (response.ok) {
    return data;
  }

  throw new ResponseError(response, data);
}

export function round(value: number, base = 1): number {
  if (Math.abs(base) >= 1) {
    return Math.round(value / base) * base;
  }

  const counterBase = 1 / base;

  return Math.round(value * counterBase) / counterBase;
}

export function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement
    || document.msFullscreenElement
    || document.mozFullScreenElement
    || document.webkitFullscreenElement
    || null
  );
}

export function exitFullscreen(): Promise<void> {
  return (
    document.exitFullscreen
    || document.msExitFullscreen
    || document.mozCancelFullScreen
    || document.webkitExitFullscreen
  ).call(document);
}

export function getUTF8Bytes(input: string): Uint8Array {
  const result = new Uint8Array(input.length);

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);

    if (charCode > 127) {
      return new TextEncoder().encode(input);
    }

    result[i] = charCode;
  }

  return result;
}

type WithIframeProps<T, P extends any[]> = {
  action: (iframe: HTMLIFrameElement, iWindow: typeof window, ...args: P) => MaybePromise<T>;
  initialHtml?: string;
  domPollInterval?: number;
};

/**
 * Creates and keeps an invisible iframe while the given function runs.
 * The given function is called when the iframe is loaded and has a body.
 * The iframe allows to measure DOM sizes inside itself.
 *
 * Notice: passing an initial HTML code doesn't work in IE
 */
export async function withIframe<T, P extends any[]>({
  action,
  initialHtml,
  domPollInterval = 50,
}: WithIframeProps<T, P>, ...args: P): Promise<T> {
  // document.body can be null while the page is loading
  while (!document.body) {
    await wait(domPollInterval);
  }

  const iframe = document.createElement('iframe');

  try {
    await new Promise<void>((_resolve, _reject) => {
      let isComplete = false;

      const resolve = () => {
        isComplete = true;
        _resolve();
      };

      const reject = (error: unknown) => {
        isComplete = true;
        _reject(error);
      };

      iframe.onload = resolve;
      iframe.onerror = reject;

      const { style } = iframe;
      style.setProperty('display', 'block', 'important'); // Required for browsers to calculate the layout
      style.position = 'absolute';
      style.top = '0';
      style.left = '0';
      style.visibility = 'hidden';

      if (initialHtml && 'srcdoc' in iframe) {
        iframe.srcdoc = initialHtml;
      } else {
        iframe.src = 'about:blank';
      }

      document.body.appendChild(iframe);

      // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
      // This code checks for the loading state manually.
      const checkReadyState = () => {
        // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
        // So an infinite setTimeout loop can happen without this check.
        if (isComplete) {
          return;
        }

        // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
        // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
        if (iframe.contentWindow?.document?.readyState === 'complete') {
          resolve();
        } else {
          setTimeout(checkReadyState, 10);
        }
      };

      checkReadyState();
    });

    while (!iframe.contentWindow?.document?.body) {
      await wait(domPollInterval);
    }

    return await action(iframe, iframe.contentWindow as typeof window, ...args);
  } finally {
    iframe.parentNode?.removeChild(iframe);
  }
}

/**
 * The returned promise resolves when the tab becomes visible (in foreground).
 * If the tab is already visible, resolves immediately.
 */
export function whenDocumentVisible(): Promise<void> {
  return new Promise((resolve) => {
    const eventName = 'visibility-change';

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        document.removeEventListener(eventName, handleVisibilityChange);
        resolve();
      }
    };

    document.addEventListener(eventName, handleVisibilityChange);
    handleVisibilityChange();
  });
}
