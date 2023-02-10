import { defineConfig } from 'vite';
import { resolve } from 'path';
import FastGlob from 'fast-glob';

import viteTwigPlugin from 'vite-plugin-twig';
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper';

import postcssEach from 'postcss-each';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssPxToRem from 'postcss-pxtorem';
import postcssMinmax from 'postcss-media-minmax';
import postcssNestedAncestors from 'postcss-nested-ancestors';
import postcssNested from 'postcss-nested';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomSelectors from 'postcss-custom-selectors';
import autoprefixer from 'autoprefixer';

import globalData from './src/data.json';

export default defineConfig({
    root: './src',
    appType: 'mpa',
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
    },
    plugins: [
        viteTwigPlugin({
            globals: {
                global: globalData
            },
            settings: {
                'twig options': {
                    namespaces: { root: './src/templates/' },
                },
            },
        }),
        ViteSvgSpriteWrapper(),
    ],
    css: {
        postcss: {
            plugins: [
                postcssImport,
                postcssMixins,
                postcssEach,
                postcssCustomSelectors,
                postcssNestedAncestors,
                postcssNested,
                postcssCustomMedia,
                postcssMinmax,
                autoprefixer,
                postcssPxToRem,
            ],
        },
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: FastGlob.sync(['./src/*.html']).map((entry) =>
                resolve(__dirname, entry)
            ),
            output: {
                chunkFileNames: 'scripts/[name].js',
                entryFileNames: 'scripts/[name].js',
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/css$/.test(extType)) {
                        extType = 'styles';
                    } else if (
                        /png$|jpe?g$|svg$|gif$|tiff$|bmp$|ico$/.test(extType)
                    ) {
                        extType = 'images';
                    } else if (/ttf$|woff$|woff2$/.test(extType)) {
                        extType = 'fonts';
                    } else {
                        extType = 'misc';
                    }
                    return `${extType}/[name][extname]`;
                },
            },
        },
    },
});
