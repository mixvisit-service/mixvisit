<script lang="ts">
  import { onMount } from 'svelte';
  import highlightStyle from 'svelte-highlight/styles/circus';

  import Badges from './lib/components/Badges.svelte';
  import UsageExample from './lib/components/UsageExample.svelte';
  import VisitorBlock from './lib/components/VisitorBlock.svelte';
  import ClientData from './lib/components/ClientData.svelte';
  import About from './lib/components/About.svelte';
  import GoToTop from './lib/components/GoToTop.svelte';

  import { TDef, getMixVisitClientData } from './lib/utils';
  import type { VisitorData } from './lib/types';

  let status = 'not loaded';
  let data = '';
  let loadTime = '';
  let visitorData: VisitorData | null = null;
  let productYears = '';

  const releaseYear = 2024;
  const currentYear = new Date().getFullYear();
  productYears = currentYear === releaseYear ? currentYear.toString() : `${releaseYear}-${currentYear}`; 

  onMount(async () => {
    await main();
  });

  async function main(): Promise<void> {
    try {
      const mixvisitClientData = await getMixVisitClientData();
      const { 
        data: clientData, 
        loadTime: loadTimeRes,
        fingerprintHash, 
      } = mixvisitClientData || {};

      if (!(clientData && fingerprintHash && TDef.isObject(clientData) && TDef.isString(fingerprintHash))) {
        throw new Error('Something wrong with mixvisit data');
      }
      
      status = 'loaded';
      
      if (clientData && TDef.isObject(clientData)) {
        data = JSON.stringify(clientData, null, 2);
      }
      
      if (loadTimeRes && TDef.isNumber(loadTimeRes)) {
        loadTime = loadTimeRes.toString();
      }

      const location = clientData?.location?.value ?? null;
      if (location && fingerprintHash) {
        visitorData = {
          visitorID: fingerprintHash,
          location,
        };
      }
    } catch (err) {
      status = 'error';
      console.error(err);
    }
  }
</script>

<svelte:head>
  {@html highlightStyle}
</svelte:head>

<main>
  <h1 class="lib-title">MixVisitJS</h1>
  <h2>JS Fingerprint to identify & track devices</h2>
  <Badges />

  {#if status === 'loaded'}
    <UsageExample /> 
    <VisitorBlock {visitorData} />
    <ClientData {data} {loadTime} />
    <About /> 
    <GoToTop />
  {:else if status === 'not loaded'}
    <p>Loading ...</p>
  {:else}
    <p>Something wrong</p>
  {/if}
</main>

<footer>
  <p>Copyright &copy; {productYears} MixVisitJS. All rights reserved. <a href="https://opensource.org/licenses/MIT" target="_blank">MIT - License</a></p>
</footer>

<style>
  h1, h2, footer {
    text-align: center;
    word-wrap: break-word;
  }

  @media screen and (max-width: 690px) {
    .lib-title {
      font-size: 3.3rem;
    }

    h2 {
      font-size: 1.3rem;
    }
  }
</style>
