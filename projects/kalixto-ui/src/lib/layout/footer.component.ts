import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KX_CONFIG } from '../config/kx-config';
import { KxPathPipe, KxTranslatePipe } from '../i18n/i18n.pipes';
import { KxRevealDirective } from '../motion/reveal.directive';

/**
 * Footer em colunas (vindas de KX_CONFIG.footer) com assinatura gigante no fim.
 * Slots: [kxFooterBrand] (logo + texto), [kxFooterAside] (contato/CTA),
 *        [kxFooterLegal] (copyright, links legais, acesso administrativo discreto).
 */
@Component({
  selector: 'kx-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxTranslatePipe, KxPathPipe, KxRevealDirective],
  host: { class: 'kx-footer', role: 'contentinfo' },
  template: `
    <div class="kx-container top">
      <div class="brand"><ng-content select="[kxFooterBrand]" /></div>
      <div class="cols">
        @for (col of cfg.footer; track col.title) {
          <nav class="col" [attr.aria-label]="col.title | kxT">
            <h2 class="col-title">{{ col.title | kxT }}</h2>
            <ul role="list">
              @for (link of col.links; track link.label) {
                <li>
                  @if (link.href) {
                    <a [href]="link.href" target="_blank" rel="noopener">{{ link.label | kxT }}<span class="kx-sr-only"> ({{ 'a11y.newTab' | kxT }})</span></a>
                  } @else {
                    <a [routerLink]="link.page! | kxPath" [fragment]="link.fragment">{{ link.label | kxT }}</a>
                  }
                </li>
              }
            </ul>
          </nav>
        }
      </div>
      <div class="aside"><ng-content select="[kxFooterAside]" /></div>
    </div>
    @if (wordmark()) {
      <div class="kx-container mark-wrap" aria-hidden="true">
        <p class="mark" kxReveal="image">{{ wordmark() }}</p>
      </div>
    }
    <div class="legal">
      <div class="kx-container legal-inner"><ng-content select="[kxFooterLegal]" /></div>
    </div>
  `,
  styles: `
    :host {
      --kx-footer-bg: var(--kx-color-brand-deep);
      --kx-footer-fg: var(--kx-color-fg-inverse);
      --kx-footer-fg-muted: var(--kx-color-fg-inverse-muted);
      display: block;
      background: var(--kx-footer-bg);
      color: var(--kx-footer-fg);
      overflow: hidden;
    }
    .top {
      display: grid;
      gap: var(--kx-space-6);
      padding-block: var(--kx-space-10) var(--kx-space-6);
    }
    @media (min-width: 1024px) {
      .top { grid-template-columns: minmax(240px, 1.1fr) 2fr; }
      .aside { grid-column: 1 / -1; }
    }
    .cols { display: grid; gap: var(--kx-space-4); grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    .col-title {
      margin-bottom: var(--kx-space-2);
      font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono);
      letter-spacing: var(--kx-tracking-label);
      text-transform: uppercase;
      color: var(--kx-color-accent);
    }
    ul { margin: 0; display: grid; gap: 4px; }
    a {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      color: var(--kx-footer-fg);
      text-decoration: none;
      background: linear-gradient(currentColor, currentColor) 0 calc(100% - 6px) / 0 1px no-repeat;
      transition: background-size var(--kx-duration-base) var(--kx-ease-out), color var(--kx-duration-fast);
    }
    a:hover { color: var(--kx-color-accent); background-size: 100% 1px; }
    .mark-wrap { padding-bottom: var(--kx-space-3); }
    .mark {
      font: 600 clamp(4rem, 17vw, 15rem) / 0.82 var(--kx-font-display);
      letter-spacing: -0.04em;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.28);
      white-space: nowrap;
      user-select: none;
    }
    .legal { border-top: 1px solid rgba(255, 255, 255, 0.12); }
    .legal-inner {
      display: flex;
      flex-wrap: wrap;
      gap: var(--kx-space-1) var(--kx-space-3);
      justify-content: space-between;
      align-items: center;
      padding-block: var(--kx-space-2);
      font-size: var(--kx-text-sm);
      color: var(--kx-footer-fg-muted);
    }
  `,
})
export class KxFooterComponent {
  protected readonly cfg = inject(KX_CONFIG);
  /** Assinatura gigante decorativa (ex.: nome da marca). Vazio = não exibe. */
  readonly wordmark = input('');
}
