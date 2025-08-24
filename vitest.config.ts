import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['client/lib/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
});
