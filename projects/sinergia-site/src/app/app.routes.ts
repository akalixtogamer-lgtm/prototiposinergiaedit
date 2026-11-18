import { Routes } from '@angular/router';
import { kxLocalizedRoutes } from 'kalixto-ui';
import { PAGES } from './core/config/pages';
import { I18N } from './core/i18n/i18n.config';

/**
 * Rotas geradas a partir do mapa de páginas (PT na raiz, EN em /en),
 * todas com lazy loading. Qualquer outro endereço cai na página 404.
 */
export const routes: Routes = kxLocalizedRoutes(PAGES, I18N, [
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
    data: { kxPage: null },
  },
]);
