export async function getStorage(): Promise<number | null> {
  if (!navigator?.storage?.estimate) {
    return null;
  }

  return Promise.all([
    navigator.storage.estimate().then(({ quota }) => quota),
    new Promise((resolve) => {
      // @ts-ignore ts(2339)
      navigator.webkitTemporaryStorage.queryUsageAndQuota((_, quota) => {
        resolve(quota);
      });
    }).catch(() => null),
  ]).then(([quota1, quota2]) => (quota2 || quota1) as number);
}

export function getMaxCallStackSize(): number {
  const fn = (): number => {
    try {
      return 1 + fn();
    } catch (err) {
      return 1;
    }
  };

  [...Array(10)].forEach(() => fn());

  return fn();
}

export function getTimingResolution(): [number, number] {
  const maxRuns = 5000;
  let res: number;
  let valA = 1;
  let valB = 1;

  for (let i = 0; i < maxRuns; i++) {
    const a = performance.now();
    const b = performance.now();

    if (a < b) {
      res = b - a;

      if (res > valA && res < valB) {
        valB = res;
      }

      if (res < valA) {
        valB = valA;
        valA = res;
      }
    }
  }

  return [valA, valB];
}
