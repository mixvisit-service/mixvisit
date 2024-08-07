import { getArchitecture } from './architecture';
import { getAudioFingerprint } from './audio';
import { getAudioContextBaseLatency } from './audioBaseLatency';
import { getCanvasFingerprint } from './canvas';
import { getColorDepth } from './colorDepth';
import { getColorGamut } from './colorGamut';
import { getContrastPreference } from './contrastPreference';
import { areCookiesEnabled } from './cookiesEnabled';
import { getCpuClass } from './cpuClass';
import { getDeviceMemory } from './deviceMemory';
import { getFontPreferences } from './fontPreference';
import { getFonts } from './fonts';
import { areColorsForced } from './forcedColors';
import { getGeolocation } from './geolocation';
import { getHardwareConcurrency } from './hardwareConcurrency';
import { getHDCPPolicyCheck } from './hdcp';
import { isHDR } from './hdr';
import { getHighEntropyValues } from './hightEntropyValues';
import { isHaveIndexedDB } from './indexedDB';
import { areColorsInverted } from './invertedColors';
import { getLanguages } from './languages';
import { isHaveLocalStorage } from './localStorage';
import { getMathResults } from './math';
import { getMonochromeDepth } from './monochromeDepth';
import { isHaveOpenDatabase } from './openDatabase';
import { getOsCpu } from './osCPU';
import { isPdfViewerEnabled } from './pdfViewerEnabled';
import { getPlatform } from './platform';
import { getPlugins } from './plugins';
import { isMotionReduced } from './reducedMotion';
import { isTransparencyReduced } from './reducedTransparency';
import { getScreenFrame } from './screen-frame';
import { getScreenResolution } from './screenResolution';
import { isHaveSessionStorage } from './sessionStorage';
import { getTimezone } from './timezone';
import { getTouchSupport } from './touchSupport';
import { getUserAgent } from './userAgent';
import { getUserAgentData } from './userAgentData';
import { getVendor } from './vendor';
import { getVendorFlavors } from './vendorFlavors';
import { getWebGL } from './webgl';
import { getWebGPU } from './webgpu';

export type Descriptors = typeof descriptors;

export const descriptors = {
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
  geolocation: getGeolocation,
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
  webgl: getWebGL,
  webgpu: getWebGPU,
};
