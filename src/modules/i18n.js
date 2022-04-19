import { createI18n } from 'vue-i18n';

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
export const SUPPORTED_LOCALES = ['en', 'ua', 'ru'];
export const getMessages = {
  en: () => import('../../locales/en.yml'),
  ua: () => import('../../locales/ua.yml'),
  ru: () => import('../../locales/ru.yml'),
};

export const install = ({ app, lang, messages }) => {
  const i18n = createI18n({
    legacy: false,
    locale: lang,
    messages,
  });

  app.use(i18n);
};

export function extractLocaleFromPath(path = '') {
  const [_, maybeLocale] = path.split('/');
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : 'en';
}
