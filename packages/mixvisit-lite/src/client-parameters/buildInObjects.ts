import { hasProperty, TDef } from '../utils/helpers';

type BuiltInObjectsInfo = {
  [K in (typeof builtInObjects)[number]]: string[];
};

const builtInObjects = [
  'AbortSignal',
  'Array',
  'ArrayBuffer',
  'Atomics',
  'BigInt',
  'Boolean',
  'Date',
  'Document',
  'Element',
  'Error',
  'Function',
  'GPU',
  'Intl',
  'JSON',
  'Map',
  'Math',
  'Navigation',
  'Navigator',
  'Number',
  'Object',
  'PerformanceNavigationTiming',
  'Promise',
  'Proxy',
  'RTCRtpReceiver',
  'ReadableStream',
  'Reflect',
  'RegExp',
  'SVGAElement',
  'Set',
  'ShadowRoot',
  'String',
  'Symbol',
  'WeakMap',
  'WeakSet',
  'WebAssembly',
  'WebSocketStream',
] as const;

export function getBuiltInObjectsInfo(): BuiltInObjectsInfo {
  const result = {} as BuiltInObjectsInfo;

  for (const objName of builtInObjects) {
    if (hasProperty(window, objName)) {
      const obj = window[objName];
      const properties = Object.getOwnPropertyNames(obj);
      const methods = properties.filter((prop) => TDef.isFunc(obj[prop]));
      result[objName] = methods;
    }
  }

  return result;
}
