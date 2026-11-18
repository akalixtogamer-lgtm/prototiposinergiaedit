import { Directive, ElementRef, OnDestroy, OnInit, inject, input, numberAttribute, afterNextRender } from '@angular/core';
import { KX_MOTION, KxRevealEffect } from './motion.config';
import { KxMotionService } from './motion.service';

/**
 * Reveal on Scroll.
 *   <h2 kxReveal>…</h2>                       fade-up (padrão)
 *   <img kxReveal="image" [kxRevealDelay]="200">
 * Gatilho: entra no viewport (KX_MOTION.threshold). Estado inicial/final em _motion.scss.
 */
@Directive({
  selector: '[kxReveal]',
  host: { class: 'kx-reveal' },
})
export class KxRevealDirective implements OnInit, OnDestroy {
  readonly kxReveal = input<KxRevealEffect | ''>('fade-up');
  readonly kxRevealDelay = input(0, { transform: numberAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(KxMotionService);
  private readonly config = inject(KX_MOTION);

  ngOnInit(): void {
    const effect = (this.kxReveal() || 'fade-up') as KxRevealEffect;
    const preset = this.config.effects[effect] ?? this.config.effects['fade-up'];
    const host = this.el.nativeElement;
    host.classList.add(`kx-reveal--${effect}`);
    host.style.setProperty('--kx-r-duration', `${preset.duration}ms`);
    host.style.setProperty('--kx-r-ease', preset.easing);
    if (!host.style.getPropertyValue('--kx-r-delay')) {
      host.style.setProperty('--kx-r-delay', `${preset.delay + this.kxRevealDelay()}ms`);
    }
    this.motion.observe(host, (entry) => {
      if (entry.isIntersecting) {
        host.classList.add('is-visible');
        if (this.config.once) this.motion.unobserve(host);
      } else if (!this.config.once) {
        host.classList.remove('is-visible');
      }
    });
  }

  ngOnDestroy(): void {
    this.motion.unobserve(this.el.nativeElement);
  }
}

/**
 * Stagger Animation: distribui atrasos crescentes entre os filhos com [kxReveal].
 *   <ul kxStagger> <li kxReveal>…</li> … </ul>
 */
@Directive({ selector: '[kxStagger]' })
export class KxStaggerDirective {
  /** Intervalo em ms (padrão: KX_MOTION.stagger). */
  readonly kxStagger = input<number | ''>('');
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly config = inject(KX_MOTION);

  constructor() {
    afterNextRender(() => {
      const step = typeof this.kxStagger() === 'number' ? (this.kxStagger() as number) : this.config.stagger;
      const items = this.el.nativeElement.querySelectorAll<HTMLElement>('.kx-reveal, .kx-split-text');
      items.forEach((item, i) => item.style.setProperty('--kx-r-delay', `${i * step}ms`));
    });
  }
}
