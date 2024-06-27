import { BrowserUtils } from '../utils/browser';

export function getLanguages(): string[][] {
  const result: string[][] = [];

  const language = navigator.language
    || navigator.userLanguage
    || navigator.browserLanguage
    || navigator.systemLanguage
    || null;

  if (language !== null) {
    result.push([language]);
  }

  if (Array.isArray(navigator.languages)) {
    // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
    // the value of `navigator.language`. Therefore the value is ignored in this browser.
    const notNewChromium86 = !(BrowserUtils.isChromium() && BrowserUtils.isChromium86OrNewer());
    if (notNewChromium86) {
      result.push(navigator.languages);
    }
  } else if (typeof navigator.languages === 'string') {
    const languages = navigator.languages as string;
    if (languages) {
      result.push(languages.split(','));
    }
  }

  return result;
}
