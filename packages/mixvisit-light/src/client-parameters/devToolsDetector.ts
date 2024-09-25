export async function isDevToolsOpened(): Promise<boolean> {
  return (await isDevToolsOpenedDebuggerChecking()) || isDevToolsOpenScreenMismatchChecking();
}

function isDevToolsOpenedDebuggerChecking(): Promise<boolean> {
  let devtoolsOpen = false;

  const worker = new Worker(
    URL.createObjectURL(
      new Blob(
        [
          `
          "use strict";
            onmessage = () => {
              postMessage({ isOpenBeat: true });
              debugger;
              postMessage({ isOpenBeat: false });
            };
          `,
        ],
        { type: 'text/javascript' },
      ),
    ),
  );

  return new Promise((resolve) => {
    let timeout: any;

    worker.onmessage = (event: MessageEvent<{ isOpenBeat: boolean }>) => {
      if (event.data.isOpenBeat) {
        timeout = setTimeout(() => {
          devtoolsOpen = true;
          worker.terminate();
          resolve(devtoolsOpen);
        }, 100);
      } else {
        clearTimeout(timeout);
        devtoolsOpen = false;
        worker.terminate();
        resolve(devtoolsOpen);
      }
    };

    worker.postMessage({});
  });
}

function isDevToolsOpenScreenMismatchChecking(): boolean {
  const threshold = 160;
  const hasWidthDiscrepancy = window.outerWidth - window.innerWidth > threshold;
  const hasHeightDiscrepancy = window.outerHeight - window.innerHeight > threshold;

  return hasWidthDiscrepancy || hasHeightDiscrepancy;
}
