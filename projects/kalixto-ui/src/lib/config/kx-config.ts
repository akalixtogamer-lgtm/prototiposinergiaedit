import {
  EnvironmentProviders,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { KX_MOTION, KX_MOTION_DEFAULTS, KxMotionConfig, KxRevealEffect, KxMotionPreset } from '../motion/motion.config';
import { KX_I18N, KX_PAGES, KxI18nConfig, KxPage } from '../i18n/i18n.models';
import { KxSeoService } from '../seo/seo.service';

/** Item de navegação. label é uma chave do dicionário. */
export interface KxNavItem {
  /** Chave do dicionário para o texto. */
  label: string;
  /** id de página (KX_PAGES), preferível a URL fixa. */
  page?: string;
  /** Âncora dentro da página (sem #). */
  fragment?: string;
  /** Link externo (abre em nova aba). */
  href?: string;
  /** Chave de descrição curta (usada no dropdown). */
  description?: string;
  children?: KxNavItem[];
}

export interface KxFooterColumn {
  title: string;
  links: KxNavItem[];
}

export interface KxWhatsAppConfig {
  /** Número no formato internacional, só dígitos (ex.: 5521999999999). Vazio = botão oculto. */
  phone: string;
  /** Chave do dicionário com a mensagem inicial. */
  messageKey: string;
}

export interface KxConfig {
  siteName: string;
  /** URL pública (canonical/hreflang). Vazio = usa location.origin. */
  siteUrl: string;
  nav: KxNavItem[];
  footer: KxFooterColumn[];
  whatsapp: KxWhatsAppConfig;
}

export const KX_CONFIG = new InjectionToken<KxConfig>('KX_CONFIG');

export interface KxProvideOptions {
  config: KxConfig;
  i18n: KxI18nConfig;
  pages: KxPage[];
  /** Ajustes no motion (mescla com os padrões). */
  motion?: Partial<Omit<KxMotionConfig, 'effects'>> & { effects?: Partial<Record<KxRevealEffect, Partial<KxMotionPreset>>> };
}

/**
 * Ponto único de configuração da biblioteca:
 *   providers: [provideKalixtoUi({ config, i18n, pages, motion })]
 */
export function provideKalixtoUi(opts: KxProvideOptions): EnvironmentProviders {
  const effects = { ...KX_MOTION_DEFAULTS.effects };
  for (const [k, v] of Object.entries(opts.motion?.effects ?? {})) {
    effects[k as KxRevealEffect] = { ...effects[k as KxRevealEffect], ...v };
  }
  const motion: KxMotionConfig = { ...KX_MOTION_DEFAULTS, ...opts.motion, effects };
  return makeEnvironmentProviders([
    { provide: KX_CONFIG, useValue: opts.config },
    { provide: KX_I18N, useValue: opts.i18n },
    { provide: KX_PAGES, useValue: opts.pages },
    { provide: KX_MOTION, useValue: motion },
    provideEnvironmentInitializer(() => inject(KxSeoService).init()),
  ]);
}
