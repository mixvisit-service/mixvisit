type PerformanceData = {
  commitLoadTime: number;
  connectionInfo: string;
  finishDocumentLoadTime: number;
  finishLoadTime: number;
  firstPaintAfterLoadTime: number;
  firstPaintTime: number;
  navigationType: string;
  npnNegotiatedProtocol: string;
  requestTime: number;
  startLoadTime: number;
  wasAlternateProtocolAvailable: boolean;
  wasFetchedViaSpdy: boolean;
  wasNpnNegotiated: boolean;
};

export function getPerformanceData(): PerformanceData {
  const {
    performance: { navigation, timing },
  } = window;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  const navigationEntries = performance.getEntriesByType('navigation')[0] as PerformanceResourceTiming;
  const paintEntries = performance.getEntriesByType('paint');

  return {
    commitLoadTime: timing.responseStart,
    connectionInfo: connection ? connection.effectiveType : 'unknown',
    finishDocumentLoadTime: timing.domContentLoadedEventEnd,
    finishLoadTime: timing.loadEventEnd,
    firstPaintAfterLoadTime: paintEntries.length > 0 ? paintEntries[0].startTime : 0,
    firstPaintTime: paintEntries.length > 0 ? paintEntries[0].startTime + timing.navigationStart : 0,
    navigationType: ['navigate', 'reload', 'back_forward', 'prerender'][navigation.type],
    npnNegotiatedProtocol: navigationEntries ? navigationEntries.nextHopProtocol : 'unknown',
    requestTime: timing.requestStart,
    startLoadTime: timing.fetchStart,
    wasAlternateProtocolAvailable: navigationEntries
      ? (navigationEntries as any).alternateProtocolUsage === 'used'
      : false,
    wasFetchedViaSpdy: navigationEntries
      ? navigationEntries.nextHopProtocol.includes('h2') || navigationEntries.nextHopProtocol.includes('h3')
      : false,
    wasNpnNegotiated: navigationEntries ? navigationEntries.nextHopProtocol !== 'http/1.1' : false,
  };
}
