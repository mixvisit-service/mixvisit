<script lang="ts">
  import Highlight from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';
  import bash from 'svelte-highlight/languages/bash';
  
  import { Accordion } from '../ui';

  const installingExample = `# with npm package manager
npm install @mix-visit/lite

# with yarn package manager
yarn add @mix-visit/lite

# with pnpm package manager
pnpm add @mix-visit/lite
`;

  const importCode = "import { MixVisit, type ClientData } from '@mix-visit/lite';";
  const classInitialization = "const mixvisit = new MixVisit();";

  const excludeLoadAndGet = `await mixvisit.load({ exclude: ['geolocation'], timeout: 700 });
const data: ClientData = mixvisit.get();`;

  const onlyLoadAndGet = `await mixvisit.load({ only: ['geolocation', 'webrtc'] });
const extendedData = mixvisit.get();`; 

  const usingGetters = `const loadTime = mixvisit.loadTime;
const hash = mixvisit.fingerprintHash;`;

  const usingGettersAll = `const allClientData = mixvisit.get();
const isDevToolsOpen = mixvisit.get('devToolsOpen');
const { location, geolocation, webrtc } = mixvisit.get(['location', 'geolocation', 'webrtc']);`;
</script>

<Accordion title="Usage example" isOpen={true}>
  <p>At first install <strong><i>MixvisitJS</i></strong> package</p>
  <Highlight language={bash} code={installingExample} />

  <p>After installation, you can use the module. Import the main <code class="inline">MixVisit</code> class and the <code class="inline">ClientData</code> type.</p>
  <Highlight language={typescript} code={importCode} />

  <p>First, create an instance of <code class="inline">MixVisit</code> for usage.</p>
  <Highlight language={typescript} code={classInitialization} />

  <p>
    For example, collect all data except <code class="inline">geolocation</code>, with a timeout of 700 ms for asynchronous parameters. 
    Then, use <code class="inline">get</code> method to retrieve all collected client data and save it in the <code class="inline">data</code> variable.
  </p>
  <Highlight language={typescript} code={excludeLoadAndGet} />

  <p>
    Suppose that after we need this <code class="inline">geolocation</code> parameter, we also need the <code class="inline">webrtc</code> parameter that was not loaded due to a timeout. 
    The <code class="inline">load</code> method with the <code class="inline">only</code> option executes with a maximum timeout of 12 seconds. This option loads only the specified parameters. 
    After that, when requesting all data, the <code class="inline">geolocation</code> and <code class="inline">webrtc</code> parameters will be included.
  </p>
  <Highlight language={typescript} code={onlyLoadAndGet} />

  <p>
    After you have loaded the parameters using the <code class="inline">load</code> method, the properties <code class="inline">loadTime</code> and <code class="inline">fingerprintHash</code> become available. 
    The <code class="inline">loadTime</code> property stores the time of the last <code class="inline">load</code> function execution. The <code class="inline">fingerprintHash</code> property contains the generated fingerprint hash.
  </p>
  <Highlight language={typescript} code={usingGetters} />

  <p>
    You can also retrieve the loaded parameters using the <code class="inline">get</code> method. If you want to retrieve all client data, call the <code class="inline">get</code> method without options. 
    If you need a specific parameter, pass its name as a string. To get multiple parameters, provide an array with the required parameters.
  </p>
  <Highlight language={typescript} code={usingGettersAll} />
</Accordion>

<style>
  p {
    margin: 0 0 0.6rem 0;
  }
  
  p:not(:first-of-type) {
    margin-top: 0.6rem;
  }

  .inline {
    font-family: monospace;
    background: hsl(0deg 0% 20.17%);
    padding: 0.12rem 0.2rem;
    border-radius: 0.25rem;
    color: hsl(33.48deg 90.15% 58.41%);
    font-size: 0.9rem;
  }
</style>
