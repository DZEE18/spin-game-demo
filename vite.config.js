import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures correct paths for GitHub Pages
  server: {
    port: 3000, // Development server port
  },
  build: {
    outDir: 'dist', // Output directory for build
    rollupOptions: {
      output: {
        format: 'es', // ES module format
      },
    },
  },
});
