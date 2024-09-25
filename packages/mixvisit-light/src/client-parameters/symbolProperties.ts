import { hasProperty } from '../utils/helpers';

export function getSymbolPropertiesInfo(): string[] {
  const symbolProperties = [
    'length',
    'name',
    'prototype',
    'for',
    'keyFor',
    'asyncIterator',
    'hasInstance',
    'isConcatSpreadable',
    'iterator',
    'match',
    'matchAll',
    'replace',
    'search',
    'species',
    'split',
    'toPrimitive',
    'toStringTag',
    'unscopables',
    'dispose',
  ] as const;

  return symbolProperties.filter((prop) => hasProperty(Symbol, prop));
}
