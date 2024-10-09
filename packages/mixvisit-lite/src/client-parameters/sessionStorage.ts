export function isHaveSessionStorage(): boolean {
  try {
    return !!window.sessionStorage;
  } catch (err) {
    /* SecurityError when referencing it means it exists */
    return true;
  }
}
