import { DestroyRef, Directive, ElementRef, inject, input, numberAttribute, afterNextRender } from '@angular/core';
import { KxMotionService } from './motion.service';
import { KX_MOTION } from './motion.config';

/**
 * Parallax discreto: desloca o elemento no eixo Y conforme a posição dele no viewport.
 *   <img kxParallax [kxParallaxSpeed]="0.15">
 * speed: fração do deslocamento (0.05 a 0.3 recomendado). Limitado por KX_MOTION.parallaxMax.
 * Desligado em prefers-reduced-motion. Só usa transform (não causa reflow).
 */
@Directive({ selector: '[kxParallax]' })
export class KxParallaxDirective {
  readonly kxParallaxSpeed = input(0.12, { transform: numberAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(KxMotionService);
  private readonly config = inject(KX_MOTION);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const host = this.el.nativeElement;
      host.style.willChange = 'transform';
      const off = this.motion.onScrollFrame(() => {
        if (this.motion.reducedMotion()) {
          host.style.transform = '';
          return;
        }
        const rect = host.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const center = rect.top + rect.height / 2 - vh / 2;
        const max = this.config.parallaxMax;
        const y = Math.max(-max, Math.min(max, -center * this.kxParallaxSpeed()));
        host.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
      destroyRef.onDestroy(off);
    });
  }
}
