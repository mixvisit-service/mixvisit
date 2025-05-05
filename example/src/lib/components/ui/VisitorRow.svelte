<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Instance } from 'tippy.js';

  import { tooltip } from '@hooks/tooltip';
  import { TDef } from '$lib/utils/common';

  export let field: string;
  export let value: string | number | null;

  let tooltipInstance: Instance | null = null;

  $: isCorrectValue = !(TDef.isNull(value) || TDef.isUndefined(value));
  $: isCopyAvailable = field === 'personalId' || field === 'location';
  $: qualifier = ['visitCounter', 'incognitoCounter'].includes(field)
    ? 'sessions'
    : field === 'ipAddress'
      ? 'IP'
      : field === 'geolocations'
        ? 'locations'
        : '';

  const defaultTooltipContent = 'Click to copy';
  const visitorInfoFields: Record<string, { name: string; description: string }> = {
    personalId: {
      name: 'Personal ID',
      description: 'Your personal id for this visit',
    },
    location: {
      name: 'Location',
      description: 'Location info about visitor',
    },
    ip: {
      name: 'IP',
      description: 'Your IP address',
    },
    visitCounter: {
      name: 'Your visit counter',
      description: 'Counting the number of times you visit this site',
    },
    ipAddress: {
      name: 'IP Address',
      description: 'Your IP address',
    },
    geolocations: {
      name: 'Geolocations',
      description: 'Unique locations on your visits',
    },
    isIncognito: {
      name: 'Incognito',
      description: 'Is this visit in incognito mode',
    },
    incognitoCounter: {
      name: 'Incognito visits',
      description: 'Counting the number of times you visit in incognito mode',
    },
  };

  async function copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(String(value));

      tooltipInstance?.setContent('Copied!');
      tooltipInstance?.show();

      setTimeout(() => {
        tooltipInstance?.setContent(defaultTooltipContent);
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }
</script>

{#if isCorrectValue}
  <div class="location-item">
    <div class="location-item__name-column">{visitorInfoFields[field].name}</div>
    <div class="location-item__value-column">
      <div class="location-item__value">
        <div class="bold">{value ?? '—'}</div>
        {qualifier}
        {#if isCopyAvailable}
          <button
            class="location-item__copy"
            aria-label="copy"
            on:click={copyToClipboard}
            use:tooltip={{
              content: defaultTooltipContent,
              placement: 'top',
              onCreate(instance) {
                tooltipInstance = instance;
              },
            }}
          >
            <Icon icon="akar-icons:copy" width="20" height="20" />
          </button>
        {/if}
      </div>
      <button
        class="location-item__info"
        aria-label="info"
        use:tooltip={{ content: visitorInfoFields[field].description }}
      >
        <Icon icon="akar-icons:info" width="20" height="20" />
      </button>
    </div>
  </div>
{/if}

<style>
  .location-item {
    display: flex;
    flex: 0 0 auto;
    flex-direction: row;
    overflow: hidden;
    align-items: center;
    height: 5.63rem;
    padding: 1.57rem;
  }

  .location-item__name-column {
    width: 9rem;
    margin-right: 0.63rem;
  }

  .location-item__value-column {
    display: flex;
    flex-direction: row;
    width: auto;
  }

  .location-item__value {
    display: flex;
    background: hsl(0, 0%, 19%);
    border-radius: 0.3rem;
    padding: 0.4rem 0.63rem;
    width: fit-content;
    max-width: 12rem;
  }

  .location-item:not(:last-child) {
    border-bottom: 0.13rem solid hsl(0, 0%, 42%);
  }

  .location-item:last-child {
    margin-bottom: 0;
  }

  .location-item__value .bold {
    font-weight: 600;
    margin-right: 0.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .location-item__value {
    max-width: max-content;
    width: auto;
  }

  .location-item__copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: hsl(240, 8%, 75%);
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .location-item__copy:hover {
    color: hsl(240, 3%, 57%);
  }

  .location-item__copy:active {
    color: hsl(240, 8%, 75%);
  }

  .location-item__info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    padding: 0;
    background: none;
    color: hsl(240, 8%, 83%);
    border: none;
  }

  @media screen and (max-width: 760px) {
    .location-item__value {
      width: fit-content;
      max-width: 11.88rem;
    }
  }
</style>
