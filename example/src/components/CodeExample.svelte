<script lang="ts">
  import Highlight from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';
  
  const code = `const fpClient = new FPClient();
await fpClient.load();

console.log('load time in miliseconds: ', fpClient.loadTime);
console.log('fingerprint hash: ', fpClient.fingerprintHash);
console.log('сustomer data obtained: ', fpClient.get());
console.log('get platform: ', fpClient.get('platform'));
`;
</script>

<details open>
  <summary>Example code</summary>
  <Highlight language={typescript} {code} />
</details>
