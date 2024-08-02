export function getOsCpu(): string | null {
  return navigator.oscpu ?? null;
}
