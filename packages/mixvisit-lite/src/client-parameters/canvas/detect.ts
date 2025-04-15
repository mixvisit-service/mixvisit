import { renderTextImageForDetectSpoofing } from './images';
import { createCanvas, isCanvasSupported } from './utils';
import { isBlink } from '../../utils/browser';

type DetectResult = {
  diffIndexes: number[];
  diffValues: number[];
  significantPixelIndexes: number[];
  significantPixelValues: number[][];
};

export async function detectCanvasFingerprinting(): Promise<DetectResult | null> {
  const [originalCanvas, originalContext] = createCanvas();
  const [testCanvas, testContext] = createCanvas();

  if (!(
    isBlink()
    && isCanvasSupported(originalCanvas, originalContext)
    && testContext
  )) {
    return null;
  }

  const canvasWidth = 21;
  const canvasHeight = 120;
  const ignorePixels = [
    131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 153, 154, 155, 158, 159,
    174, 175, 176, 179, 180, 195, 196, 197, 198, 199, 200, 201, 216, 217, 218,
    221, 222, 237, 238, 239, 242, 243, 258, 259, 260, 263, 264, 278, 279, 280,
    281, 282, 283, 284, 285, 286, 287, 156, 157, 160, 219, 220,
  ];

  originalCanvas.width = canvasWidth;
  originalCanvas.height = canvasHeight;
  testCanvas.width = canvasWidth;
  testCanvas.height = canvasHeight;

  renderTextImageForDetectSpoofing(originalCanvas, originalContext);

  const imageData = originalCanvas.toDataURL();

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const diffIndexes = [];
      const diffValues = [];

      testContext.drawImage(image, 0, 0);

      const originalImageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      const testImageData = testContext.getImageData(0, 0, testCanvas.width, testCanvas.height);

      const originalPixels = Array.from(originalImageData.data);
      const testPixels = Array.from(testImageData.data);

      let uniquePixelIndexes = [];
      originalPixels.forEach((pixel, index) => {
        if (pixel !== 102) {
          uniquePixelIndexes.push(Math.floor(index / 4));
        }
      });

      uniquePixelIndexes = [...new Set(uniquePixelIndexes)];

      const significantPixelIndexes = uniquePixelIndexes.filter((index) => !ignorePixels.includes(index));
      const significantPixelValues = significantPixelIndexes.map(
        (index) => [index * 4, index * 4 + 1, index * 4 + 2, index * 4 + 3].map((i) => originalPixels[i]),
      );

      testPixels.forEach((pixel, index) => {
        if (pixel !== originalPixels[index]) {
          diffIndexes.push(index);
          diffValues.push(pixel - originalPixels[index]);
        }
      });

      resolve({
        diffIndexes,
        diffValues,
        significantPixelIndexes,
        significantPixelValues,
      });
    };

    image.onerror = () => resolve(null);
    image.src = imageData;
  });
}
