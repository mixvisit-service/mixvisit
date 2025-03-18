<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';
  import ToggleIcon from './ToggleIcon.svelte';

  export let clientData = '';
  export let loadTime = '';

  let isOpen = false;
  let formattedLoadTime = loadTime ? `(${loadTime} ms)` : '';
</script>

<details bind:open={isOpen}>
  <summary>
    <ToggleIcon {isOpen} size={32} />
    <h3>Client data obtained {formattedLoadTime}</h3>
  </summary>
  {#if clientData}
  <Highlight language={json} code={clientData} />
  {/if}
</details>
