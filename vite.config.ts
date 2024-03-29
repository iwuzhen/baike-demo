import path from 'path'
import { defineConfig } from 'vite'
import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-vue-markdown'
// import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'
import Inspector from 'vite-plugin-vue-inspector'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'
import VueMacros from 'unplugin-vue-macros/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { cdn } from 'vite-plugin-cdn2'
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    Preview(),
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: true,
        }),
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-vue-markdown
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: 'prose prose-sm m-auto text-left',
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Shiki, {
          theme: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        })
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa
    // VitePWA({
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         // urlPattern: /\/api\//,
    //         urlPattern: /seahz/,
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           fetchOptions: {
    //             mode: 'cors', // Enable CORS
    //             credentials: 'include', // Send cookies with the request
    //           },
    //           plugins: [
    //             {
    //               // 使用 copyResponse 插件，将跨域请求的响应复制到目标响应中
    //               async cacheWillUpdate({ response }) {
    //                 const res = await copyResponse({
    //                   response,
    //                   // 设置 fetch() 方法的 mode 为 'cors'，允许跨域请求
    //                   fetchOptions: { mode: 'cors' },
    //                 })
    //                 return res || response
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     ],
    //   },
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg'],
    //   manifest: {
    //     name: 'metapedia',
    //     short_name: 'metapedia',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/metapedia-black.svg',
    //         sizes: '512x512',
    //         type: 'image/svg',
    //         purpose: 'any maskable',
    //       },
    //     ],
    //   },
    // }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect/ to see the inspector
    Inspect(),

    // https://github.com/webfansplz/vite-plugin-vue-inspector
    Inspector({
      toggleButtonVisibility: 'never',
    }),
    cdn({
      isProduction: true,
      modules: [
        // {
        //   name: 'mermaid',
        //   global: 'mermaid',
        //   spare: [
        //     // dirty fix
        //     'https://cdn.staticfile.org/mermaid/10.0.2/mermaid.esm.min.mjs',
        //     // 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js',
        //   ],
        // },
        // {
        //   name: 'zhconvertor',
        //   global: 'zhconvertor',
        //   spare: [
        //     'https://cdn.jsdelivr.net/npm/zhconvertor@2.2.4/dist/index.min.js',
        //   ],
        // },
        {
          name: 'axios',
          global: 'axios',
          spare: [
            'https://cdn.staticfile.org/axios/1.3.4/axios.min.js',
          ],
        },
      ],
      preset: false,
      logInfo: 'info',
    }),
    // visualizer(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished() { generateSitemap() },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/, 'element-plus'],
    // noExternal: ['workbox-window', /vue-i18n/],
  },
})
