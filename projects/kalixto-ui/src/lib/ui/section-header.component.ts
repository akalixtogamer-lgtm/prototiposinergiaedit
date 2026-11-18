import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KxRevealDirective } from '../motion/reveal.directive';
import { KxSplitTextDirective } from '../motion/split-text.directive';

/**
 * Cabeçalho de seção: eyebrow + título (Text Reveal) + texto de apoio.
 *   <kx-section-header eyebrow="Serviços" title="…" lead="…" />
 * level: nível do heading (2 por padrão; use 1 só no topo da página).
 */
@Component({
  selector: 'kx-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxRevealDirective, KxSplitTextDirective],
  host: { class: 'kx-section-header', '[class.is-center]': "align() === 'center'", '[class.is-inverse]': 'inverse()' },
  template: `
    @if (eyebrow()) {
      <span class="kx-eyebrow" kxReveal="fade-in">{{ eyebrow() }}</span>
    }
    @switch (level()) {
      @case (1) { <h1 class="title" [kxSplitText]="title()"></h1> }
      @case (3) { <h3 class="title" [kxSplitText]="title()"></h3> }
      @default { <h2 class="title" [kxSplitText]="title()"></h2> }
    }
    @if (lead()) {
      <p class="kx-lead" kxReveal [kxRevealDelay]="150">{{ lead() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host { display: grid; gap: var(--kx-space-2); max-width: 760px; margin-bottom: var(--kx-space-6); }
    :host(.is-center) { margin-inline: auto; text-align: center; justify-items: center; }
    :host(.is-inverse) .kx-eyebrow { color: var(--kx-color-accent); }
    :host(.is-inverse) .kx-lead { color: var(--kx-color-fg-inverse-muted); }
  `,
})
export class KxSectionHeaderComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly lead = input('');
  readonly level = input<1 | 2 | 3>(2);
  readonly align = input<'start' | 'center'>('start');
  readonly inverse = input(false);
}
