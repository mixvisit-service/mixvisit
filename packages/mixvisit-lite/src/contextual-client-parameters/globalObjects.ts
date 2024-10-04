import { hasProperty } from '../utils/helpers';

export function getGlobalObjects(): string[] {
  const result: string[] = [];

  for (const key in window) {
    if (hasProperty(window, key)) {
      result.push(key);
    }
  }

  return result;
}
