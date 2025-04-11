export function createCanvas(): readonly [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return [canvas, canvas.getContext('2d')] as const;
}

export function isWindingSupported(context: CanvasRenderingContext2D): boolean {
  context.rect(0, 0, 10, 10);
  context.rect(2, 2, 6, 6);

  return !context.isPointInPath(5, 5, 'evenodd');
}

export function isCanvasSupported(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null): boolean {
  return !!(context && canvas.toDataURL) && canvas.toDataURL().indexOf('data:image/png;base64') !== -1;
}
