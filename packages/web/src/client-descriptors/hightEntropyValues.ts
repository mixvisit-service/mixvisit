export async function getHighEntropyValues(): Promise<UADataValues | null> {
  return await navigator.userAgentData?.getHighEntropyValues([
    'architecture', 'bitness', 'brands', 'mobile', 'model', 'platform',
    'platformVersion', 'uaFullVersion', 'wow64', 'fullVersionList',
  ]) || null;
}
