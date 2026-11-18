import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KxRevealDirective } from '../motion/reveal.directive';
import { KxSplitTextDirective } from '../motion/split-text.directive';

/**
 * Faixa de chamada para ação (CTA) entre seções.
 *   <kx-cta-band title="…" text="…"> <a kxButton="accent">…</a> </kx-cta-band>
 */
@Component({
  selector: 'kx-cta-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxRevealDirective, KxSplitTextDirective],
  template: `
    <div class="kx-container inner">
      <div class="copy">
        <h2 [kxSplitText]="title()"></h2>
        @if (text()) { <p kxReveal [kxRevealDelay]="150">{{ text() }}</p> }
      </div>
      <div class="actions" kxReveal="fade-in" [kxRevealDelay]="250"><ng-content /></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--kx-color-brand-deep);
      color: var(--kx-color-fg-inverse);
      background-image: radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--kx-color-accent) 22%, transparent), transparent 45%);
    }
    .inner {
      display: grid; gap: var(--kx-space-4); align-items: center;
      padding-block: clamp(56px, 7vw, 96px);
    }
    @media (min-width: 900px) { .inner { grid-template-columns: 1.4fr auto; } }
    h2 { max-width: 20ch; }
    p { margin-top: var(--kx-space-2); color: var(--kx-color-fg-inverse-muted); max-width: 56ch; font-size: var(--kx-text-lg); }
    .actions { display: flex; flex-wrap: wrap; gap: var(--kx-space-2); }
  `,
})
export class KxCtaBandComponent {
  readonly title = input.required<string>();
  readonly text = input('');
}
