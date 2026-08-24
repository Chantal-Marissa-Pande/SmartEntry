import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = [
  'admin-dashboard', 'analytics', 'dashboard', 'incidents', 'intelligence',
  'organizations', 'reports', 'settings', 'user-management', 'visitors'
];

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(pages.map((page) => [
          page,
          resolve(import.meta.dirname, `src/pages/${page}.html`)
        ]))
      }
    }
  },
  server: {
    port: 5173
  }
});
