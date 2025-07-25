import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts', './src/test/mockMuiIcons.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 2,
      },
    },
  }
})
