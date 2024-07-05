import { toFloat } from '../utils/utils';

export function getTimezone(): string {
  const DateTimeFormat = window.Intl?.DateTimeFormat;
  if (DateTimeFormat) {
    const timezone = new DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      return timezone;
    }
  }

  // For browsers that don't support timezone names
  const currentYear = new Date().getFullYear();

  // The timezone offset may change over time due to daylight saving time (DST) shifts.
  // The non-DST timezone offset is used as the result timezone offset.
  // Since the DST season differs in the northern and the southern hemispheres,
  // both January and July timezones offsets are considered.

  // The minus is intentional because the JS offset is opposite to the real offset
  const offset = -Math.max(
    toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
    toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
  );

  return `UTC${offset >= 0 ? '+' : ''}${offset}`;
}
