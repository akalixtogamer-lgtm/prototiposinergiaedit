import { Routes } from '@angular/router';
import { KxI18nConfig, KxPage } from './i18n.models';

/**
 * Gera as rotas de todas as páginas em todos os idiomas.
 * Idioma padrão na raiz (/servicos), demais com prefixo (/en/services).
 * Cada rota leva data.kxPage e data.kxLang, que o i18n e o SEO usam.
 */
export function kxLocalizedRoutes(pages: KxPage[], i18n: KxI18nConfig, extra: Routes = []): Routes {
  const routes: Routes = [];
  for (const lang of i18n.languages) {
    for (const page of pages) {
      const slug = page.slugs[lang.code] ?? page.slugs[i18n.defaultLang];
      if (slug === undefined) continue;
      const path = [lang.prefix, slug].filter(Boolean).join('/');
      routes.push({
        path,
        pathMatch: 'full',
        loadComponent: page.loadComponent,
        data: { kxPage: page.id, kxLang: lang.code },
      });
    }
  }
  return [...routes, ...extra];
}
