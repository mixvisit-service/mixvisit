import { TDef } from '../utils/helpers';

type NavigatorInfo = {
  userAgent: string;
  appName: string;
  appVersion: string;
  appCodeName: string;
  deviceMemory?: number;
  hardwareConcurrency: number;
  platform: string;
  product: string;
  language: string;
  languages: string[];
  oscpu?: string;
  cpuClass?: string;
  productSub: string;
  vendorSub: string;
  vendor: string;
  maxTouchPoints: number;
  doNotTrack: string | null;
  pdfViewerEnabled: boolean;
  cookieEnabled: boolean;
  onLine: boolean;
  webdriver: boolean;
  userAgentData?: UADataValues;
  mimeTypes: Record<string, MimeTypes>;
  plugins: PluginData[];
  highEntropyValues?: UADataValues;
};

type MimeTypes = {
  description: string;
  suffixes: string;
  enabledPlugin: string;
};

type PluginMimeTypeData = {
  type: string;
  suffixes: string;
};

type PluginData = {
  name: string;
  description: string;
  filename: string;
  mimeTypes: PluginMimeTypeData[];
};

export async function getNavigatorInfo(): Promise<NavigatorInfo> {
  const result = {} as NavigatorInfo;
  const { plugins, mimeTypes, userAgentData } = navigator;

  const navigatorProps = [
    'userAgent',
    'appName',
    'appVersion',
    'appCodeName',
    'deviceMemory',
    'hardwareConcurrency',
    'platform',
    'product',
    'language',
    'languages',
    'oscpu',
    'cpuClass',
    'productSub',
    'vendorSub',
    'vendor',
    'maxTouchPoints',
    'doNotTrack',
    'pdfViewerEnabled',
    'cookieEnabled',
    'onLine',
    'webdriver',
    'userAgentData',
  ] as const;

  const highEntropyValuesProps = [
    'architecture',
    'bitness',
    'brands',
    'mobile',
    'model',
    'platform',
    'platformVersion',
    'uaFullVersion',
    'wow64',
    'fullVersionList',
  ];

  // Default properties

  for (const key of navigatorProps) {
    if (!TDef.isUndefined(navigator[key])) {
      result[key as string] = navigator[key];
    }
  }

  // MimeTypes

  result.mimeTypes = mimeTypes ? {} : null;

  for (const mimeType of mimeTypes) {
    result.mimeTypes[mimeType.type] = {
      description: mimeType.description,
      suffixes: mimeType.suffixes,
      enabledPlugin: mimeType.enabledPlugin.name,
    };
  }

  // Plugins

  result.plugins = plugins ? [] : null;

  // Safari 10 doesn't support iterating navigator.plugins with for...of
  for (let i = 0; i < plugins?.length; ++i) {
    const plugin = plugins[i];
    if (!plugin) {
      continue;
    }

    const mimeTypesArr: PluginMimeTypeData[] = [];
    for (let j = 0; j < plugin.length; ++j) {
      const mimeType = plugin[j];
      mimeTypesArr.push({
        type: mimeType.type,
        suffixes: mimeType.suffixes,
      });
    }

    result.plugins.push({
      name: plugin.name,
      description: plugin.description,
      filename: plugin.filename,
      mimeTypes: mimeTypesArr,
    });
  }

  // High Entropy Values

  result.highEntropyValues = await userAgentData?.getHighEntropyValues(highEntropyValuesProps) ?? null;

  return result;
}
