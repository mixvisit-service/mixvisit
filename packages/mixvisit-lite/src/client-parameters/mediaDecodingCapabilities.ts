import { hasProperty } from '../utils/helpers';

interface MediaDecodingCapabilities extends MediaCapabilitiesInfo {
  keySystemAccess?: MediaKeySystemAccess | null;
}

export async function getMediaDecodingCapabilities(): Promise<MediaDecodingCapabilities[]> {
  if (!hasProperty(navigator, 'mediaCapabilities')) {
    return [];
  }

  const videoConfigurations = [
    {
      type: 'file',
      video: {
        contentType: 'video/mp4; codecs="avc1.42E01E"',
        width: 1920,
        height: 1080,
        bitrate: 2646242,
        framerate: 30,
      },
    },
    {
      type: 'file',
      video: {
        contentType: 'video/webm; codecs="vp9"',
        width: 1920,
        height: 1080,
        bitrate: 2646242,
        framerate: 30,
      },
    },
    {
      type: 'file',
      video: {
        contentType: 'video/ogg; codecs="theora"',
        width: 1280,
        height: 720,
        bitrate: 1500000,
        framerate: 30,
      },
    },
    {
      type: 'media-source',
      video: {
        contentType: 'video/mp4; codecs="avc1.42E01E"',
        width: 1920,
        height: 1080,
        bitrate: 2646242,
        framerate: 30,
      },
    },
    {
      type: 'media-source',
      video: {
        contentType: 'video/webm; codecs="vp9"',
        width: 1920,
        height: 1080,
        bitrate: 2646242,
        framerate: 30,
      },
    },
    {
      type: 'media-source',
      video: {
        contentType: 'video/ogg; codecs="theora"',
        width: 1280,
        height: 720,
        bitrate: 1500000,
        framerate: 30,
      },
    },
  ] as const;

  const result = await Promise.all(
    videoConfigurations.map(async (config) => {
      try {
        const decodingInfo: MediaDecodingCapabilities = await navigator.mediaCapabilities.decodingInfo(config);

        return {
          contentType: config.video.contentType,
          powerEfficient: decodingInfo.powerEfficient,
          smooth: decodingInfo.smooth,
          supported: decodingInfo.supported,
          keySystemAccess: decodingInfo.keySystemAccess,
        };
      } catch (err) {
        return {
          contentType: config.video.contentType,
          powerEfficient: false,
          smooth: false,
          supported: false,
          keySystemAccess: null,
        };
      }
    }),
  );

  return result;
}
