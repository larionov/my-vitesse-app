import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import generateSitemap from 'vite-ssg-sitemap';
import Layouts from 'vite-plugin-vue-layouts';
import Markdown from 'vite-plugin-md';
import { VitePWA } from 'vite-plugin-pwa';
import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Inspect from 'vite-plugin-inspect';
import Prism from 'markdown-it-prism';
import LinkAttributes from 'markdown-it-link-attributes';
import Unocss from 'unocss/vite';

const markdownWrapperClasses = 'prose prose-sm m-auto text-left';

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],

      onRoutesGenerated(routes) {
        //console.log({ routes });
        const newRoutes = routes.flatMap((route) => {
          return [
            ...['en', 'ru', 'ua'].map((lang) => {
              return {
                ...route,
                name: `${route.name}-${lang}`,
                path: `/${lang}${route.path}`,
                meta: { ...route.meta, lang },
              };
            }),
            route,
          ];
        });
        console.log({ newRoutes });
        return newRoutes;
      },
      // extendRoute(route, parent) {
      //   // if (route.path === '/') {
      //   //   // Index is unauthenticated.
      //   //   return route;
      //   // }
      //   console.log(route, parent);
      //   // Augment the route with meta that indicates that the route requires authentication.
      //   return {
      //     ...route,
      //     meta: { lang: 'en' },
      //   };
      // },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-md
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism);
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        });
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect/ to see the inspector
    Inspect(),
  ],

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',

    // includedRoutes(paths, routes) {
    //   // use original route records
    //   return routes.flatMap((route) => {
    //     return route.name === 'Blog'
    //       ? myBlogSlugs.map((slug) => `/blog/${slug}`)
    //       : route.path;
    //   });
    // },
    onFinished() {
      generateSitemap();
    },
  },
});
