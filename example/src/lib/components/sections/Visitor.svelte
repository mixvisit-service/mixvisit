<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import { Accordion } from '@components/ui';
  import { VisitorInfo } from '@components/ui';

  import { genereteVisitDataArr, genereteVisitorInfoObj, saveVisitorData } from '$lib/services/visitor';

  import type { VisitData, VisitorData, VisitorInfo as VisitorInfoType } from '$lib/types';
  import { TDef } from '$lib/utils/common';

  export let visitorData: VisitorData | null;

  let visitorInfo: VisitorInfoType | null = null;
  let currentVisit: VisitData | null = null;

  onMount(main);

  async function main(): Promise<void> {
    try {
      if (!(visitorData && TDef.isObject(visitorData) && Object.keys(visitorData).length)) {
        return;
      }

      const allSavedVisitorData = saveVisitorData(visitorData);

      const currVisit = allSavedVisitorData[allSavedVisitorData.length - 1];
      const onlyWithCurrHashData = allSavedVisitorData.filter((item) => item.visitorID === currVisit.visitorID);
      visitorInfo = genereteVisitorInfoObj(onlyWithCurrHashData);

      const visitForMapArr = genereteVisitDataArr(onlyWithCurrHashData);
      const currentVisitIdx = visitForMapArr.length - 1;
      currentVisit = visitForMapArr[currentVisitIdx];

      console.log('visitForMapArr[currentVisitIdx] :>> ', visitForMapArr[currentVisitIdx]);
      console.log('visitorInfo :>> ', visitorInfo);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<Accordion title="Use case" isOpen={true}>
  <div id="visitor">
    <div class="visit-map-slider">
      <div id="visit-map"></div>
      <div class="visit-map-slider-controls">
        <button class="slider-button">
          <Icon icon="akar-icons:chevron-left" width="20" height="20" />
        </button>
        <button class="slider-button">
          <Icon icon="akar-icons:chevron-right" width="20" height="20" />
        </button>
      </div>
      <div class="visit-map-date-info">
        <span class="date-info">{currentVisit?.time ?? '—'}</span>
        <span class="date-info">{currentVisit?.when ?? '—'}</span>
        <span class="visit-info">{currentVisit?.visitStatus ?? '—'}</span>
      </div>
    </div>
    <VisitorInfo {visitorInfo} />
  </div>
</Accordion>

<style>
  #visitor {
    display: flex;
    flex-direction: row;
  }

  #visit-map {
    width: 100%;
    height: 12rem;
    background-size: cover;
    background-position: center;
    border-radius: 0.6rem;
  }

  .visit-map-slider {
    width: 100%;
    min-width: 12rem;
  }

  .visit-map-slider-controls {
    width: 6rem;
    display: flex;
    justify-content: space-between;
    margin: 1.3rem auto;
  }

  .slider-button {
    background: hsl(0, 0%, 95%);
    color: hsl(0, 0%, 0%);
    border: none;
    padding: 0.6rem 0.8rem;
    border-radius: 50%;
    cursor: pointer;
  }

  .slider-button:active {
    opacity: 0.6;
  }

  .slider-button.disabled {
    cursor: default;
    opacity: 0.5;
  }

  .visit-map-date-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .visit-map-date-info span {
    padding-top: 0.3rem;
  }

  .date-info {
    font-weight: 600;
  }

  .visit-info {
    color: hsl(0, 0%, 67%);
    font-size: smaller;
  }

  @supports (-webkit-hyphens: none) {
    .slider-button {
      font-size: 1.13rem;
      padding: 0.63rem 0.9rem;
    }
  }

  @media screen and (max-width: 1100px) {
    #visitor {
      display: grid;
    }
    .visit-map-slider {
      margin-bottom: 1.25rem;
    }
  }
</style>