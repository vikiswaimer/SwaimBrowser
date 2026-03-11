import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

function copyPreloadCjs() {
  const outDir = resolve(__dirname, 'dist-electron');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  copyFileSync(resolve(__dirname, 'electron/preload.cjs'), resolve(outDir, 'preload.js'));
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-preload-cjs',
      buildStart() {
        copyPreloadCjs();
      },
    },
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
          copyPreloadCjs();
          options.startup();
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron', 'electron-store'],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'src/shared/index.ts'),
      '@components': resolve(__dirname, 'src/components/index.ts'),
      '@store': resolve(__dirname, 'src/store/index.ts'),
      '@hooks': resolve(__dirname, 'src/hooks/index.ts'),
      '@lib': resolve(__dirname, 'src/lib/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
