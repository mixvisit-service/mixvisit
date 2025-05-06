<script lang="ts">
  import { onMount } from 'svelte';
  import highlightStyle from 'svelte-highlight/styles/circus';

  import { AboutInfo, Badges, GoToTop, NoJSInfo } from '@components/ui';
  import { About, ClientData, Durations, Errors, UsageExample, Visitor } from '@components/sections';

  import { getMixVisitClientData } from '@services/mixvisit';
  import { getLocationData } from '@api/location';
  import { TDef } from '@utils/common';

  import type { GroupedError, VisitorData } from '$lib/types';

  let jsEnabled = false;
  let status = 'not loaded';
  let loadTime = '';
  let clientData = '';
  let visitorData: VisitorData | null = null;
  let durationsData: { name: string; duration: number }[] = [];
  let errorsData: GroupedError[] = [];

  const releaseYear = 2024;
  const currentYear = new Date().getFullYear();
  const productYears = currentYear === releaseYear ? currentYear.toString() : `${releaseYear}-${currentYear}`;

  onMount(main);

  async function main(): Promise<void> {
    try {
      jsEnabled = true;
      const mixvisitClientData = await getMixVisitClientData();
      const { data, fingerprintHash, loadTime: loadTimeRes } = mixvisitClientData || {};
      const location = await getLocationData();

      if (
        !(fingerprintHash && location && TDef.isObject(data) && TDef.isObject(location) && TDef.isNumber(loadTimeRes))
      ) {
        throw new Error('Something wrong with fingerprint or location data');
      }

      status = 'loaded';

      visitorData = {
        visitorID: fingerprintHash,
        location,
      };

      if (data && TDef.isObject(data)) {
        clientData = JSON.stringify(data, null, 2);

        const durationsMap = Object.entries(data).reduce<Record<number, string>>((acc, [key, { duration }]) => {
          if (TDef.isNumber(duration)) {
            acc[duration] = acc[duration] ? `${acc[duration]}, ${key}` : key;
          }
          return acc;
        }, {});

        durationsData = Object.entries(durationsMap).map(([duration, name]) => ({
          name,
          duration: Number(duration),
        }));

        errorsData = Object.entries(data)
          .filter(([_, data]) => 'error' in data)
          .reduce((acc: GroupedError[], [name, { error }]) => {
            const existing = acc.find((e) => e.code === error.code && e.message === error.message);

            if (existing) {
              existing.params.push(name);
            } else {
              acc.push({
                code: error.code,
                message: error.message,
                params: [name],
              });
            }

            return acc;
          }, []);
      }

      if (loadTimeRes && TDef.isNumber(loadTimeRes)) {
        loadTime = loadTimeRes.toString();
      }
    } catch (err) {
      status = 'error';
      console.error(err);
    }
  }
</script>

<svelte:head>
  {@html highlightStyle}
</svelte:head>

<main>
  <h1 class="lib-title">MixVisitJS</h1>
  <h2>JS Fingerprint to identify & track devices</h2>
  <Badges />

  <noscript>
    <section>
      <AboutInfo />
    </section>
    <section>
      <NoJSInfo />
    </section>
  </noscript>

  {#if jsEnabled}
    {#if status === 'loaded'}
      <About />
      <Visitor {visitorData} />
      <UsageExample />
      <ClientData {clientData} {loadTime} />
      {#if durationsData.length}
        <Durations {durationsData} />
      {/if}
      {#if errorsData.length}
        <Errors {errorsData} />
      {/if}
      <GoToTop />
    {:else if status === 'not loaded'}
      <p>Loading ...</p>
    {:else}
      <p>Something wrong</p>
    {/if}
  {/if}
</main>

<footer>
  <p>
    Copyright &copy; {productYears} MixVisitJS. All rights reserved.
    <a href="https://opensource.org/licenses/MIT" target="_blank">MIT - License</a>
  </p>
</footer>

<style>
  h1,
  h2,
  footer {
    text-align: center;
    word-wrap: break-word;
  }

  @media screen and (max-width: 690px) {
    .lib-title {
      font-size: 3.3rem;
    }

    h2 {
      font-size: 1.3rem;
    }
  }
</style>
