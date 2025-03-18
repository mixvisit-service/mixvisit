<script lang="ts">
  import Icon from '@iconify/svelte';
  import ToggleIcon from './ToggleIcon.svelte';

  export let durationsData: { name: string; duration: number }[] = [];

  let isOpen = false;
  let sortOrder = 'desc';

  function toggleSortOrder() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  }
</script>

<details bind:open={isOpen}>
  <summary>
    <ToggleIcon {isOpen} size={32} />
    <h3>Durations</h3>
  </summary>
  <div class="durations">
    <button on:click={toggleSortOrder} title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}>
      <Icon icon={sortOrder === 'asc' ? 'ph:sort-ascending' : 'ph:sort-descending'} width="18" height="18" />
    </button>
    <div class="durations-value">
      {#each durationsData.sort( (a, b) => (sortOrder === 'desc' ? b.duration - a.duration : a.duration - b.duration), ) as { name, duration }}
        <div class="duration-item">
          <span class="param-name">{name}</span>
          <span class="param-time">{duration} ms</span>
        </div>
      {/each}
    </div>
  </div>
</details>

<style>
  .durations {
    margin: 1rem 0;
  }

  .durations-value {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.6rem 0;
  }

  .duration-item {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.6rem;
    background: hsl(0, 0%, 10%);
    border-radius: 0.5rem;
  }

  .param-name {
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
