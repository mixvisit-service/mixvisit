<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  import { Accordion } from '@components/ui';

  export let clientData = '';
  export let loadTime = '';

  $: formattedLoadTime = loadTime ? `(${loadTime} ms)` : '';
</script>

{#if clientData}
  <Accordion title={`Client data obtained ${formattedLoadTime}`} isOpen={true}>
    <Highlight language={json} code={clientData} />
  </Accordion>
{/if}
