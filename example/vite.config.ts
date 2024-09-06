import { svelte } from '@sveltejs/vite-plugin-svelte';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
});
