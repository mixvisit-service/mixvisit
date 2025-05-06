<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import type { VisitData } from '$lib/types';

  export let visits: VisitData[] | null = null;

  let currentVisit: VisitData | null = null;
  let currentVisitIdx: number = -1;

  let mapContainer: HTMLDivElement;
  let map: L.Map;
  let marker: L.Marker;
  let Leaflet: typeof import('leaflet') | null = null;

  $: lastElementIdx = visits ? visits?.length - 1 : -1;
  $: atStart = currentVisitIdx <= 0;
  $: atEnd = visits ? currentVisitIdx >= lastElementIdx : true;

  $: if (visits && visits.length > 0) {
    if (currentVisitIdx === -1) {
      currentVisitIdx = lastElementIdx;
      currentVisit = visits[currentVisitIdx];
    }
  }

  $: if (Leaflet && map && marker && currentVisit) {
    const { lat, lng } = currentVisit;
    const latlng: [number, number] = [lat, lng];

    marker.setLatLng(latlng);
    map.setView(latlng, map.getZoom() ?? 6);
  }

  onMount(async (): Promise<void> => {
    Leaflet = await import('leaflet');

    const minZoom = 4;
    const maxZoom = 14;
    const location = Leaflet.latLng(0, 0);

    map = Leaflet.map(mapContainer, {
      center: location,
      minZoom,
      maxZoom,
      zoom: 8,
    });

    marker = Leaflet.marker(location, {
      icon: Leaflet.icon({
        iconUrl: '/_app/location-marker.svg',
        iconSize: [26, 36],
        iconAnchor: [16, 36],
        popupAnchor: [-2, -40],
      }),
    });

    marker.addTo(map);
    map.scrollWheelZoom.disable();

    Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
    }).addTo(map);
  });

  onDestroy(async (): Promise<void> => {
    if (map) {
      map.remove();
    }
  });

  function prevVisit(): void {
    if (visits && currentVisitIdx > 0) {
      currentVisitIdx -= 1;
      currentVisit = visits[currentVisitIdx];
    }
  }

  function nextVisit(): void {
    if (visits && currentVisitIdx < lastElementIdx) {
      currentVisitIdx += 1;
      currentVisit = visits[currentVisitIdx];
    }
  }
</script>

{#if visits}
  <div class="visit-map-slider">
    <div bind:this={mapContainer} class="visit-map-slider__map"></div>

    <div class="visit-map-slider__controls">
      <button class="visit-map-slider__button" on:click={prevVisit} disabled={atStart}>
        <Icon icon="akar-icons:chevron-left" width="20" height="20" />
      </button>
      <button class="visit-map-slider__button" on:click={nextVisit} disabled={atEnd}>
        <Icon icon="akar-icons:chevron-right" width="20" height="20" />
      </button>
    </div>

    <div class="visit-map-slider__info">
      <span class="visit-map-slider__date">{currentVisit?.time ?? '—'}</span>
      <span class="visit-map-slider__days">{currentVisit?.when ?? '—'}</span>
      <span class="visit-map-slider__status">{currentVisit?.visitStatus ?? '—'}</span>
    </div>
  </div>
{/if}

<style>
  .visit-map-slider {
    width: 100%;
    min-width: 12rem;
  }

  .visit-map-slider__map {
    width: 100%;
    height: 12rem;
    background-size: cover;
    background-position: center;
    border-radius: 0.6rem;
  }

  .visit-map-slider__controls {
    width: 6rem;
    display: flex;
    justify-content: space-between;
    margin: 1.3rem auto;
  }

  .visit-map-slider__button {
    background: hsl(0, 0%, 95%);
    color: hsl(0, 0%, 0%);
    border: none;
    padding: 0.6rem 0.8rem;
    border-radius: 50%;
    cursor: pointer;
  }

  .visit-map-slider__button:active {
    opacity: 0.6;
  }

  .visit-map-slider__button:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .visit-map-slider__info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .visit-map-slider__info span {
    padding-top: 0.3rem;
  }

  .visit-map-slider__date,
  .visit-map-slider__days {
    font-weight: 600;
  }

  .visit-map-slider__status {
    color: hsl(0, 0%, 67%);
    font-size: smaller;
  }

  @supports (-webkit-hyphens: none) {
    .visit-map-slider__button {
      font-size: 1.13rem;
      padding: 0.63rem 0.9rem;
    }
  }

  @media screen and (max-width: 1100px) {
    .visit-map-slider {
      margin-bottom: 1.25rem;
    }
  }
</style>
