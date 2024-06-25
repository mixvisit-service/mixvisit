<script lang="ts">
  import { onMount } from 'svelte';
  import highlightStyle from 'svelte-highlight/styles/circus';

  import FPClientData from './components/FPClientData.svelte';
  import VisitorBlock from './components/VisitorBlock.svelte';
  // import CodeExample from './components/CodeExample.svelte';

  import { getLocationData } from './logics/api';
  import { TDef, getFPData } from './logics/utils';
  import type { VisitorData } from './logics/types';

  let status = 'not loaded';
  let fpClientData = '';
  let loadTime = '';
  let visitorData: VisitorData | null = null;

  onMount(() => {
    (async () => {
      await main();
    })();
  });

  async function main(): Promise<void> {
    try {
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
  <h2>MixVisitJS example</h2>

  {#if status === 'loaded'}
    <VisitorBlock {visitorData} />
    <!-- <CodeExample />  -->
    <FPClientData data={fpClientData} {loadTime} />
  {:else if status === 'not loaded'}
    <p>Loading ...</p>
  {:else}
    <p>Something wrong ...</p>
  {/if}
</main>
