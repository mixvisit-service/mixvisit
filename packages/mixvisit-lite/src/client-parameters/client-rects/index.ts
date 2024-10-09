/* eslint-disable no-param-reassign */

import { createClientRectElement, ELEMENTS } from './utils';
import { withIframe } from '../../utils/helpers';

type ClientRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

export async function getClientRects(): Promise<ClientRect[]> {
  return withIframe({ action: createElementsAndGetClientRects });
}

async function createElementsAndGetClientRects(
  iframe: HTMLIFrameElement,
  iframeWindow: typeof window,
): Promise<ClientRect[]> {
  const res: ClientRect[] = [];

  iframe.style.width = '700px';
  iframe.style.height = '600px';

  const iframeDocument = iframeWindow.document;
  const { head: iframeHead, body: iframeBody } = iframeDocument;

  // created elements
  const elementsResult = Object.values(ELEMENTS)
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
