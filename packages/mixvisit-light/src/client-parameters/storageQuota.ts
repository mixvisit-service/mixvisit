export async function getStorageQuota(): Promise<StorageEstimate | null> {
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();

      return {
        quota: estimate.quota,
        usage: estimate.usage,
      } as StorageEstimate;
    } catch (err) {
      console.error('Error when retrieving storage information: ', err);

      return null;
    }
  }

  console.warn('The storage API is not supported');

  return null;
}
