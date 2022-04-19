import { ViteSSG } from 'vite-ssg';
import { setupLayouts } from 'virtual:generated-layouts';
import App from './App.vue';

import generatedRoutes from '~pages';
import { createHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';

import '@unocss/reset/tailwind.css';
import './styles/main.css';
import 'uno.css';

const routes = setupLayouts(generatedRoutes);
import { useRouter, useRoute } from 'vue-router';

import {
  extractLocaleFromPath,
  getMessages,
  install as i18nInstall,
} from './modules/i18n.js';
import { install as piniaInstall } from './modules/pinia.js';

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,

    // Use Router's base for i18n routes
    base: import.meta.env.BASE_URL, // ({ url }) => {
    //},
  },
  async (ctx) => {
    // install all modules under `modules/`
    // Object.values(import.meta.globEager('./modules/*.js')).forEach((i) =>
    //   i.install?.(ctx),
    // );
    piniaInstall(ctx);

    const { app, url, router, isClient, initialState } = ctx;

    // console.log({ ctx }, router.currentRoute.value); //locale === DEFAULT_LOCALE ? '/' : `/${locale}/`);
    // // const locale = extractLocaleFromPath(url.pathname);

    //console.log({ ctx }, router.currentRoute.value);

    router.beforeResolve(async (to) => {
      const lang = extractLocaleFromPath(to.href);
      const messages = { [lang]: (await getMessages[lang]()).default };
      ctx.lang = lang;
      console.log({ to }, to.meta, ctx, lang, messages);
      i18nInstall({ app: ctx.app, lang, messages });
    });
    const head = createHead();
    app.use(head);
  },
);
