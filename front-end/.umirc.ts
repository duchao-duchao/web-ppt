import { defineConfig } from "umi";
import ThemeColorReplacer from 'webpack-theme-color-replacer';

export default defineConfig({
  routes: [
    { path: "/", component: "Editor" },
    { path: "/preview", component: "preview" },
  ],
  npmClient: 'pnpm',
  // 根据环境设置路径
  // base: '/web-ppt/',
  // publicPath: '/web-ppt/',
  // 使用 hash 路由，避免需要服务器端路由支持
  // history: { type: 'hash' },
  // vite: {
  //   cacheDir: 'node_modules/.bin/.vite',
  // }
  // 根据环境设置base路径
  // base: process.env.NODE_ENV === 'production' ? '/web-ppt/' : '/',
  // chainWebpack(memo) {
  //   memo.plugin('webpack-theme-color-replacer').use(ThemeColorReplacer, [
  //     {
  //       fileName: 'theme/dark.css',
  //       matchColors: ['#1890ff'],
  //       changeSelector(selector: any) {
  //         return `[data-theme="dark"] ${selector}`;
  //       },
  //     },
  //   ]);
  // },
});