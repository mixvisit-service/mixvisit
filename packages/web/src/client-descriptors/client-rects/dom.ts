/* eslint-disable no-param-reassign */

export type ClientRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

type ElementData = {
  style: string;
  block: string;
};

export function createClientRectElement(element: ElementData) {
  if (!element) {
    throw new Error('No element');
  }

  const template = document.createElement('template');
  template.innerHTML = element.block.trim();

  const el = template.content.firstChild as HTMLElement;
  el.style.cssText = element.style;

  return el.outerHTML;
}

export async function createElementsAndGetClientRects(
  iframe: HTMLIFrameElement,
  iframeWindow: typeof window,
): Promise<ClientRect[]> {
  const res: ClientRect[] = [];

  iframe.style.width = '700px';
  iframe.style.height = '600px';

  const iframeDocument = iframeWindow.document;
  const { head: iframeHead, body: iframeBody } = iframeDocument;

  // created elements
  const elementsResult = Object.values(elements)
    .map(createClientRectElement)
    .join('');

  const style = iframeDocument.createElement('style');
  style.textContent = `
    caption {
      border: solid 2px darkred;
      font-size: 20.99px;
      margin-left: 20.8px;
    }
  `;
  iframeHead.appendChild(style);
  iframeBody.innerHTML = elementsResult;

  const elementsArr = Array.from(iframeBody.children);

  for (const el of elementsArr) {
    const {
      bottom, top,
      left, right,
      width, height,
      x, y,
    } = el.getBoundingClientRect();

    res.push({
      bottom,
      top,
      left,
      right,
      width,
      height,
      x,
      y,
    });
  }

  return res;
}

const elements: Record<string, ElementData> = {
  simpleTest: {
    style: `
      border: solid 2.715px green;
      padding: 3.98px;
      margin-left: 12.12px;
    `,
    block: '<div>Simple Test (1)</div>',
  },
  transformTest: {
    style: `
      border: solid 2px purple;
      font-size: 30px;
      margin-top: 200px;
      -webkit-transform: skewY(23.1753218deg);
      -moz-transform: skewY(23.1753218deg);
      -ms-transform: skewY(23.1753218deg);
      -o-transform: skewY(23.1753218deg);
      transform: skewY(23.1753218deg);
    `,
    block: '<div>Transformation Test (2)</div>',
  },
  scaleTest: {
    style: `
      border: solid 2.89px orange;
      font-size: 45px;
      transform: scale(100000000000000000000009999999999999.99, 1.89);
      margin-top: 50px;
    `,
    block: '<div>WW&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Scale Test (3)</div>',
  },
  vendorSpecificTransformationTest: {
    style: `
      border: solid 2px silver;
      transform: matrix(1.11, 2.0001, -1.0001, 1.009, 150, 94.4);
      -webkit-transform: matrix(0.95559, 2.13329, -0.9842, 0.98423, 150, 95);
      -moz-transform: matrix(
        0.66371,
        1.94587,
        -0.6987,
        0.98423,
        150,
        103.238
      );
      -ms-transform: matrix(0.5478, 1.94587, -0.7383, 0.98423, 150, 100.569);
      -o-transform: matrix(0.4623, 1.83523, -0.6734, 0.81231, 150, 99.324);
      position: absolute;
      margin-top: 11.1331px;
      margin-left: 12.1212px;
      padding: 4.4545px;
      left: 239.4141px;
      top: 178.505px;
    `,
    block: '<div>Vendor specific transformation Test (4)</div>',
  },
  tableCaptionTest: {
    style: `
      border: solid 2pt red;
      margin-left: 42.395pt;
    `,
    block: `
      <table>
        <caption>Table caption Test (5)</caption>
        <thead><tr><th>Table head</th></tr></thead>
        <tbody><tr><td>Table body</td></tr></tbody>
      </table>
    `,
  },
  transformPerspectiveTest: {
    style: `
      border: solid 2px darkblue;
      -webkit-transform: perspective(12890px) translateZ(101.5px);
      -moz-transform: perspective(12890px) translateZ(101.5px);
      -ms-transform: perspective(12890px) translateZ(101.5px);
      -o-transform: perspective(12890px) translateZ(101.5px);
      transform: perspective(12890px) translateZ(101.5px);
      padding: 12px;
    `,
    block: '<div>transform: perspective(12890px) translateZ(101.5px); Test (6)</div>',
  },
  selectionOptionTest: {
    style: `
      position: absolute;
      margin-top: -350.552px;
      margin-left: 0.9099rem;
      border: solid 2px burlywood;
    `,
    block: `
      <div>
        <select>
            <option>selection-option (Test 7)</option>
        </select>
      </div>
    `,
  },
  detailSummaryTest: {
    style: `
      position: absolute;
      margin-top: -150.552px;
      margin-left: 15.9099rem;
      border: solid 2px sandybrown;
    `,
    block: `
      <div>
        <details>
          <summary>detail summary (Test 8)</summary>
        </details>
      </div>
    `,
  },
  progressTest: {
    style: `
      position: absolute;
      margin-top: -110.552px;
      margin-left: 15.9099rem;
      border: solid 2px orchid;
    `,
    block: '<div><progress value="49" max="100"></progress></div>',
  },
  buttonTest: {
    style: `
      position: absolute;
      margin-top: -315.552px;
      margin-left: 15.9099rem;
      border: solid 2px turquoise;
    `,
    block: '<div><button type="button"></button></div>',
  },
};
