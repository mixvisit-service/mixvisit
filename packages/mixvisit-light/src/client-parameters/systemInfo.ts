type SystemInfo = {
  colors: string[];
  fonts: string[];
};

export function getSystemInfo(): SystemInfo | null {
  const systemFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'] as const;
  const systemColors = [
    'ActiveText',
    'ButtonFace',
    'ButtonText',
    'Canvas',
    'CanvasText',
    'Field',
    'FieldText',
    'GrayText',
    'Highlight',
    'HighlightText',
    'LinkText',
    'Mark',
    'MarkText',
    'VisitedText',
  ] as const;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.warn('Failed to get canvas context');

    return null;
  }

  const colors = systemColors.map((color) => {
    ctx.fillStyle = color;

    return ctx.fillStyle;
  });

  const fonts = systemFonts.map((font) => {
    ctx.font = `12px ${font}`;

    return ctx.font;
  });

  canvas.remove();

  return { colors, fonts };
}
