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

  const using = `import { FPClient } from '@mix-visit/light';

const fpClient = new FPClient();
await fpClient.load();

console.log('load time in miliseconds: ', fpClient.loadTime);
console.log('fingerprint hash: ', fpClient.fingerprintHash);
console.log('get all client data: ', fpClient.get());
console.log('get platform: ', fpClient.get('platform'));
`;
</script>

<details open>
  <summary><h3>Usage example</h3></summary>

  <p>At first install <strong><i>MixvisitJS</i></strong> package</p>
  <Highlight language={bash} code={installing} />

  <p>After you can use it</p>
  <Highlight language={typescript} code={using} />
</details>
