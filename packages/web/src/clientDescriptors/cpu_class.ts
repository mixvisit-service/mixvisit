export function getCpuClass(): string | null {
  return navigator.cpuClass ?? null;
}
