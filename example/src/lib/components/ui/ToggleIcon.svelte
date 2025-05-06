<script>
  import Icon from '@iconify/svelte';
  import { cubicOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';

  export let isOpen = false;
  export let color = 'currentColor';
  export let size = 24;

  const iconClosed = 'iconamoon:arrow-down-2-bold';

  const rotation = new Tween({
    from: isOpen ? -180 : 0,
    to: isOpen ? 0 : -180,
    duration: 200,
    easing: cubicOut,
  });
</script>

<Icon icon={iconClosed} width={size} height={size} {color} style="transform: rotate({rotation}deg);" />
