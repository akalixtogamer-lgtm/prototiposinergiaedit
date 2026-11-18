import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxIconComponent } from '../icons/icon.component';

/**
 * Card reutilizável: imagem, ícone, eyebrow, título, descrição e CTA.
 * Quando há link, o cartão inteiro é clicável (link "esticado" no título,
 * um único ponto de foco, sem links aninhados). Hover: Card Lift + Image Zoom
 * + Overlay Reveal na imagem + seta do CTA desliza.
 *
 *   <kx-card icon="film" title="Cinema" text="…" [link]="'/cinema'" cta="Ver mais" />
 */
@Component({
  selector: 'kx-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxIconComponent],
  host: {
    class: 'kx-card',
    '[class.is-linked]': '!!link() || !!href()',
    '[class.kx-card--feature]': "variant() === 'feature'",
    '[class.kx-card--plain]': "variant() === 'plain'",
    '[class.kx-card--cover]': "variant() === 'cover'",
  },
  template: `
    @if (image()) {
      <figure class="media kx-hover-zoom">
        <img [src]="image()" [alt]="imageAlt()" loading="lazy" decoding="async" width="800" height="500" />
        <span class="overlay" aria-hidden="true"></span>
      </figure>
    }
    <div class="body">
      @if (icon()) {
        <span class="icon" aria-hidden="true"><kx-icon [name]="icon()" [size]="26" /></span>
      }
      @if (eyebrow()) {
        <span class="kx-eyebrow">{{ eyebrow() }}</span>
      }
      <h3 class="title">
        @if (link()) {
          <a class="stretched" [routerLink]="link()" [fragment]="fragment()">{{ title() }}</a>
        } @else if (href()) {
          <a class="stretched" [href]="href()" target="_blank" rel="noopener">{{ title() }}</a>
        } @else {
          {{ title() }}
        }
      </h3>
      @if (text()) {
        <p class="text">{{ text() }}</p>
      }
      <ng-content />
      @if (cta() && (link() || href())) {
        <span class="cta" aria-hidden="true">{{ cta() }} <kx-icon name="arrow-right" [size]="18" class="arrow" /></span>
      }
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      border: var(--kx-border);
      border-radius: var(--kx-radius-lg);
      background: var(--kx-color-surface);
      overflow: hidden;
      transition:
        transform var(--kx-duration-base) var(--kx-ease-out),
        box-shadow var(--kx-duration-base) var(--kx-ease-out),
        border-color var(--kx-duration-base);
    }
    :host(.kx-card--plain) { border-color: transparent; background: transparent; }
    :host(.kx-card--feature) { background: var(--kx-color-bg-subtle); }
    @media (hover: hover) {
      :host(.is-linked:hover) { transform: translateY(-6px); box-shadow: var(--kx-shadow-md); border-color: var(--kx-color-line-strong); }
      :host(.is-linked:hover) .overlay { opacity: 1; }
      :host(.is-linked:hover) .arrow { transform: translateX(6px); }
      :host(.is-linked:hover) .icon { background: var(--kx-color-brand); color: var(--kx-color-fg-inverse); }
    }
    :host(:focus-within) { box-shadow: 0 0 0 3px var(--kx-color-focus); }
    :host(:focus-within) a.stretched:focus-visible { outline: none; }
    .media { position: relative; margin: 0; aspect-ratio: 16 / 10; background: var(--kx-color-bg-subtle); }
    .media img { width: 100%; height: 100%; object-fit: cover; }
    .overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--kx-color-brand-deep) 55%, transparent));
      opacity: 0; transition: opacity var(--kx-duration-base) var(--kx-ease-standard);
    }
    .body { display: flex; flex-direction: column; gap: var(--kx-space-1); padding: var(--kx-space-3); flex: 1; }
    :host(.kx-card--plain) .body { padding-inline: 0; }
    .icon {
      display: grid; place-items: center;
      width: 52px; height: 52px; margin-bottom: var(--kx-space-1);
      border-radius: var(--kx-radius-md);
      background: var(--kx-color-brand-soft); color: var(--kx-color-brand);
      transition: background-color var(--kx-duration-base), color var(--kx-duration-base);
    }
    .title { font-size: var(--kx-text-h3); }
    .title a { color: inherit; text-decoration: none; }
    .stretched::after { content: ''; position: absolute; inset: 0; z-index: 1; }
    .text { color: var(--kx-color-fg-muted); }
    .cta {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: auto; padding-top: var(--kx-space-2);
      font-weight: 600; color: var(--kx-color-brand);
    }
    .arrow { transition: transform var(--kx-duration-base) var(--kx-ease-out); }

    /* ---- Variante cover: imagem ocupa o card, texto sobre degradê escuro ---- */
    :host(.kx-card--cover) { min-height: 440px; justify-content: flex-end; border-color: transparent; background: var(--kx-color-surface-inverse); color: #fff; }
    :host(.kx-card--cover) .media { position: absolute; inset: 0; aspect-ratio: auto; }
    :host(.kx-card--cover) .overlay {
      opacity: 1;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(3, 8, 4, 0.3) 35%, rgba(3, 8, 4, 0.9) 62%, rgba(3, 8, 4, 0.97) 100%);
    }
    :host(.kx-card--cover) .body { position: relative; z-index: 1; flex: 0; padding: var(--kx-space-4) var(--kx-space-3) var(--kx-space-3); }
    :host(.kx-card--cover) .text { color: rgba(255, 255, 255, 0.82); }
    :host(.kx-card--cover) .icon { background: rgba(255, 255, 255, 0.12); color: #fff; backdrop-filter: blur(6px); }
    :host(.kx-card--cover) .cta { color: var(--kx-color-accent); }
    @media (hover: hover) {
      :host(.kx-card--cover.is-linked:hover) .icon { background: var(--kx-color-accent); color: var(--kx-color-on-accent); }
    }
  `,
})
export class KxCardComponent {
  readonly title = input.required<string>();
  readonly text = input('');
  readonly eyebrow = input('');
  readonly icon = input('');
  readonly image = input('');
  readonly imageAlt = input('');
  /** Rota interna (string de URL). */
  readonly link = input<string | null>(null);
  readonly fragment = input<string | undefined>(undefined);
  /** Link externo. */
  readonly href = input<string | null>(null);
  readonly cta = input('');
  /** cover = imagem de fundo com degradê e texto embaixo (referência Datatainment). */
  readonly variant = input<'default' | 'feature' | 'plain' | 'cover'>('default');
}
