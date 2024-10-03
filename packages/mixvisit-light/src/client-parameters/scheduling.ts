import { hasProperty } from '../utils/helpers';

type SchedulingData = {
  isInputPending: boolean | null;
};

export function schedulingData(): SchedulingData | null {
  if (!hasProperty(navigator, 'scheduling')) {
    return null;
  }

  return {
    isInputPending: navigator.scheduling.isInputPending
      ? navigator.scheduling.isInputPending()
      : null,
  };
}
