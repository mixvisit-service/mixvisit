export function getUserAgentData(): NavigatorUAData | null {
  return navigator.userAgentData ?? null;
}
