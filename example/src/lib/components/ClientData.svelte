<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  import Accordion from './Accordion.svelte';

  export let clientData = '';
  export let loadTime = '';

  $: formattedLoadTime = loadTime ? `(${loadTime} ms)` : '';
</script>

<Accordion title={`Client data obtained ${formattedLoadTime}`}>
  {#if clientData}
  <Highlight language={json} code={clientData} />
  {/if}
</Accordion>