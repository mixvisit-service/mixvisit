<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  export let data = '';
  export let loadTime = '';

  let formattedLoadTime = loadTime ? `(${loadTime} ms)` : '';
</script>

{#if data}
<details open>
  <summary>Customer data obtained {formattedLoadTime}</summary>
  <Highlight language={json} code={data} />
</details>
{/if}
