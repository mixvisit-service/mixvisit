import { MaybePromise } from '../types/index';

export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => { setTimeout(resolve, durationMs, resolveWith); });
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

export function hasProperty<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> {
  return Object.hasOwn(obj, key);
}

export function isPromise<T>(value: PromiseLike<T> | unknown): value is PromiseLike<T> {
  return !!value && typeof (value as PromiseLike<T>).then === 'function';
}

export function isFunctionNative(func: (...args: unknown[]) => unknown): boolean {
  return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func));
}

export function toGBString(bytes: number): string | null {
  return bytes ? `${+(+(bytes) / 1073741824).toFixed(2)} GB` : null;
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

export function round(value: number, base = 1): number {
  if (Math.abs(base) >= 1) {
    return Math.round(value / base) * base;
  }

  const counterBase = 1 / base;

  return Math.round(value * counterBase) / counterBase;
}

export function getFullscreenElement(): Element | null {
  return document.fullscreenElement
    || document.msFullscreenElement
    || document.mozFullScreenElement
    || document.webkitFullscreenElement
    || null;
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

type WithIframeProps<T> = {
  action: (iframe: HTMLIFrameElement, iWindow: typeof window) => MaybePromise<T>,
  initialHtml?: string,
  domPollInterval?: number,
};

/**
 * Creates and keeps an invisible iframe while the given function runs.
 * The given function is called when the iframe is loaded and has a body.
 * The iframe allows to measure DOM sizes inside itself.
 *
 * Notice: passing an initial HTML code doesn't work in IE
 */
export async function withIframe<T>({
  action,
  initialHtml,
  domPollInterval = 50,
}: WithIframeProps<T>): Promise<T> {
  // document.body can be null while the page is loading
  while (!document.body) {
    // eslint-disable-next-line no-await-in-loop
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
      // eslint-disable-next-line no-await-in-loop
      await wait(domPollInterval);
    }

    return await action(iframe, iframe.contentWindow as typeof window);
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
