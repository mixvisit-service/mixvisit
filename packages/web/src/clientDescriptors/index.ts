import { getArchitecture } from './architecture';
import { getAudioFingerprint } from './audio/index';
import { getAudioContextBaseLatency } from './audio_base_latency';
import { getCanvasFingerprint } from './canvas';
import { getColorDepth } from './color_depth';
import { getColorGamut } from './color_gamut';
import { getContrastPreference } from './contrast_preference';
import { areCookiesEnabled } from './cookies_enabled';
import { getCpuClass } from './cpu_class';
import { getDeviceMemory } from './device_memory';
import { getFontPreferences } from './font_preference';
import { getFonts } from './fonts';
import { areColorsForced } from './forced_colors';
import { getHardwareConcurrency } from './hardware_concurrency';
import { isHDR } from './hdr';
import { getHighEntropyValues } from './hight_entropy_values';
import { isHaveIndexedDB } from './indexed_db';
import { areColorsInverted } from './inverted_colors';
import { getLanguages } from './languages';
import { isHaveLocalStorage } from './local_storage';
import { getMathResults } from './math';
import { getMonochromeDepth } from './monochrome_depth';
import { isHaveOpenDatabase } from './open_database';
import { getOsCpu } from './os_cpu';
import { isPdfViewerEnabled } from './pdf_viewer_enabled';
import { getPlatform } from './platform';
import { getPlugins } from './plugins';
import { isMotionReduced } from './reduced_motion';
import { isTransparencyReduced } from './reduced_transparency';
import { getScreenFrame } from './screen_frame';
import { getScreenResolution } from './screen_resolution';
import { isHaveSessionStorage } from './session_storage';
import { getTimezone } from './timezone';
import { getTouchSupport } from './touch_support';
import { getUserAgent } from './user_agent';
import { getUserAgentData } from './user_agent_data';
import { getVendor } from './vendor';
import { getVendorFlavors } from './vendor_flavors';
import { getWebGL } from './webgl/index';
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
  pdfViewerEnabled: isPdfViewerEnabled,
  sessionStorage: isHaveSessionStorage,
  localStorage: isHaveLocalStorage,
  openDatabase: isHaveOpenDatabase,
  indexedDB: isHaveIndexedDB,
  colorGamut: getColorGamut,
  hdr: isHDR,
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
