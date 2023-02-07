import { defineConfig } from 'vite';
import { resolve } from 'path';
import FastGlob from 'fast-glob';

import handlebarsPlugin from 'vite-plugin-handlebars';
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper';

import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNesting from 'postcss-nesting';
import postcssIncludeMedia from 'postcss-include-media';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';

/*
* TODO: Vercel deploy
* */

export default defineConfig({
  root: './src',
  appType: 'mpa',
  server: {
    watch: {
      usePolling: true
    },
    host: true
  },
  plugins: [
    handlebarsPlugin({
      partialDirectory: resolve(__dirname, './src/partials')
    }),
    ViteSvgSpriteWrapper()
  ],
  css: {
    postcss: {
      plugins: [
        postcssImport,
        postcssMixins,
        postcssNesting,
        postcssCustomSelectors,
        postcssIncludeMedia({
          ruleName: 'mq',
          breakpoints: {
            xs: '0',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',
          }
        }),
        autoprefixer,
        postcssPxToRem
      ]
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: FastGlob.sync(['./src/*.html']).map((entry) => resolve(__dirname, entry)),
      output: {
        chunkFileNames: 'scripts/[name].js',
        entryFileNames: 'scripts/[name].js',
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/css$/.test(extType)) {
            extType = 'styles';
          } else if (/png$|jpe?g$|svg$|gif$|tiff$|bmp$|ico$/.test(extType)) {
            extType = 'images';
          } else if (/ttf$|woff$|woff2$/.test(extType)) {
            extType = 'fonts';
          } else {
            extType = 'misc';
          }
          return `${extType}/[name][extname]`;
        }
      }
    }
  }
});
