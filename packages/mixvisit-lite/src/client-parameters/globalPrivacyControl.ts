export function getGlobalPrivacyControl(): boolean | null {
  return navigator.globalPrivacyControl ?? null;
}
