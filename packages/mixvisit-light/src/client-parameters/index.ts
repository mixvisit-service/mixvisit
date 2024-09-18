import { getArchitecture } from './architecture';
import { getAudioFingerprint } from './audio';
import { getAudioContextBaseLatency } from './audioBaseLatency';
import { getBuiltInObjectsInfo } from './buildInObjects';
import { getCanvasFingerprint } from './canvas';
import { getClientRects } from './client-rects';
import { getColorDepth } from './colorDepth';
import { getColorGamut } from './colorGamut';
import { getColorSpaceSupport } from './colorSpaceSupport';
import { getComputedStyleProperties } from './computedStyleProperties';
import { getContrastPreference } from './contrastPreference';
import { areCookiesEnabled } from './cookiesEnabled';
import { getCpuClass } from './cpuClass';
import { getCSSSupport } from './cssSupport';
import { getDeviceMemory } from './deviceMemory';
import { isDevToolsOpened } from './devToolsDetector';
import { getDRMSupportInfo } from './drmSupport';
import { getFileAPIsInfo } from './fileAPIs';
import { getFontPreferences } from './fontPreference';
import { getFontRendering } from './fontRendering';
import { getFonts } from './fonts';
import { areColorsForced } from './forcedColors';
import { getGlobalObjects } from './globalObjects';
import { getHardwareConcurrency } from './hardwareConcurrency';
import { getHDCPPolicyCheck } from './hdcp';
import { isHDR } from './hdr';
import { getHighEntropyValues } from './hightEntropyValues';
import { isHaveIndexedDB } from './indexedDB';
import { areColorsInverted } from './invertedColors';
import { getLanguages } from './languages';
import { isHaveLocalStorage } from './localStorage';
import { getMathResults } from './math';
import { getMediaCapabilities } from './mediaCapabilities';
import { getMediaDecodingCapabilities } from './mediaDecodingCapabilities';
import { getMemoryInfo } from './memory';
import { getMonochromeDepth } from './monochromeDepth';
import { getNavigatorProperties } from './navigatorProperties';
import { isHaveOpenDatabase } from './openDatabase';
import { getOsCpu } from './osCPU';
import { isPdfViewerEnabled } from './pdfViewerEnabled';
import { getPerformanceData } from './performance';
import { getPlatform } from './platform';
import { getPlugins } from './plugins';
import { isMotionReduced } from './reducedMotion';
import { isTransparencyReduced } from './reducedTransparency';
import { getScreenFrame } from './screen-frame';
import { getScreenResolution } from './screenResolution';
import { isHaveSessionStorage } from './sessionStorage';
import { getStorageQuota } from './storageQuota';
import { getSymbolPropertiesInfo } from './symbolProperties';
import { getSystemInfo } from './systemInfo';
import { getTimezone } from './timezone';
import { getTouchSupport } from './touchSupport';
import { getUserAgent } from './userAgent';
import { getUserAgentData } from './userAgentData';
import { getVendor } from './vendor';
import { getVendorFlavors } from './vendorFlavors';
import { getWebGL } from './webgl';
import { getWebGPU } from './webgpu';
import { getWebKitAPIsInfo } from './webkitAPIs';

export type ClientParameters = typeof clientParameters;

export const clientParameters = {
  userAgent: getUserAgent,
  osCpu: getOsCpu,
  cpuClass: getCpuClass,
  platform: getPlatform,
  languages: getLanguages,
  timezone: getTimezone,
  vendor: getVendor,
  colorDepth: getColorDepth,
  hardwareConcurrency: getHardwareConcurrency,
  deviceMemory: getDeviceMemory,
  plugins: getPlugins,
  userAgentData: getUserAgentData,
  hightEntropyValues: getHighEntropyValues,
  pdfViewerEnabled: isPdfViewerEnabled,
  sessionStorage: isHaveSessionStorage,
  localStorage: isHaveLocalStorage,
  openDatabase: isHaveOpenDatabase,
  indexedDB: isHaveIndexedDB,
  colorGamut: getColorGamut,
  hdr: isHDR,
  hdcp: getHDCPPolicyCheck,
  invertedColors: areColorsInverted,
  cookiesEnabled: areCookiesEnabled,
  forcedColors: areColorsForced,
  monochromeDepth: getMonochromeDepth,
  contrastPreference: getContrastPreference,
  reducedMotion: isTransparencyReduced,
  reducedTransparency: isMotionReduced,
  vendorFlavors: getVendorFlavors,
  touchSupport: getTouchSupport,
  architecture: getArchitecture,
  baseLatency: getAudioContextBaseLatency,
  screenResolution: getScreenResolution,
  screenFrame: getScreenFrame,
  math: getMathResults,
  fontPreferences: getFontPreferences,
  fonts: getFonts,
  audio: getAudioFingerprint,
  canvas: getCanvasFingerprint,
  clientRects: getClientRects,
  webgl: getWebGL,
  webgpu: getWebGPU,
  globalObjests: getGlobalObjects,
  storageQuota: getStorageQuota,
  mediaCapabilities: getMediaCapabilities,
  performance: getPerformanceData,
  memory: getMemoryInfo,
  computedStyleProperties: getComputedStyleProperties,
  systemInfo: getSystemInfo,
  drmSupport: getDRMSupportInfo,
  fileAPIs: getFileAPIsInfo,
  symbolProperties: getSymbolPropertiesInfo,
  webkitAPIs: getWebKitAPIsInfo,
  builtInObjects: getBuiltInObjectsInfo,
  cssSupport: getCSSSupport,
  colorSpaceSupport: getColorSpaceSupport,
  fontRendering: getFontRendering,
  devToolsOpen: isDevToolsOpened,
  navigatorProperties: getNavigatorProperties,
  mediaDecodingCapabilities: getMediaDecodingCapabilities,
};
