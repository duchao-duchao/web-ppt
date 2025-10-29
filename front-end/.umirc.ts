import { defineConfig } from "umi";
import ThemeColorReplacer from 'webpack-theme-color-replacer';

export default defineConfig({
  routes: [
    { path: "/", component: "Editor" },
    { path: "/preview", component: "preview" },
  ],
  npmClient: 'pnpm',
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
