import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { KX_I18N, KX_PAGES } from '../i18n/i18n.models';
import { KxI18nService } from '../i18n/i18n.service';
import { KX_CONFIG } from '../config/kx-config';

/**
 * SEO por rota e por idioma: <title>, meta description, robots, canonical,
 * <link rel="alternate" hreflang> para cada idioma e og:locale.
 * Chamado automaticamente por provideKalixtoUi (ver init()).
 */
@Injectable({ providedIn: 'root' })
export class KxSeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly i18n = inject(KxI18nService);
  private readonly i18nCfg = inject(KX_I18N);
  private readonly pages = inject(KX_PAGES, { optional: true }) ?? [];
  private readonly cfg = inject(KX_CONFIG);
  private started = false;

  init(): void {
    if (this.started) return;
    this.started = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => queueMicrotask(() => this.apply()));
  }

  private origin(): string {
    return (this.cfg.siteUrl || this.doc.location?.origin || '').replace(/\/$/, '');
  }

  apply(): void {
    const pageId = this.i18n.currentPage();
    const page = this.pages.find((p) => p.id === pageId);
    const siteName = this.cfg.siteName;
    const pageTitle = page?.titleKey ? this.i18n.t(page.titleKey) : '';
    this.title.setTitle(pageTitle && pageId !== 'home' ? `${pageTitle} · ${siteName}` : pageTitle || siteName);
    const desc = page?.descriptionKey ? this.i18n.t(page.descriptionKey) : '';
    if (desc) {
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:description', content: desc });
    }
    this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:locale', content: this.i18n.language().htmlLang.replace('-', '_') });
    this.meta.updateTag({ name: 'robots', content: page?.noindex || !page ? 'noindex, nofollow' : 'index, follow' });

    // canonical + hreflang
    this.doc.head.querySelectorAll('link[data-kx-seo]').forEach((n) => n.remove());
    if (!page) return;
    const origin = this.origin();
    const add = (rel: string, href: string, hreflang?: string) => {
      const link = this.doc.createElement('link');
      link.rel = rel;
      link.href = href;
      if (hreflang) link.hreflang = hreflang;
      link.setAttribute('data-kx-seo', '');
      this.doc.head.appendChild(link);
    };
    add('canonical', origin + this.i18n.path(page.id));
    for (const l of this.i18nCfg.languages) add('alternate', origin + this.i18n.path(page.id, l.code), l.htmlLang);
    add('alternate', origin + this.i18n.path(page.id, this.i18nCfg.defaultLang), 'x-default');
  }
}
