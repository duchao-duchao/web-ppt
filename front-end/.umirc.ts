import { defineConfig } from "umi";
import ThemeColorReplacer from 'webpack-theme-color-replacer';

export default defineConfig({
  routes: [
    { path: "/", component: "Editor" },
    { path: "/preview", component: "Preview" },
  ],
  npmClient: 'pnpm',
    chainWebpack(memo) {
    memo.externals({
      pptxgenjs: 'pptxgenjs',
    });
  },
});