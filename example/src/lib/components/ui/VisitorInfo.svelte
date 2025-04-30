<script lang="ts">
  import type { VisitorInfo } from '$lib/types';

  import VisitorRow from './VisitorRow.svelte';

  export let visitorInfo: VisitorInfo | null;

  const sortedFields: (keyof VisitorInfo)[] = [
    'personalId', 'location', 'ip', 
    'visitCounter', 'ipAddress', 'geolocations', 
    'isIncognito', 'incognitoCounter',
  ];

  function pickEntries<T extends object, K extends keyof T>(obj: T, keys: K[]): [K, T[K]][] {
    return keys
      .filter((key) => key in obj)
      .map((key) => [key, obj[key]]);
  }
</script>

{#if visitorInfo}
  <div class="visitor-location-info">
    <div class="location-info-column">
      {#each pickEntries(visitorInfo, sortedFields) as [field, value]}
        <VisitorRow {field} {value} />
      {/each}
    </div>
  </div>
{/if}

<style>
  .visitor-location-info {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
    margin-left: 1.6rem;
    border: 0.13rem solid hsl(0, 0%, 42%);
    border-radius: 0.63rem;
  }

  .location-info-column {
    flex: 1 1 0;
  }

  @media screen and (max-width: 1100px) {
    .visitor-location-info {
      margin-left: 0;
    }
  }
</style>