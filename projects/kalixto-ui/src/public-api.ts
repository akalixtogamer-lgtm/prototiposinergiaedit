/*
 * kalixto-ui · API pública
 * Biblioteca portátil de experiência: tokens, motion, i18n, SEO, layout e UI.
 * Não contém nada específico de um cliente, tudo entra por provideKalixtoUi().
 */

// Configuração
export * from './lib/config/kx-config';

// Motion
export * from './lib/motion/motion.config';
export * from './lib/motion/motion.service';
export * from './lib/motion/reveal.directive';
export * from './lib/motion/split-text.directive';
export * from './lib/motion/parallax.directive';
export * from './lib/motion/count-up.directive';
export * from './lib/motion/scroll-progress.component';

// i18n e SEO
export * from './lib/i18n/i18n.models';
export * from './lib/i18n/i18n.service';
export * from './lib/i18n/i18n.pipes';
export * from './lib/i18n/localized-routes';
export * from './lib/i18n/lang-switch.component';
export * from './lib/seo/seo.service';

// Layout
export * from './lib/layout/header.component';
export * from './lib/layout/footer.component';
export * from './lib/layout/whatsapp-fab.component';

// UI
export * from './lib/icons/icon.component';
export * from './lib/ui/button.directive';
export * from './lib/ui/card.component';
export * from './lib/ui/section-header.component';
export * from './lib/ui/accordion.component';
export * from './lib/ui/chapter.component';
export * from './lib/ui/sticky-steps.component';
export * from './lib/ui/section-nav.component';
export * from './lib/ui/cta-band.component';
export * from './lib/ui/service-card.component';
export * from './lib/ui/service-rail.component';
export * from './lib/ui/video-bg.component';
