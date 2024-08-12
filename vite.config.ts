import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

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
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 默认 false, 设置为 true 来禁用压缩
      threshold: 10240, // 只处理大于此大小的资源（单位：字节）。默认值为 0。
      algorithm: 'gzip', // 使用 gzip 压缩
      ext: '.gz', // 输出文件的扩展名
      deleteOriginFile: false,
    }),
  ],
  build: {
    outDir: './server/public',
  },
})
