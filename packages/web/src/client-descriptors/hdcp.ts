const HDCPVersions = [
  '1.0',
  '1.1',
  '1.2',
  '1.3',
  '1.4',
  '2.0',
  '2.1',
  '2.2',
  '2.3',
] as const;

const supportedConfig = [{
  videoCapabilities: [{
    contentType: 'video/webm; codecs="vp09.00.10.08"',
    robustness: 'SW_SECURE_DECODE',
  }],
}];

type HDCPStatusRes = Record<typeof HDCPVersions[number], string>;

export async function getHDCPPolicyCheck(): Promise<HDCPStatusRes | string | null> {
  try {
    const mediaKeySystemAccess = await navigator.requestMediaKeySystemAccess('com.widevine.alpha', supportedConfig);
    const mediaKeys = await mediaKeySystemAccess.createMediaKeys();

    if (!('getStatusForPolicy' in mediaKeys)) {
      return 'HDCP Policy Check API is not available';
    }

    const res = {} as HDCPStatusRes;
    const HDCPVersionsPromises: Promise<void>[] = [];

    for (const ver of HDCPVersions) {
      const statusForPolicyPromise = (mediaKeys as any).getStatusForPolicy({ minHdcpVersion: ver }) as Promise<string>;
      const promise = statusForPolicyPromise.then((status) => {
        res[ver] = status !== 'usable' ? status : 'available';
      });

      HDCPVersionsPromises.push(promise);
    }

    await Promise.all(HDCPVersionsPromises);

    return res;
  } catch (err) {
    console.log(err);

    return null;
  }
}
