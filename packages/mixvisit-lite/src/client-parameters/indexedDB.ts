import { BrowserUtils } from '../utils/browser';

export function isHaveIndexedDB(): boolean | null {
  // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
  // visitor identifier in normal and private modes.
  if (BrowserUtils.isTrident() || BrowserUtils.isEdgeHTML()) {
    return null;
  }

  try {
    return !!window.indexedDB;
  } catch (err) {
    /* SecurityError when referencing it means it exists */
    return true;
  }
}
