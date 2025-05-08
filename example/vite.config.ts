/* eslint-disable import/no-extraneous-dependencies */

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: '/src/lib',
      '@api': '/src/lib/api',
      '@components': '/src/lib/components',
      '@services': '/src/lib/services',
      '@utils': '/src/lib/utils',
    },
  },
});
