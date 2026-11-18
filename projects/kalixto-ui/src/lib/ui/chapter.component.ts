import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';
import { KxMotionService } from '../motion/motion.service';
import { KxSplitTextDirective } from '../motion/split-text.directive';
import { KxRevealDirective } from '../motion/reveal.directive';

/**
 * Capítulo (Section Reveal): divisor de alto impacto entre grandes áreas do site.
 * Metade com padrão geométrico na cor da área e um círculo que cresce conforme a
 * rolagem (scrub), metade escura com título grande. Adaptado do "title-section"
 * observado na referência; aqui com cores e conteúdo do próprio projeto.
 *   <kx-chapter eyebrow="Serviços" title="…" text="…" tone="accent"><img …></kx-chapter>
 * O conteúdo projetado aparece dentro do círculo (imagem ou ilustração).
 */
@Component({
  selector: 'kx-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxSplitTextDirective, KxRevealDirective],
  host: { class: 'kx-chapter', '[attr.data-tone]': 'tone()' },
  template: `
    <div class="decor" aria-hidden="true">
      <div #circle class="circle"><ng-content /></div>
    </div>
    <div class="content">
      @if (eyebrow()) {
        <span class="eyebrow" kxReveal="fade-in">{{ eyebrow() }}</span>
      }
      <h2 class="title" [kxSplitText]="title()"></h2>
      @if (text()) {
        <p class="text" kxReveal [kxRevealDelay]="250">{{ text() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      --_tone: var(--kx-chapter-tone, var(--kx-color-brand));
      display: grid;
      background: var(--kx-color-surface-inverse);
      color: var(--kx-color-fg-inverse);
      overflow: hidden;
    }
    :host([data-tone='accent']) { --_tone: var(--kx-color-accent); }
    :host([data-tone='deep']) { --_tone: var(--kx-color-brand-strong); }
    @media (min-width: 900px) { :host { grid-template-columns: 1fr 1fr; min-height: min(86vh, 820px); } }
    .decor {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 380px;
      padding: var(--kx-space-6);
      background-color: var(--_tone);
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.12) 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .circle {
      width: min(78%, 560px);
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--kx-color-surface-inverse);
      overflow: hidden;
      display: grid;
      place-items: center;
      transform: scale(var(--kx-chapter-scale, 1));
      will-change: transform;
    }
    .circle ::ng-deep img, .circle ::ng-deep svg { width: 100%; height: 100%; object-fit: cover; }
    .content {
      display: grid;
      align-content: center;
      gap: var(--kx-space-3);
      padding: clamp(40px, 7vw, 112px) var(--kx-gutter);
    }
    .eyebrow { font: 500 var(--kx-text-xs) / 1.3 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; color: var(--kx-color-accent); }
    .title { font-size: var(--kx-text-display); line-height: 0.95; max-width: 12ch; }
    .text { font-size: var(--kx-text-lg); color: var(--kx-color-fg-inverse-muted); max-width: 44ch; }
  `,
})
export class KxChapterComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly text = input('');
  readonly tone = input<'brand' | 'accent' | 'deep'>('brand');

  private readonly circle = viewChild.required<ElementRef<HTMLElement>>('circle');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const motion = inject(KxMotionService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off = motion.onScrollFrame(() => {
        const el = this.circle().nativeElement;
        if (motion.reducedMotion()) {
          el.style.setProperty('--kx-chapter-scale', '1');
          return;
        }
        const r = this.host.nativeElement.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 quando o topo da seção entra pela base; 1 quando o centro chega ao meio da tela
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height * 0.5)));
        el.style.setProperty('--kx-chapter-scale', (0.55 + 0.45 * p).toFixed(3));
      });
      destroyRef.onDestroy(off);
    });
  }
}
