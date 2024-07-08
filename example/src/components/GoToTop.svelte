<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  let showButton = false;

  onMount(() => {
    window.addEventListener('scroll', scrollFunction);

    return () => window.removeEventListener('scroll', scrollFunction);
  });
  
  function goToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollFunction(): void {
    showButton = window.pageYOffset > 800;
  }
</script>

<button class="to-top {showButton ? 'show' : ''}" on:click={goToTop} title="To top">
  <Icon icon="ion:arrow-up" width="24" height="24" />
</button>

<style>
  .to-top {
    display: none;
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 99;
    border: none;
    outline: none;
    background-color: #555;
    color: white;
    cursor: pointer;
    padding: 1rem;
    border-radius: .25rem;
    transition: background-color 0.3s;
  }

  .to-top.show {
    display: block;
  }

  .to-top:hover {
    background-color: #333;
  }
</style>
