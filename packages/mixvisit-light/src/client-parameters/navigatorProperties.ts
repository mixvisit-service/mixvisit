export function getNavigatorProperties(): string[] {
  const result: string[] = [];

  for (const key in window.navigator) {
    result.push(key);
  }

  return result;
}
