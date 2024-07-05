export function isHaveOpenDatabase(): boolean {
  return !!window.openDatabase;
}
