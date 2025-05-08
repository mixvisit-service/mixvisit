<script lang="ts">
  import { onMount } from 'svelte';

  import { Accordion, VisitMapSlider, VisitorInfo } from '@components/ui';

  import { genereteVisitDataArr, genereteVisitorInfoObj, saveVisitorData } from '$lib/services/visitor';
  import { TDef } from '$lib/utils/common';
  import type { VisitData, VisitorData, VisitorInfo as VisitorInfoType } from '$lib/types';

  export let visitorData: VisitorData | null;

  let visitorInfo: VisitorInfoType | null = null;
  let visits: VisitData[] | null = null;

  onMount(async () => {
    try {
      if (!(visitorData && TDef.isObject(visitorData) && Object.keys(visitorData).length)) {
        return;
      }

      const allSavedVisitorData = saveVisitorData(visitorData);

      const currVisit = allSavedVisitorData[allSavedVisitorData.length - 1];
      const onlyWithCurrHashData = allSavedVisitorData.filter((item) => item.visitorID === currVisit.visitorID);

      visitorInfo = genereteVisitorInfoObj(onlyWithCurrHashData);
      visits = genereteVisitDataArr(onlyWithCurrHashData);
    } catch (err) {
      console.error(err);
    }
  });
</script>

{#if visits && visitorInfo}
  <Accordion title="Use case" isOpen={true}>
    <div class="visitor">
      <VisitMapSlider {visits} />
      <VisitorInfo {visitorInfo} />
    </div>
  </Accordion>
{/if}

<style>
  .visitor {
    display: flex;
    flex-direction: row;
  }

  @media screen and (max-width: 1100px) {
    .visitor {
      display: grid;
    }
  }
</style>
