// vite.config.ts
import path from "path";
import { defineConfig } from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite@4.0.4/node_modules/vite/dist/node/index.js";
import Preview from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-vue-component-preview@0.3.4_vite@4.0.4/node_modules/vite-plugin-vue-component-preview/out/index.js";
import Vue from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@4.0.4+vue@3.2.45/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-pages@0.28.0_vite@4.0.4/node_modules/vite-plugin-pages/dist/index.mjs";
import generateSitemap from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-ssg-sitemap@0.4.3/node_modules/vite-ssg-sitemap/dist/index.js";
import Layouts from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-vue-layouts@0.7.0_oh6kquo6biweymmreht6aj34oy/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/unplugin-vue-components@0.22.12_vue@3.2.45/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/unplugin-auto-import@0.12.1_@vueuse+core@9.11.0/node_modules/unplugin-auto-import/dist/vite.js";
import Markdown from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-vue-markdown@0.22.2_vite@4.0.4/node_modules/vite-plugin-vue-markdown/dist/index.mjs";
import { VitePWA } from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-pwa@0.14.1_vite@4.0.4/node_modules/vite-plugin-pwa/dist/index.mjs";
import VueI18n from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/@intlify+unplugin-vue-i18n@0.8.1_vue-i18n@9.2.2/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import Inspect from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-inspect@0.7.14_vite@4.0.4/node_modules/vite-plugin-inspect/dist/index.mjs";
import Inspector from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/vite-plugin-vue-inspector@3.2.1_vite@4.0.4/node_modules/vite-plugin-vue-inspector/dist/index.mjs";
import LinkAttributes from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/markdown-it-link-attributes@4.0.1/node_modules/markdown-it-link-attributes/index.js";
import Unocss from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/unocss@0.48.4_vite@4.0.4/node_modules/unocss/dist/vite.mjs";
import Shiki from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/markdown-it-shiki@0.7.2/node_modules/markdown-it-shiki/dist/index.mjs";
import VueMacros from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/unplugin-vue-macros@1.4.2_httr7wqcry5mq7lnplxmfdl6ve/node_modules/unplugin-vue-macros/dist/vite.mjs";
import { ElementPlusResolver } from "file:///mnt/c/Users/ider/workspace/baike-demo/node_modules/.pnpm/unplugin-vue-components@0.22.12_vue@3.2.45/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "/mnt/c/Users/ider/workspace/baike-demo";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
    }
  },
  plugins: [
    Preview(),
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
          reactivityTransform: true
        })
      }
    }),
    Pages({
      extensions: ["vue", "md"]
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core"
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/stores"
      ],
      vueTemplate: true,
      resolvers: [ElementPlusResolver({ importStyle: "css", ssr: true })]
    }),
    Components({
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts",
      resolvers: [ElementPlusResolver({ ssr: true })]
    }),
    Unocss(),
    Markdown({
      wrapperClasses: "prose prose-sm m-auto text-left",
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            light: "vitesse-light",
            dark: "vitesse-dark"
          }
        });
        md.use(LinkAttributes, {
          matcher: (link) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        });
      }
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "safari-pinned-tab.svg"],
      manifest: {
        name: "Vitesse",
        short_name: "Vitesse",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__vite_injected_original_dirname, "locales/**")]
    }),
    Inspect(),
    Inspector({
      toggleButtonVisibility: "never"
    })
  ],
  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
    deps: {
      inline: ["@vue", "@vueuse", "vue-demi"]
    }
  },
  ssgOptions: {
    script: "async",
    formatting: "minify",
    onFinished() {
      generateSitemap();
    }
  },
  ssr: {
    noExternal: ["workbox-window", /vue-i18n/]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvaWRlci93b3Jrc3BhY2UvYmFpa2UtZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL2lkZXIvd29ya3NwYWNlL2JhaWtlLWRlbW8vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL2lkZXIvd29ya3NwYWNlL2JhaWtlLWRlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBQcmV2aWV3IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1jb21wb25lbnQtcHJldmlldydcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xuaW1wb3J0IGdlbmVyYXRlU2l0ZW1hcCBmcm9tICd2aXRlLXNzZy1zaXRlbWFwJ1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBNYXJrZG93biBmcm9tICd2aXRlLXBsdWdpbi12dWUtbWFya2Rvd24nXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuaW1wb3J0IFZ1ZUkxOG4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1pbnNwZWN0b3InXG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSAnbWFya2Rvd24taXQtbGluay1hdHRyaWJ1dGVzJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBTaGlraSBmcm9tICdtYXJrZG93bi1pdC1zaGlraSdcbmltcG9ydCBWdWVNYWNyb3MgZnJvbSAndW5wbHVnaW4tdnVlLW1hY3Jvcy92aXRlJ1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfi8nOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2AsXG4gICAgfSxcbiAgfSxcblxuICBwbHVnaW5zOiBbXG4gICAgUHJldmlldygpLFxuXG4gICAgVnVlTWFjcm9zKHtcbiAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgdnVlOiBWdWUoe1xuICAgICAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC5tZCQvXSxcbiAgICAgICAgICByZWFjdGl2aXR5VHJhbnNmb3JtOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGFubm9lcnUvdml0ZS1wbHVnaW4tcGFnZXNcbiAgICBQYWdlcyh7XG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0pvaG5DYW1waW9uSnIvdml0ZS1wbHVnaW4tdnVlLWxheW91dHNcbiAgICBMYXlvdXRzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgJ3Z1ZS9tYWNyb3MnLFxuICAgICAgICAnQHZ1ZXVzZS9oZWFkJyxcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgJ3NyYy9jb21wb3NhYmxlcycsXG4gICAgICAgICdzcmMvc3RvcmVzJyxcbiAgICAgIF0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ2NzcycsIHNzcjogdHJ1ZSB9KV0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIC8vIGFsbG93IGF1dG8gbG9hZCBtYXJrZG93biBjb21wb25lbnRzIHVuZGVyIGAuL3NyYy9jb21wb25lbnRzL2BcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXG4gICAgICAvLyBhbGxvdyBhdXRvIGltcG9ydCBhbmQgcmVnaXN0ZXIgY29tcG9uZW50cyB1c2VkIGluIG1hcmtkb3duXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgc3NyOiB0cnVlIH0pXSxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bm9jc3NcbiAgICAvLyBzZWUgdW5vY3NzLmNvbmZpZy50cyBmb3IgY29uZmlnXG4gICAgVW5vY3NzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tdnVlLW1hcmtkb3duXG4gICAgLy8gRG9uJ3QgbmVlZCB0aGlzPyBUcnkgdml0ZXNzZS1saXRlOiBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZXNzZS1saXRlXG4gICAgTWFya2Rvd24oe1xuICAgICAgd3JhcHBlckNsYXNzZXM6ICdwcm9zZSBwcm9zZS1zbSBtLWF1dG8gdGV4dC1sZWZ0JyxcbiAgICAgIGhlYWRFbmFibGVkOiB0cnVlLFxuICAgICAgbWFya2Rvd25JdFNldHVwKG1kKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vcHJpc21qcy5jb20vXG4gICAgICAgIG1kLnVzZShTaGlraSwge1xuICAgICAgICAgIHRoZW1lOiB7XG4gICAgICAgICAgICBsaWdodDogJ3ZpdGVzc2UtbGlnaHQnLFxuICAgICAgICAgICAgZGFyazogJ3ZpdGVzc2UtZGFyaycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgbWF0Y2hlcjogKGxpbms6IHN0cmluZykgPT4gL15odHRwcz86XFwvXFwvLy50ZXN0KGxpbmspLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgcmVsOiAnbm9vcGVuZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLXB3YVxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uc3ZnJywgJ3NhZmFyaS1waW5uZWQtdGFiLnN2ZyddLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1ZpdGVzc2UnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnVml0ZXNzZScsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvcHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9wd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvdHJlZS9tYWluL3BhY2thZ2VzL3VucGx1Z2luLXZ1ZS1pMThuXG4gICAgVnVlSTE4bih7XG4gICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgIGNvbXBvc2l0aW9uT25seTogdHJ1ZSxcbiAgICAgIGZ1bGxJbnN0YWxsOiB0cnVlLFxuICAgICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdsb2NhbGVzLyoqJyldLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGUtcGx1Z2luLWluc3BlY3RcbiAgICAvLyBWaXNpdCBodHRwOi8vbG9jYWxob3N0OjMzMzMvX19pbnNwZWN0LyB0byBzZWUgdGhlIGluc3BlY3RvclxuICAgIEluc3BlY3QoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJmYW5zcGx6L3ZpdGUtcGx1Z2luLXZ1ZS1pbnNwZWN0b3JcbiAgICBJbnNwZWN0b3Ioe1xuICAgICAgdG9nZ2xlQnV0dG9uVmlzaWJpbGl0eTogJ25ldmVyJyxcbiAgICB9KSxcbiAgXSxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZXN0LWRldi92aXRlc3RcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsndGVzdC8qKi8qLnRlc3QudHMnXSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBkZXBzOiB7XG4gICAgICBpbmxpbmU6IFsnQHZ1ZScsICdAdnVldXNlJywgJ3Z1ZS1kZW1pJ10sXG4gICAgfSxcbiAgfSxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1zc2dcbiAgc3NnT3B0aW9uczoge1xuICAgIHNjcmlwdDogJ2FzeW5jJyxcbiAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcbiAgICBvbkZpbmlzaGVkKCkgeyBnZW5lcmF0ZVNpdGVtYXAoKSB9LFxuICB9LFxuXG4gIHNzcjoge1xuICAgIC8vIFRPRE86IHdvcmthcm91bmQgdW50aWwgdGhleSBzdXBwb3J0IG5hdGl2ZSBFU01cbiAgICAvLyBub0V4dGVybmFsOiBbJ3dvcmtib3gtd2luZG93JywgL3Z1ZS1pMThuLywgJ2VsZW1lbnQtcGx1cyddLFxuICAgIG5vRXh0ZXJuYWw6IFsnd29ya2JveC13aW5kb3cnLCAvdnVlLWkxOG4vXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9TLE9BQU8sVUFBVTtBQUNyVCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxnQkFBZ0I7QUFDdkIs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
