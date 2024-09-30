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
import { getCSSSupport } from './cssSupport';
import { isDevToolsOpened } from './devToolsDetector';
import { getDRMSupportInfo } from './drmSupport';
import { getFileAPIsInfo } from './fileAPIs';
import { getFontPreferences } from './fontPreference';
import { getFontRendering } from './fontRendering';
import { getFonts } from './fonts';
import { areColorsForced } from './forcedColors';
import { getGlobalObjects } from './globalObjects';
import { getHDCPPolicyCheck } from './hdcp';
import { isHDR } from './hdr';
import { isHaveIndexedDB } from './indexedDB';
import { areColorsInverted } from './invertedColors';
import { isHaveLocalStorage } from './localStorage';
import { getMathResults } from './math';
import { getMediaCapabilities } from './mediaCapabilities';
import { getMediaDecodingCapabilities } from './mediaDecodingCapabilities';
import { getMemoryInfo } from './memory';
import { getMonochromeDepth } from './monochromeDepth';
import { getNavigatorInfo } from './navigator';
import { getNavigatorProperties } from './navigatorProperties';
import { isHaveOpenDatabase } from './openDatabase';
import { getPerformanceData } from './performance';
import { isMotionReduced } from './reducedMotion';
import { isTransparencyReduced } from './reducedTransparency';
import { getScreenData } from './screen';
import { getScreenFrame } from './screen-frame';
import { getScreenResolution } from './screenResolution';
import { isHaveSessionStorage } from './sessionStorage';
import { getStorageQuota } from './storageQuota';
import { getSymbolPropertiesInfo } from './symbolProperties';
import { getSystemInfo } from './systemInfo';
import { getTimezone } from './timezone';
import { getTouchSupport } from './touchSupport';
import { getVendorFlavors } from './vendorFlavors';
import { getWebGL } from './webgl';
import { getWebGPU } from './webgpu';
import { getWebKitAPIsInfo } from './webkitAPIs';

export type ClientParameters = typeof clientParameters;

export const clientParameters = {
  navigator: getNavigatorInfo,
  timezone: getTimezone,
  colorDepth: getColorDepth,
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
  screen: getScreenData,
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
