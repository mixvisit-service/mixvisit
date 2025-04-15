/* eslint-disable import/no-extraneous-dependencies */

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      $lib: '/src/lib',
    },
  },
  plugins: [svelte()],
});
