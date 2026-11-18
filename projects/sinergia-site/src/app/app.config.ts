import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideKalixtoUi } from 'kalixto-ui';
import { routes } from './app.routes';
import { PAGES } from './core/config/pages';
import { NAV, FOOTER } from './core/config/navigation';
import { SITE } from './core/config/site.config';
import { I18N } from './core/i18n/i18n.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Anchor Scroll: rola até #âncora e restaura a posição ao voltar
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      // Transição entre páginas (View Transitions API; ignorada onde não há suporte)
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideKalixtoUi({
      config: {
        siteName: SITE.siteName,
        siteUrl: SITE.siteUrl,
        nav: NAV,
        footer: FOOTER,
        whatsapp: { phone: SITE.whatsapp.phone, messageKey: 'whatsapp.message' },
      },
      i18n: I18N,
      pages: PAGES,
      // Ajustes de ritmo do motion podem ser feitos aqui, ex.: motion: { stagger: 120 }
    }),
    // Âncoras param abaixo do header fixo
    provideAppInitializer(() => inject(ViewportScroller).setOffset([0, 88])),
  ],
};
