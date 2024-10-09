export function isHaveOpenDatabase(): boolean | null {
  return !!window.openDatabase;
}
