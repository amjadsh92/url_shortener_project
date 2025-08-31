import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html', // the report file
      template: 'treemap',    // or 'sunburst', 'network'
      gzipSize: true,
      brotliSize: true,
      open: true,             // auto-open after build
    }),
  ],
})
