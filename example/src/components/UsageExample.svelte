<script lang="ts">
  import Highlight from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';
  import bash from 'svelte-highlight/languages/bash';

  const installing = `# with npm package manager
npm install @mix-visit/light

# with yarn package manager
yarn add @mix-visit/light

# with pnpm package manager
pnpm add @mix-visit/light
`;

  const using = `import { MixVisit } from '@mix-visit/light';

const mixvisit = new MixVisit();
await mixvisit.load();

console.log('load time in miliseconds: ', mixvisit.loadTime);
console.log('fingerprint hash: ', mixvisit.fingerprintHash);
console.log('get all client data: ', mixvisit.get());
console.log('get platform: ', mixvisit.get('platform'));
`;
</script>

<details open>
  <summary><h3>Usage example</h3></summary>

  <p>At first install <strong><i>MixvisitJS</i></strong> package</p>
  <Highlight language={bash} code={installing} />

  <p>After you can use it</p>
  <Highlight language={typescript} code={using} />
</details>
