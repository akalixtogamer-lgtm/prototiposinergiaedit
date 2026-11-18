import { InjectionToken, Type } from '@angular/core';

/** Dicionário de traduções: objeto aninhado (strings, listas e objetos). */
export type KxDictionary = { [key: string]: unknown };

export interface KxLanguage {
  /** Código interno (ex.: 'pt', 'en'). */
  code: string;
  /** Nome no próprio idioma (ex.: 'Português'). */
  label: string;
  /** Rótulo curto do seletor (ex.: 'PT'). */
  short: string;
  /** Valor de <html lang> e hreflang (ex.: 'pt-BR'). */
  htmlLang: string;
  /** Prefixo de URL ('' para o idioma padrão, 'en' → /en/...). */
  prefix: string;
  /** Locale para números e datas (ex.: 'pt-BR'). */
  locale: string;
}

export interface KxI18nConfig {
  languages: KxLanguage[];
  defaultLang: string;
  dictionaries: Record<string, KxDictionary>;
  /** Chave do localStorage para lembrar a escolha (opcional). */
  storageKey?: string;
}

/** Página localizada: um id estável e um slug por idioma. */
export interface KxPage {
  id: string;
  /** slug por idioma, sem barra inicial. '' = raiz. Pode conter subníveis ('servicos/cinema'). */
  slugs: Record<string, string>;
  loadComponent: () => Promise<Type<unknown>>;
  /** Chaves do dicionário para <title> e meta description. */
  titleKey?: string;
  descriptionKey?: string;
  /** Página fora dos buscadores (noindex). */
  noindex?: boolean;
}

export const KX_I18N = new InjectionToken<KxI18nConfig>('KX_I18N');
export const KX_PAGES = new InjectionToken<KxPage[]>('KX_PAGES');
