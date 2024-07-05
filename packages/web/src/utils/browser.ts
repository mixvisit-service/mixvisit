import { calcTruthy, hasProperty, isFunctionNative } from './utils';

export class BrowserUtils {
  /**
   * Determines if the browser operates on Trident (the engine behind Internet Explorer)
   */
  public static isTrident(): boolean {
    return calcTruthy([
      hasProperty(window, 'MSCSSMatrix'),
      hasProperty(window, 'msSetImmediate'),
      hasProperty(window, 'msIndexedDB'),
      hasProperty(navigator, 'msMaxTouchPoints'),
      hasProperty(navigator, 'msPointerEnabled'),
    ]) >= 4;
  }

  /**
   * Determines if the browser is built on EdgeHTML (the engine powering pre-Chromium Edge)
   */
  public static isEdgeHTML(): boolean {
    return calcTruthy([
      hasProperty(window, 'msWriteProfilerMark'),
      hasProperty(window, 'MSStream'),
      hasProperty(navigator, 'msLaunchUri'),
      hasProperty(navigator, 'msSaveBlob'),
    ]) >= 3 && !BrowserUtils.isTrident();
  }

  /**
   * Determines if the browser identified as WebKit is Safari.
   * This function specifically identifies Safari browsers, not just any browser built on WebKit.
   * Caution: Accurate results are ensured for Safari version 15 and later
   */
  public static isSafariWebKit(): boolean {
    if (!isFunctionNative(window.print)) {
      return false; // Edge, Yandex, Chrome, Firefox, DuckDuckGo macOS
    }

    return calcTruthy([
      String((window as unknown as Record<string, unknown>).browser) === '[object WebPageNamespace]',
      hasProperty(window, 'MicrodataExtractor'),
    ]) >= 1;
  }

  /**
   * Determines if the browser is Safari, distinguishing between mobile and desktop.
   * Since all iOS browsers utilize WebKit (the engine behind Safari), this method effectively identifies Safari-based browsers
   */
  public static isWebKit(): boolean {
    return calcTruthy([
      hasProperty(window, 'ApplePayError'),
      hasProperty(window, 'CSSPrimitiveValue'),
      hasProperty(window, 'WebKitMediaKeys'),
      hasProperty(window, 'Counter'),
      hasProperty(navigator, 'getStorageUpdates'),
      navigator.vendor.indexOf('Apple') === 0,
    ]) >= 4;
  }

  /**
   * Determines if the browser is built on WebKit version ≥616 (Safari version ≥17).
   * This function specifically identifies browsers based on WebKit version, not just any browser built on WebKit
   */
  public static isWebKit616OrNewer(): boolean {
    const { CSS, HTMLButtonElement } = window;

    return calcTruthy([
      hasProperty(window, 'CSSCounterStyleRule'),
      !hasProperty(navigator, 'getStorageUpdates'),
      HTMLButtonElement && hasProperty(HTMLButtonElement.prototype, 'popover'),
      CSS.supports('font-size-adjust: ex-height 0.5'),
      CSS.supports('text-transform: full-width'),
    ]) >= 4;
  }

  /**
   * Determines if the browser is built on Chromium
   */
  public static isChromium(): boolean {
    return calcTruthy([
      hasProperty(window, 'webkitResolveLocalFileSystemURL'),
      hasProperty(window, 'BatteryManager'),
      hasProperty(window, 'webkitMediaStream'),
      hasProperty(window, 'webkitSpeechGrammar'),
      hasProperty(navigator, 'webkitPersistentStorage'),
      hasProperty(navigator, 'webkitTemporaryStorage'),
      navigator.vendor.indexOf('Google') === 0,
    ]) >= 5;
  }

  /**
   * Determines if the browser is built on Chromium version ≥86.
   * This function specifically identifies browsers based on Chromium version, not just any browser built on Chromium.
   * Tested in Chrome 85 versus Chrome 86 on both desktop and Android platforms
   */
  public static isChromium86OrNewer(): boolean {
    return calcTruthy([
      !hasProperty(window, 'MediaSettingsRange'),
      hasProperty(window, 'RTCEncodedAudioFrame'),
      `${window.Intl}` === '[object Intl]',
      `${window.Reflect}` === '[object Reflect]',
    ]) >= 3;
  }

  /**
   * Determines if the browser is built on Gecko (the engine powering Firefox)
   */
  public static isGecko(): boolean {
    return calcTruthy([
      hasProperty(navigator, 'buildID'),
      hasProperty((document.documentElement?.style ?? {}), 'MozAppearance'),
      hasProperty(window, 'onmozfullscreenchange'),
      hasProperty(window, 'mozInnerScreenX'),
      hasProperty(window, 'CSSMozDocumentRule'),
      hasProperty(window, 'CanvasCaptureMediaStream'),
    ]) >= 4;
  }

  /**
   * Determines if the browser is built on WebKit version ≥606 (Safari version ≥12).
   * This function specifically identifies browsers based on WebKit version, not just any browser built on WebKit
   */
  public static isWebKit606OrNewer(): boolean {
    return calcTruthy([
      hasProperty(window, 'DOMRectList'),
      hasProperty(window, 'RTCPeerConnectionIceEvent'),
      hasProperty(window, 'SVGGeometryElement'),
      hasProperty(window, 'ontransitioncancel'),
    ]) >= 3;
  }

  /**
   * Determines if this WebKit browser is a desktop browser.
   * This function specifically identifies desktop browsers using WebKit, not just any browser built on WebKit
   */
  public static isDesktopWebKit(): boolean {
    const { HTMLElement, Document } = window;

    return calcTruthy([
      hasProperty(window, 'safari'),
      !hasProperty(window, 'ongestureend'),
      !hasProperty(window, 'TouchEvent'),
      !hasProperty(window, 'orientation'),
      HTMLElement && !hasProperty(HTMLElement.prototype, 'autocapitalize'),
      Document && hasProperty(Document.prototype, 'pointerLockElement'),
    ]) >= 4;
  }
}
