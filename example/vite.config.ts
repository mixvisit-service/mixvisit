import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '@components': '/src/lib/components',
      '@api': '/src/lib/api',
      '@hooks': '/src/lib/hooks',
      '@services': '/src/lib/services',
      '@utils': '/src/lib/utils',
    },
  },
});
