import { TDef } from '../utils/helpers';

type IntlData = {
  dateTimeOptions: Intl.ResolvedDateTimeFormatOptions | null;
  numberFormatOptions: Intl.ResolvedNumberFormatOptions | null;
  collatorOptions: Intl.ResolvedCollatorOptions | null;
  pluralRulesOptions: Intl.ResolvedPluralRulesOptions | null;
  relativeTimeFormatOptions: Intl.ResolvedRelativeTimeFormatOptions | null;
};

type Constructors = typeof Intl.DateTimeFormat
  | typeof Intl.NumberFormat
  | typeof Intl.Collator
  | typeof Intl.PluralRules
  | typeof Intl.RelativeTimeFormat;

type ResolvedOptions<T> =
  T extends typeof Intl.DateTimeFormat
  ? Intl.ResolvedDateTimeFormatOptions
  : T extends typeof Intl.NumberFormat
  ? Intl.ResolvedNumberFormatOptions
  : T extends typeof Intl.Collator
  ? Intl.ResolvedCollatorOptions
  : T extends typeof Intl.PluralRules
  ? Intl.ResolvedPluralRulesOptions
  : T extends typeof Intl.RelativeTimeFormat
  ? Intl.ResolvedRelativeTimeFormatOptions
  : never;

export function getIntlData(): IntlData | null {
  if (TDef.isUndefined(Intl)) {
    return null;
  }

  return {
    dateTimeOptions: getIntlObjectOptions(Intl.DateTimeFormat),
    numberFormatOptions: getIntlObjectOptions(Intl.NumberFormat),
    collatorOptions: getIntlObjectOptions(Intl.Collator),
    pluralRulesOptions: getIntlObjectOptions(Intl.PluralRules),
    relativeTimeFormatOptions: getIntlObjectOptions(Intl.RelativeTimeFormat),
  };
}

function getIntlObjectOptions<T extends Constructors>(intlConstructor: T): ResolvedOptions<T> {
  const intlObject = new (intlConstructor as any)();

  return intlObject.resolvedOptions() as ResolvedOptions<T>;
}
