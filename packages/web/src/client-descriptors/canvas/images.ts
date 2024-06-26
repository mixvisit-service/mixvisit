/* eslint-disable no-param-reassign */

import { CanvasImageStatus } from '../../utils/enums';
import { wait } from '../../utils/helpers';

export async function renderImages(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): Promise<[geometry: string, text: string]> {
  renderTextImage(canvas, context);

  await wait(0);

  const textImage1 = canvas.toDataURL();
  const textImage2 = canvas.toDataURL();

  // The canvas is excluded from the fingerprint in this case
  if (textImage1 !== textImage2) {
    return [CanvasImageStatus.Unstable, CanvasImageStatus.Unstable];
  }

  // Text is unstable. Therefore it's extracted into a separate image
  renderGeometryImage(canvas, context);
  await wait(0);
  const geometryImage = canvas.toDataURL();

  return [geometryImage, textImage1];
}

function renderTextImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  canvas.width = 240;
  canvas.height = 60;

  context.textBaseline = 'alphabetic';
  context.fillStyle = '#f60';
  context.fillRect(100, 1, 62, 20);

  context.fillStyle = '#069';
  context.font = '11pt "Times New Roman"';

  const printedText = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835) /* 😃 */}`;
  context.fillText(printedText, 2, 15);
  context.fillStyle = 'rgba(102, 204, 0, 0.2)';
  context.font = '18pt Arial';
  context.fillText(printedText, 4, 45);
}

function renderGeometryImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  canvas.width = 122;
  canvas.height = 110;

  context.globalCompositeOperation = 'multiply';

  for (const [color, x, y] of [
    ['#f2f', 40, 40],
    ['#2ff', 80, 40],
    ['#ff2', 60, 80],
  ] as const) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 40, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  context.fillStyle = '#f9c';
  context.arc(60, 60, 60, 0, Math.PI * 2, true);
  context.arc(60, 60, 20, 0, Math.PI * 2, true);
  context.fill('evenodd');
}
