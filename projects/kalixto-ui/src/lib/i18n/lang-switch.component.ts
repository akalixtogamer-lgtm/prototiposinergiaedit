import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { KxI18nService } from './i18n.service';

/**
 * Alternância de idioma (PT | EN). Botões de verdade, com aria-pressed e
 * nome completo do idioma para leitores de tela.
 */
@Component({
  selector: 'kx-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switch" role="group" [attr.aria-label]="label()">
      @for (l of i18n.languages; track l.code) {
        <button
          type="button"
          class="opt"
          [attr.lang]="l.htmlLang"
          [attr.aria-pressed]="i18n.lang() === l.code"
          (click)="i18n.switchTo(l.code)"
        >{{ l.short }}<span class="kx-sr-only"> {{ l.label }}</span></button>
      }
    </div>
  `,
  styles: `
    .switch { display: inline-flex; gap: 2px; padding: 3px; border-radius: var(--kx-radius-pill); border: 1px solid currentColor; border-color: color-mix(in srgb, currentColor 35%, transparent); }
    .opt {
      min-width: 40px; min-height: 32px; padding: 0 10px;
      border: 0; border-radius: var(--kx-radius-pill);
      background: transparent; color: inherit; cursor: pointer;
      font: 500 var(--kx-text-xs) / 1 var(--kx-font-mono); letter-spacing: 0.08em;
      transition: background-color var(--kx-duration-fast) var(--kx-ease-standard), color var(--kx-duration-fast);
    }
    .opt:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
    .opt[aria-pressed='true'] { background: var(--kx-color-accent); color: var(--kx-color-on-accent); }
  `,
})
export class KxLangSwitchComponent {
  protected readonly i18n = inject(KxI18nService);
  /** Rótulo do grupo (traduzido pelo app). */
  readonly label = input('Idioma');
}
