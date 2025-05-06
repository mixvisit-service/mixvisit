<script lang="ts">
  import Icon from '@iconify/svelte';

  export let size = 24;
  export let color = 'currentColor';
  export let isOpen = false;

  const iconClosed = 'iconamoon:arrow-down-2-bold';
</script>

<Icon
  icon={iconClosed}
  width={size}
  height={size}
  {color}
  style="transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); transform: rotate({isOpen ? 180 : 0}deg);"
/>
