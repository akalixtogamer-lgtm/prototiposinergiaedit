import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { KxButtonDirective, KxI18nService, KxPathPipe, KxTranslatePipe } from 'kalixto-ui';

/** 404, qualquer endereço que não está no mapa de páginas. */
@Component({
  selector: 'sn-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxButtonDirective, KxPathPipe, KxTranslatePipe],
  template: `
    <section class="kx-section" style="padding-top: calc(var(--sn-header-offset) + var(--kx-section-y))">
      <div class="kx-container kx-container--narrow box">
        <span class="kx-eyebrow">{{ 'notFound.eyebrow' | kxT }}</span>
        <h1>{{ 'notFound.title' | kxT }}</h1>
        <p class="kx-lead">{{ 'notFound.text' | kxT }}</p>
        <div><a kxButton="primary" [routerLink]="'home' | kxPath">{{ 'notFound.cta' | kxT }}</a></div>
      </div>
    </section>
  `,
  styles: `.box { display: grid; gap: var(--kx-space-2); padding-block: var(--kx-space-10); }`,
})
export class NotFoundPage {
  constructor() {
    const i18n = inject(KxI18nService);
    const title = inject(Title);
    // depois do SEO padrão (que roda no fim da navegação)
    setTimeout(() => title.setTitle(`${i18n.t('seo.notFound.title')} · Sinergia Research & Intelligence`));
  }
}
