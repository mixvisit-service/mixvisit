// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
export function isHaveLocalStorage(): boolean {
  try {
    return !!window.localStorage;
  } catch (err) {
    /* SecurityError when referencing it means it exists */
    return true;
  }
}
