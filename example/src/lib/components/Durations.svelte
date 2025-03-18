<script lang="ts">
  import Icon from '@iconify/svelte';
  import Accordion from './Accordion.svelte';

  export let durationsData: { name: string; duration: number }[] = [];

  let sortOrder = 'desc';

  function toggleSortOrder() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  }
</script>

<Accordion title="Durations">
  <button on:click={toggleSortOrder} title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}>
    <Icon icon={sortOrder === 'asc' ? 'ph:sort-ascending' : 'ph:sort-descending'} width="18" height="18" />
  </button>
  <div class="durations">
    {#each durationsData.sort( (a, b) => (sortOrder === 'desc' ? b.duration - a.duration : a.duration - b.duration), ) as { name, duration }}
      <div class="durations__item">
        <span class="durations__item-name">{name}</span>
        <span>{duration} ms</span>
      </div>
    {/each}
  </div>
</Accordion>

<style>
  .durations {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.6rem 0;
  }

  .durations__item {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.6rem;
    background: hsl(0, 0%, 10%);
    border-radius: 0.5rem;
  }

  .durations__item-name {
    flex: 1;
    min-width: 0;
    max-width: 68rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    border: none;
    border-radius: 0.3rem;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    background: hsl(0, 0%, 33%);
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: hsl(0, 0%, 20%);
  }
</style>
