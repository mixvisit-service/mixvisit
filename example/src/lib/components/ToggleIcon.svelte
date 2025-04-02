<script>
  import Icon from '@iconify/svelte';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';

  export let isOpen = false;
  export let color = 'currentColor';
  export let size = 24;

  const iconClosed = 'iconamoon:arrow-down-2-bold';

  let rotation = tweened(0, { duration: 200, easing: cubicOut });

  $: rotation.set(isOpen ? -180 : 0);
</script>

<Icon
  icon={iconClosed}
  width={size}
  height={size}
  color={color}
  style="transform: rotate({$rotation}deg);"
/>