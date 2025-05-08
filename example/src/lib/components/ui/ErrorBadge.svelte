<script lang="ts">
  import type { Instance } from 'tippy.js';

  import { tooltip } from '@utils/tippy';

  export let error: { code: string; message: string };

  let tooltipInstance: Instance | null = null;

  async function copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(error.message);

      tooltipInstance?.setContent('Copied!');
      tooltipInstance?.show();

      setTimeout(() => {
        tooltipInstance?.setContent(error.message);
      }, 600);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<button
  type="button"
  on:click={copyToClipboard}
  use:tooltip={{
    content: error.message,
    placement: 'top',
    onCreate(instance) {
      tooltipInstance = instance;
    }
  }}
>
  {error.code}
</button>

<style>
  button {
    all: unset;
    cursor: pointer;
    color: hsl(348, 63%, 63%);
  }
</style>