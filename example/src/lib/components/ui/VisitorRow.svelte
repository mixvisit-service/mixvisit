<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Instance } from 'tippy.js';

  import { tooltip } from '@hooks/tooltip';
  import { TDef } from '$lib/utils/common';

  export let field: string;
  export let value: any;
  
  let tooltipInstance: Instance | null = null;
  
  $: isCorrectValue = !(TDef.isNull(value) || TDef.isUndefined(value));
  $: isCopyAvailable = field === 'personalId' || field === 'location';
  $: qualifier = ['visitCounter', 'incognitoCounter'].includes(field) ? 'sessions' 
    : field === 'ipAddress' ? 'IP' 
    : field === 'geolocations' ? 'locations' 
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
      await navigator.clipboard.writeText(JSON.stringify(value));

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

{#if isCorrectValue }
  <div class="location-item">
    <span>{visitorInfoFields[field].name}</span>
    <span>
      <div class="value">
        <div class="bold">{value ?? '—'}</div> {qualifier}
        {#if isCopyAvailable}
          <button 
            class="button-copy" 
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
        class="button-info" 
        aria-label="info"
        use:tooltip={{content: visitorInfoFields[field].description }}
      >
        <Icon icon="akar-icons:info" width="20" height="20" />
      </button>
    </span>
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

  .location-item span:first-of-type {
    width: 9rem;
    margin-right: 0.63rem;
  }

  .location-item span:last-of-type {
    display: flex;
    flex-direction: row;
    width: auto;
  }

  .location-item span > .value {
    display: flex;
    background: hsl(0, 0%, 19%);
    border-radius: 0.3rem;
    padding: 0.4rem 0.63rem;
    width: fit-content;
    max-width: 12rem;
  }

  .location-item span > .value .bold {
    font-weight: 600;
    margin-right: 0.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .location-item span > .value {
    max-width: max-content;
    width: auto;
  }
  
  .location-item:not(:last-child) {
    border-bottom: 0.13rem solid hsl(0, 0%, 42%);
  }
  
  .location-item:last-child {
    margin-bottom: 0;
  }

  button.button-copy {
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

  button.button-copy:hover {
    color: hsl(240, 3%, 57%);
  }

  button.button-copy:active {
    color: hsl(240, 8%, 75%);
  }

  button.button-info {
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
    .location-item span > .value {
      width: fit-content;
      max-width: 11.88rem;
    }
  }
</style>