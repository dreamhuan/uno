import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import importToCDN from 'vite-plugin-cdn-import'
import createExternal from 'vite-plugin-external'

console.log(process.env)

export default ({ mode }: any) => {
  return defineConfig({
    plugins: [
      // 配置react 线上的兼容模式，使用经典模式
      react(),
      // 配置cdn地址
      importToCDN({
        modules: [
          {
            name: 'react', // 包名
            var: 'React', // 为环境提供的全局变量
            path: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
          },
          {
            name: 'react-dom',
            var: 'ReactDOM',
            path: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
          },
        ],
      }),
      // 这个插件也是帮助vite忽略react，react-dom打包到最终的产物
      mode === 'production' &&
        createExternal({
          interop: 'auto', // 这个声明很重要
          externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        }),
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
    ].filter(Boolean),
    build: {
      outDir: './server/public',
    },
  })
}
