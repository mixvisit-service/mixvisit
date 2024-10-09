interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export function getMemoryInfo(): PerformanceMemory | null {
  const { performance }: { performance: ExtendedPerformance } = window;

  if (!(performance && performance.memory)) {
    console.warn('The memory API is not supported');

    return null;
  }

  return {
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    usedJSHeapSize: performance.memory.usedJSHeapSize,
  };
}
