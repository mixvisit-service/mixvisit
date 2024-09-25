type DRMSupportInfo = {
  supported: boolean;
  systems?: {
    'com.widevine.alpha': boolean;
    'com.microsoft.playready': boolean;
    'com.apple.fps.1_0': boolean;
    'org.w3.clearkey': boolean;
  };
};

export async function getDRMSupportInfo(): Promise<DRMSupportInfo> {
  if (!navigator.requestMediaKeySystemAccess) {
    return { supported: false };
  }

  const drmSystems = ['com.widevine.alpha', 'com.microsoft.playready', 'com.apple.fps.1_0', 'org.w3.clearkey'] as const;
  const config = [
    {
      initDataTypes: ['cenc'],
      audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
      videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
    },
  ];

  try {
    const results = await Promise.all(
      drmSystems.map((system) => navigator
        .requestMediaKeySystemAccess(system, config)
        .then(() => ({ [system]: true }))
        .catch(() => ({ [system]: false }))),
    );

    return {
      supported: true,
      systems: Object.assign({}, ...results),
    };
  } catch (err) {
    return { supported: false };
  }
}
