import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'

console.log(process.env)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  build: {
    outDir: './server/public',
  },
})
