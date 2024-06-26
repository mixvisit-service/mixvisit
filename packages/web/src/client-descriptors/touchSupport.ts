import { toInt, hasProperty } from '../utils/utils';

type TouchSupport = {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
};

/**
 * This is a crude and primitive touch screen detection.
 * It's not possible to currently reliably detect the availability of a touch screen with a JS,
 * without actually subscribing to a touch event.
 */
export function getTouchSupport(): TouchSupport {
  let maxTouchPoints = 0;
  let touchEvent: boolean;

  if (navigator.maxTouchPoints !== undefined) {
    maxTouchPoints = toInt(navigator.maxTouchPoints);
  }

  try {
    document.createEvent('TouchEvent');
    touchEvent = true;
  } catch {
    touchEvent = false;
  }

  const touchStart = hasProperty(window, 'ontouchstart');

  return {
    maxTouchPoints,
    touchEvent,
    touchStart,
  };
}
