import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxIconComponent } from '../icons/icon.component';

/**
 * Card de serviço com "aba" recortada (referência da cliente: card Addifico).
 * Estado normal: superfície escura, ícone de traço, seta ↗ no canto, título embaixo.
 * Estado ativo (hover, foco ou [active]): o card preenche com a cor da marca, o canto
 * superior direito ganha um recorte com cantos arredondados (a seta fica dentro dele)
 * e a descrição aparece. Em telas de toque a descrição fica sempre visível.
 *
 * O recorte usa a cor do fundo da seção: defina --kx-notch-bg no contêiner
 * (kx-service-rail já faz isso).
 *
 *   <kx-service-card icon="podium" title="…" text="…" [link]="'/servicos'" />
 */
@Component({
  selector: 'kx-service-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxIconComponent],
  host: { class: 'kx-service-card', '[class.is-active]': 'active()', '[class.is-linked]': '!!link() || !!href()' },
  template: `
    <span class="notch" aria-hidden="true"></span>
    <span class="arrow" aria-hidden="true"><kx-icon name="arrow-up-right" [size]="20" [stroke]="1.6" /></span>
    @if (icon()) {
      <span class="icon" aria-hidden="true"><kx-icon [name]="icon()" [size]="52" [stroke]="1.3" /></span>
    }
    <div class="body">
      @if (eyebrow()) { <span class="eyebrow">{{ eyebrow() }}</span> }
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
        <div class="desc"><p>{{ text() }}</p></div>
      }
    </div>
  `,
  styles: `
    :host {
      --_r: 18px;              /* raio do card e dos cantos do recorte */
      --_n: 58px;              /* tamanho do recorte */
      --_bg: var(--kx-svc-bg, var(--kx-color-surface));
      --_fg: var(--kx-svc-fg, var(--kx-color-fg));
      --_active-bg: var(--kx-svc-active-bg, var(--kx-color-brand));
      --_active-fg: var(--kx-svc-active-fg, var(--kx-color-on-action));
      --_notch: var(--kx-notch-bg, var(--kx-color-bg));

      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--kx-space-4);
      min-height: 300px;
      padding: var(--kx-space-3);
      border-radius: var(--_r);
      background: var(--_bg);
      color: var(--_fg);
      border: 1px solid var(--kx-color-line);
      transition:
        background-color var(--kx-duration-base) var(--kx-ease-standard),
        color var(--kx-duration-base) var(--kx-ease-standard),
        border-color var(--kx-duration-base);
    }

    .icon { color: var(--kx-color-brand); transition: color var(--kx-duration-base), transform var(--kx-duration-slow) var(--kx-ease-out); }
    .arrow {
      position: absolute; top: 16px; right: 16px; z-index: 2;
      display: grid; place-items: center; width: 26px; height: 26px;
      color: var(--kx-color-fg-subtle);
      transition: color var(--kx-duration-base), transform var(--kx-duration-base) var(--kx-ease-out);
    }

    .body { display: grid; gap: var(--kx-space-1); }
    .eyebrow { font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; opacity: 0.75; }
    .title { font: 600 clamp(1.2rem, 1rem + 0.5vw, 1.45rem) / 1.2 var(--kx-font-body); letter-spacing: -0.01em; }
    .title a { color: inherit; text-decoration: none; }
    .stretched::after { content: ''; position: absolute; inset: 0; z-index: 3; border-radius: var(--_r); }
    .desc {
      display: grid; grid-template-rows: 0fr; opacity: 0;
      transition: grid-template-rows var(--kx-duration-base) var(--kx-ease-in-out), opacity var(--kx-duration-base);
    }
    .desc p { overflow: hidden; font-size: var(--kx-text-sm); line-height: 1.5; opacity: 0.85; }

    /* ---- Recorte (aba) no canto superior direito ---- */
    .notch {
      position: absolute; top: -1px; right: -1px; z-index: 1;
      width: var(--_n); height: var(--_n);
      background: var(--_notch);
      border-bottom-left-radius: var(--_r);
      transform: scale(0); transform-origin: 100% 0;
      transition: transform var(--kx-duration-base) var(--kx-ease-out);
    }
    /* cantos convexos onde o recorte encontra a borda de cima e a borda direita */
    .notch::before, .notch::after {
      content: ''; position: absolute; width: var(--_r); height: var(--_r);
      background: radial-gradient(circle at 0 100%, transparent calc(var(--_r) - 0.5px), var(--_notch) var(--_r));
    }
    .notch::before { top: 0; right: 100%; }
    .notch::after { top: 100%; right: 0; }

    /* ---- Estado ativo ---- */
    :host(.is-active), :host(.is-linked:hover), :host(:focus-within) {
      background: var(--_active-bg); color: var(--_active-fg); border-color: transparent;
    }
    :host(.is-active) .icon, :host(.is-linked:hover) .icon, :host(:focus-within) .icon { color: var(--_active-fg); transform: translateY(-4px); }
    :host(.is-active) .notch, :host(.is-linked:hover) .notch, :host(:focus-within) .notch { transform: scale(1); }
    :host(.is-active) .arrow, :host(.is-linked:hover) .arrow, :host(:focus-within) .arrow { color: var(--kx-color-fg); transform: translate(2px, -2px); }
    :host(.is-active) .desc, :host(.is-linked:hover) .desc, :host(:focus-within) .desc { grid-template-rows: 1fr; opacity: 1; }
    :host(:focus-within) { outline: 3px solid var(--kx-color-focus); outline-offset: 3px; }
    :host(:focus-within) a.stretched:focus-visible { outline: none; }

    /* Toque: sem hover, a descrição fica sempre visível */
    @media (hover: none) {
      .desc { grid-template-rows: 1fr; opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      :host, .icon, .arrow, .desc, .notch { transition: none; }
    }
  `,
})
export class KxServiceCardComponent {
  readonly title = input.required<string>();
  readonly text = input('');
  readonly eyebrow = input('');
  readonly icon = input('');
  readonly link = input<string | null>(null);
  readonly fragment = input<string | undefined>(undefined);
  readonly href = input<string | null>(null);
  /** Força o estado ativo (destaque fixo). */
  readonly active = input(false);
}
