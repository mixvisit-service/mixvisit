<script lang="ts">
  import { onMount } from 'svelte';
  import highlightStyle from 'svelte-highlight/styles/circus';

  import Badges from './components/Badges.svelte';
  import UsageExample from './components/UsageExample.svelte';
  import VisitorBlock from './components/VisitorBlock.svelte';
  import ClientData from './components/ClientData.svelte';
  import About from './components/About.svelte';
  import GoToTop from './components/GoToTop.svelte';

  import { getLocationData } from './logics/api';
  import { TDef, getFPData } from './logics/utils';
  import type { VisitorData } from './logics/types';

  let status = 'not loaded';
  let fpClientData = '';
  let loadTime = '';
  let visitorData: VisitorData | null = null;
  let productYears = '';

  const releaseYear = 2024;

  onMount(() => {
    (async () => {
      await main();
    })();
  });

  async function main(): Promise<void> {
    try {
      const currentYear = new Date().getFullYear();
      productYears = currentYear === releaseYear ? currentYear.toString() : `${releaseYear}-${currentYear}`; 

      const fpData = await getFPData();
      const { data, fingerprintHash, loadTime: loadTimeRes } = fpData || {};
      const location = await getLocationData();

      if (
        !(
          fingerprintHash &&
          location &&
          TDef.isObject(data) &&
          TDef.isObject(location) &&
          TDef.isNumber(loadTimeRes)
        )
      ) {
        throw new Error('Something wrong with fingerprint or location data');
      }

      visitorData = {
        visitorID: fingerprintHash,
        location,
      };

      status = 'loaded';

      if (data && TDef.isObject(data)) {
        fpClientData = JSON.stringify(data, null, 2);
      }

      if (loadTimeRes && TDef.isNumber(loadTimeRes)) {
        loadTime = loadTimeRes.toString();
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
    <ClientData data={fpClientData} {loadTime} />
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
    display: flex;
    justify-content: center;
  }
</style>
