type FontRendering = {
  font: 'Consolas' | 'Windows sans-serif' | 'Windows serif' | 'mix Consolas';
  offsetWidth: number;
  offsetHeight: number;
}[];

export function getFontRendering(): FontRendering {
  const fonts = ['Consolas', 'Windows sans-serif', 'Windows serif', 'mix Consolas'] as const;

  const element = document.createElement('span');
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.fontSize = '12px';
  element.style.lineHeight = 'normal';
  element.textContent = 'abcdefghijklmnopqrstuvwxyz0123456789';

  document.body.appendChild(element);

  const result = fonts.map((font) => {
    element.style.fontFamily = font;

    return {
      font,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
    };
  });

  document.body.removeChild(element);

  return result;
}
