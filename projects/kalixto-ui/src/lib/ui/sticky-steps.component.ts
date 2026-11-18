import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { KxMotionService } from '../motion/motion.service';

export interface KxStep {
  label: string;
  title: string;
  text: string;
  /** Linhas extras (ex.: objetivos, como funciona). */
  bullets?: string[];
}

/**
 * Sticky Content: coluna da esquerda fica presa enquanto as etapas da direita
 * passam; a etapa no centro da tela fica em destaque e o indicador acompanha.
 * Adaptação do "pinning" observado na referência, sem sequestrar a rolagem
 * (a página continua rolando normalmente, melhor para leitura e acessibilidade).
 * Em telas estreitas vira uma lista simples.
 */
@Component({
  selector: 'kx-sticky-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'kx-sticky-steps' },
  template: `
    <div class="aside">
      <div class="aside-inner">
        <ng-content />
        <ol class="progress" aria-hidden="true">
          @for (s of steps(); track s.title; let i = $index) {
            <li [class.is-active]="active() === i"><span>{{ s.label }}</span></li>
          }
        </ol>
      </div>
    </div>
    <ol class="steps" role="list">
      @for (s of steps(); track s.title; let i = $index) {
        <li class="step" [class.is-active]="active() === i" [attr.data-i]="i">
          <span class="label">{{ s.label }}</span>
          <h3 class="title">{{ s.title }}</h3>
          <p class="text">{{ s.text }}</p>
          @if (s.bullets?.length) {
            <ul class="bullets">
              @for (b of s.bullets; track b) { <li>{{ b }}</li> }
            </ul>
          }
        </li>
      }
    </ol>
  `,
  styles: `
    :host { display: grid; gap: var(--kx-space-6); }
    @media (min-width: 1024px) { :host { grid-template-columns: 5fr 7fr; gap: var(--kx-space-10); } }
    .aside-inner { display: grid; gap: var(--kx-space-3); }
    @media (min-width: 1024px) { .aside-inner { position: sticky; top: calc(var(--kx-header-h) + var(--kx-space-6)); } }
    .progress { display: none; margin: 0; padding: 0; list-style: none; gap: var(--kx-space-1); }
    @media (min-width: 1024px) { .progress { display: grid; } }
    .progress li {
      display: flex; align-items: center; gap: var(--kx-space-2);
      font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase;
      color: var(--kx-color-fg-subtle);
      transition: color var(--kx-duration-base);
    }
    .progress li::before {
      content: ''; width: 24px; height: 2px; background: currentColor;
      transition: width var(--kx-duration-base) var(--kx-ease-out);
    }
    .progress li.is-active { color: var(--kx-color-brand); }
    .progress li.is-active::before { width: 56px; background: var(--kx-color-accent); }
    .steps { margin: 0; padding: 0; display: grid; gap: var(--kx-space-3); }
    .step {
      display: grid; gap: var(--kx-space-1);
      padding: var(--kx-space-4);
      border: var(--kx-border); border-radius: var(--kx-radius-lg);
      background: var(--kx-color-surface);
      transition: border-color var(--kx-duration-base), box-shadow var(--kx-duration-base), transform var(--kx-duration-base) var(--kx-ease-out);
    }
    @media (min-width: 1024px) {
      .step { min-height: 46vh; align-content: center; background: transparent; border-style: dashed; }
      .step.is-active { background: var(--kx-color-surface); border-style: solid; border-color: var(--kx-color-brand); box-shadow: var(--kx-shadow-md); transform: translateX(-8px); }
    }
    .label { font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; color: var(--kx-color-brand); }
    .title { font-size: var(--kx-text-h3); }
    .text { color: var(--kx-color-fg-muted); }
    .bullets { margin: var(--kx-space-1) 0 0; padding-left: 1.2em; color: var(--kx-color-fg-muted); display: grid; gap: 4px; }
  `,
})
export class KxStickyStepsComponent {
  readonly steps = input.required<KxStep[]>();
  protected readonly active = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const motion = inject(KxMotionService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off = motion.onScrollFrame(() => {
        const items = this.host.nativeElement.querySelectorAll<HTMLElement>('.step');
        const mid = window.innerHeight * 0.5;
        let best = 0;
        let bestDist = Infinity;
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        if (best !== this.active()) this.active.set(best);
      });
      destroyRef.onDestroy(off);
    });
  }
}
