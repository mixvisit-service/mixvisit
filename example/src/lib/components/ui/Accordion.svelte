<script lang="ts">
  import { onMount } from 'svelte';

  import ToggleIcon from './ToggleIcon.svelte';

  export let title = '';
  export let isOpen = false;

  let detailsEl: HTMLDetailsElement | null = null;

  onMount(() => {
    if (detailsEl && isOpen) {
      detailsEl.setAttribute('open', '');
    }
  });
</script>

<details bind:open={isOpen} bind:this={detailsEl}>
  <summary>
    <ToggleIcon {isOpen} />
    {#if title}
      <h3>{title}</h3>
    {/if}
  </summary>
  <div class="content">
    <slot></slot>
  </div>
</details>

<style>
  summary {
    list-style: none;
    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
  }

  h3 {
    margin: 0;
  }

  .content {
    padding: 10px;
  }
</style>
