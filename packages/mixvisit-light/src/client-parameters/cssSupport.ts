const cssProperties = {
  'accent-color': ['initial'],
  'anchor-name': ['--tooltip'],
  'border-end-end-radius': ['initial'],
  color: ['light-dark'],
  fill: ['context-fill', 'context-stroke'],
  float: ['inline-start', 'inline-end'],
  'font-size': ['1cap', '1rcap'],
  'grid-template-rows': ['subgrid'],
  'paint-order': ['normal', 'stroke', 'markers', 'fill', 'revert'],
  stroke: ['context-fill', 'context-stroke'],
  'text-decoration': ['spelling-error'],
  'text-wrap': ['pretty'],
  'transform-box': ['stroke-box'],
} as const;

type CSSSupport = {
  [K in keyof typeof cssProperties]: {
    [V in (typeof cssProperties)[K][number]]: boolean;
  };
};

export function getCSSSupport(): CSSSupport {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const result = {} as CSSSupport;

  for (const [property, values] of Object.entries(cssProperties)) {
    result[property] = {};
    for (const value of values) {
      element.style[property] = value;
      result[property][value] = element.style[property] === value;
    }
  }

  document.body.removeChild(element);

  return result;
}
