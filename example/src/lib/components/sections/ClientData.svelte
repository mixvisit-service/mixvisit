<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  import { Accordion } from '../ui';

  export let clientData = '';
  export let loadTime = '';

  $: formattedLoadTime = loadTime ? `(${loadTime} ms)` : '';
</script>

<Accordion title={`Client data obtained ${formattedLoadTime}`} isOpen={true}>
  {#if clientData}
  <Highlight language={json} code={clientData} />
  {/if}
</Accordion>