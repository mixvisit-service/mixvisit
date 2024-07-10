<script lang="ts">
  import { onMount } from 'svelte';
  import { version } from '@mix-visit/web/package.json';

  let packageVersion = '';

  onMount(() => {
    if (version) {
      packageVersion = version;
    }
  });
</script>

<section class="badges">
  <a href="https://github.com/mixvisit-service/mixvisit" target="_blank" rel="noopener noreferrer">
    <img alt="github" src="https://img.shields.io/badge/github-1C2128?logo=github&logoColor=white">
  </a>

  <img alt="npm" src="https://img.shields.io/badge/npm-FFFFFF?logo=npm">

  <a href="http://typescriptlang.org/" target="_blank" rel="noopener noreferrer">
    <img alt="typescript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white">
  </a>

  {#if packageVersion}
    <a href="https://github.com/mixvisit-service/mixvisit/releases" target="_blank" rel="noopener noreferrer">
      <img alt="release" src="https://img.shields.io/badge/release-v{packageVersion}-brightgreen">
    </a>
  {/if}
  
  <a href="https://github.com/mixvisit-service/mixvisit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
    <img alt="license" src="https://img.shields.io/badge/license-MIT-brightgreen">
  </a>
</section>

<style>
  .badges {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0.94rem 0;
  }

  .badges > img, a {
    margin: 0 0.3rem;
  }

  a {
    height: 0;
  }
</style>
