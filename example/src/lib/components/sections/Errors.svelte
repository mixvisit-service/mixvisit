<script lang="ts">
  import Icon from '@iconify/svelte';

  import { Accordion, ErrorBadge } from '@components/ui';

  import type { GroupedError } from '$lib/types';

  export let errorsData: GroupedError[] = [];

  let sortOrder = 'desc';

  $: errors = [...errorsData].sort((a, b) =>
    sortOrder === 'desc'
      ? b.code.localeCompare(a.code)
      : a.code.localeCompare(b.code)
  );

  function toggleSortOrder(): void {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
  }
</script>

<Accordion title="Errors" isOpen={true}>
  <button on:click={toggleSortOrder} title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}>
    <Icon icon={sortOrder === 'asc' ? 'ph:sort-ascending' : 'ph:sort-descending'} width="18" height="18" />
  </button>
  <div class="errors">
    {#each errors as { code, message, params }}
      <div class="errors__item">
        <span class="errors__item-name">{params.join(', ')}</span>
        <ErrorBadge error={{ code, message }} />
      </div>
    {/each}
  </div>
</Accordion>

<style>
  .errors {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.6rem 0;
  }

  .errors__item {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.6rem;
    background: hsl(0, 0%, 10%);
    border-radius: 0.5rem;
  }
  
  .errors__item-name {
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
