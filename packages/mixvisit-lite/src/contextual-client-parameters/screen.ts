type WindowSize = {
  width: number;
  height: number;
};

type Screen = {
  colorDepth: number;
  pixelDepth: number;
  height: number;
  width: number;
  availHeight: number;
  availWidth: number;
  availTop: number;
  availLeft: number;
  windowSize: WindowSize;
};

export function getScreenData() {
  const result = {} as Screen;

  const screenFields = [
    'colorDepth',
    'pixelDepth',
    'height',
    'width',
    'availHeight',
    'availWidth',
    'availTop',
    'availLeft',
    'windowSize',
  ] as const;

  screenFields.forEach((field) => {
    if (field === 'windowSize') {
      result.windowSize = getWindowSize();
    } else if (window.screen[field] || Number.isInteger(window.screen[field])) {
      result[field] = window.screen[field];
    }
  });

  return result;
}

function getWindowSize(): WindowSize {
  return {
    width: document.body?.clientWidth || window.innerWidth,
    height: document.body?.clientHeight || window.innerHeight,
  };
}
