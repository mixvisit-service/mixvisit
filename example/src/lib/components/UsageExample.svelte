<script lang="ts">
  import Highlight from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';
  import bash from 'svelte-highlight/languages/bash';
  import ToggleIcon from './ToggleIcon.svelte';

  let isOpen = true;
  
  const installing = `# with npm package manager
npm install @mix-visit/lite

# with yarn package manager
yarn add @mix-visit/lite

# with pnpm package manager
pnpm add @mix-visit/lite
`;

  const using = `import { MixVisit } from '@mix-visit/lite';

const mixvisit = new MixVisit();
await mixvisit.load();

console.log('load time in miliseconds: ', mixvisit.loadTime);
console.log('fingerprint hash: ', mixvisit.fingerprintHash);
console.log('get all client data: ', mixvisit.get());
console.log('get platform: ', mixvisit.get('platform'));
`;
</script>

<details bind:open={isOpen}>
  <summary>
    <ToggleIcon {isOpen} size={32} />
    <h3>Usage example</h3>
  </summary>

  <p>At first install <strong><i>MixvisitJS</i></strong> package</p>
  <Highlight language={bash} code={installing} />

  <p>After you can use it</p>
  <Highlight language={typescript} code={using} />
</details>
