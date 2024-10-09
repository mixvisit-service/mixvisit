import { isHaveActiveX } from './activeX';
import { getArchitecture } from './architecture';
import { getAudioContext } from './audio';
import { getAudioContextBaseLatency } from './audioBaseLatency';
import { isHaveBatteryAPI } from './battery';
import { isHaveBluetoothAPI } from './bluetooth';
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
import { getDevicePixelRatio } from './devicePixelRatio';
import { getDRMSupportInfo } from './drmSupport';
import { getFileAPIsInfo } from './fileAPIs';
import { isHaveFlash } from './flash';
import { getFontPreferences } from './fontPreference';
import { getFontRendering } from './fontRendering';
import { getFonts } from './fonts';
import { areColorsForced } from './forcedColors';
import { getGlobalPrivacyControl } from './globalPrivacyControl';
import { getHDCPPolicyCheck } from './hdcp';
import { isHDR } from './hdr';
import { isHaveIndexedDB } from './indexedDB';
import { getIntlData } from './intl';
import { areColorsInverted } from './invertedColors';
import { isJavaEnabled } from './java';
import { isHaveLocalStorage } from './localStorage';
import { getMathResults } from './math';
import { getMediaCapabilities } from './mediaCapabilities';
import { getMediaDecodingCapabilities } from './mediaDecodingCapabilities';
import { getMonochromeDepth } from './monochromeDepth';
import { getNavigatorInfo } from './navigator';
import { getNavigatorProperties } from './navigatorProperties';
import { isHaveNetworkAPI } from './network';
import { isHaveOpenDatabase } from './openDatabase';
import { isMotionReduced } from './reducedMotion';
import { isTransparencyReduced } from './reducedTransparency';
import { schedulingData } from './scheduling';
import { getScreenFrame } from './screen-frame';
import { getScreenResolution } from './screenResolution';
import { isHaveSessionStorage } from './sessionStorage';
import { isHaveSilverlight } from './silverlight';
import { getSpeechSynthesisVoices } from './speechSynthesis';
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
  cookiesEnabled: areCookiesEnabled,
  sessionStorage: isHaveSessionStorage,
  localStorage: isHaveLocalStorage,
  openDatabase: isHaveOpenDatabase,
  indexedDB: isHaveIndexedDB,
  activeX: isHaveActiveX,
  silverlight: isHaveSilverlight,
  flash: isHaveFlash,
  java: isJavaEnabled,
  batteryAPI: isHaveBatteryAPI,
  bluetoothAPI: isHaveBluetoothAPI,
  networkAPI: isHaveNetworkAPI,
  timezone: getTimezone,
  architecture: getArchitecture,
  devicePixelRatio: getDevicePixelRatio,
  globalPrivacyControl: getGlobalPrivacyControl,
  colorDepth: getColorDepth,
  colorGamut: getColorGamut,
  hdr: isHDR,
  hdcp: getHDCPPolicyCheck,
  invertedColors: areColorsInverted,
  forcedColors: areColorsForced,
  monochromeDepth: getMonochromeDepth,
  contrastPreference: getContrastPreference,
  reducedMotion: isTransparencyReduced,
  reducedTransparency: isMotionReduced,
  vendorFlavors: getVendorFlavors,
  touchSupport: getTouchSupport,
  scheduling: schedulingData,
  baseLatency: getAudioContextBaseLatency,
  screenResolution: getScreenResolution,
  screenFrame: getScreenFrame,
  intl: getIntlData,
  math: getMathResults,
  fontPreferences: getFontPreferences,
  fonts: getFonts,
  audio: getAudioContext,
  canvas: getCanvasFingerprint,
  clientRects: getClientRects,
  speechSynthesisVoices: getSpeechSynthesisVoices,
  webgl: getWebGL,
  webgpu: getWebGPU,
  storageQuota: getStorageQuota,
  mediaCapabilities: getMediaCapabilities,
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
  navigatorProperties: getNavigatorProperties,
  mediaDecodingCapabilities: getMediaDecodingCapabilities,
};
