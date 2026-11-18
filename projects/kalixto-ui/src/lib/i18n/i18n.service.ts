import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { KX_I18N, KX_PAGES, KxLanguage } from './i18n.models';

/**
 * Internacionalização em tempo de execução, baseada em signals.
 * - O idioma vem da URL (/en/... → inglês; sem prefixo → idioma padrão),
 *   então cada idioma tem URL própria (bom para SEO e para compartilhar link).
 * - t('a.b.c', { nome: 'X' }) devolve string; get('a.b') devolve listas/objetos.
 * - Chave ausente: devolve a própria chave e avisa no console em dev.
 */
@Injectable({ providedIn: 'root' })
export class KxI18nService {
  private readonly cfg = inject(KX_I18N);
  private readonly pages = inject(KX_PAGES, { optional: true }) ?? [];
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  readonly languages = this.cfg.languages;
  private readonly _lang = signal(this.cfg.defaultLang);
  /** Idioma atual (signal). */
  readonly lang = this._lang.asReadonly();
  readonly language = computed<KxLanguage>(
    () => this.languages.find((l) => l.code === this._lang()) ?? this.languages[0],
  );
  /** id da página atual (data.kxPage da rota). */
  readonly currentPage = signal<string | null>(null);
  private readonly dict = computed(() => this.cfg.dictionaries[this._lang()] ?? {});

  constructor() {
    this.syncFromUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncFromUrl(e.urlAfterRedirects));
  }

  private syncFromUrl(url: string): void {
    const first = url.split(/[?#]/)[0].split('/').filter(Boolean)[0] ?? '';
    const byPrefix = this.languages.find((l) => l.prefix && l.prefix === first);
    const lang = byPrefix?.code ?? this.cfg.defaultLang;
    this._lang.set(lang);
    const html = this.doc.documentElement;
    html.lang = this.language().htmlLang;
    if (this.cfg.storageKey) {
      try { localStorage.setItem(this.cfg.storageKey, lang); } catch { /* storage indisponível */ }
    }
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    this.currentPage.set((route.data?.['kxPage'] as string) ?? null);
  }

  /** Valor bruto (string, lista ou objeto). */
  get<T = unknown>(key: string, lang = this._lang()): T {
    const source = lang === this._lang() ? this.dict() : this.cfg.dictionaries[lang] ?? {};
    const value = key.split('.').reduce<unknown>(
      (acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
      source,
    );
    if (value === undefined && typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.warn(`[kx-i18n] chave ausente em "${lang}": ${key}`);
    }
    return (value ?? key) as T;
  }

  /** Texto traduzido com interpolação {{param}}. */
  t(key: string, params?: Record<string, string | number>): string {
    let text = this.get<unknown>(key);
    if (typeof text !== 'string') return key;
    if (params) {
      text = Object.entries(params).reduce(
        (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
        text as string,
      );
    }
    return text as string;
  }

  /** URL de uma página no idioma pedido (padrão: atual). Ex.: path('contact') → '/contato'. */
  path(pageId: string, lang = this._lang()): string {
    const page = this.pages.find((p) => p.id === pageId);
    const language = this.languages.find((l) => l.code === lang) ?? this.languages[0];
    const slug = page?.slugs[lang] ?? page?.slugs[this.cfg.defaultLang] ?? '';
    const parts = [language.prefix, slug].filter(Boolean).join('/');
    return '/' + parts;
  }

  /** Troca o idioma mantendo a mesma página e a âncora atual. */
  switchTo(lang: string): void {
    if (lang === this._lang()) return;
    const fragment = this.router.parseUrl(this.router.url).fragment ?? undefined;
    const target = this.currentPage() ? this.path(this.currentPage()!, lang) : this.path('home', lang);
    this.router.navigateByUrl(fragment ? `${target}#${fragment}` : target);
  }
}

declare const ngDevMode: boolean | undefined;
