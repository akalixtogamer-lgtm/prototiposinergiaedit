import { KxI18nConfig } from 'kalixto-ui';
import { PT } from './pt';
import { EN } from './en';

/**
 * Idiomas do site. Português na raiz (/), inglês em /en.
 * Para adicionar um idioma: crie o dicionário (mesma estrutura de pt.ts),
 * registre aqui e preencha os slugs em core/config/pages.ts.
 */
export const I18N: KxI18nConfig = {
  defaultLang: 'pt',
  storageKey: 'sinergia.lang',
  languages: [
    { code: 'pt', label: 'Português', short: 'PT', htmlLang: 'pt-BR', prefix: '', locale: 'pt-BR' },
    { code: 'en', label: 'English', short: 'EN', htmlLang: 'en', prefix: 'en', locale: 'en-US' },
  ],
  dictionaries: { pt: PT, en: EN },
};
