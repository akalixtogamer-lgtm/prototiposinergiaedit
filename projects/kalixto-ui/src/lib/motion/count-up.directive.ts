import { Directive, ElementRef, OnDestroy, OnInit, inject, input, numberAttribute } from '@angular/core';
import { KxMotionService } from './motion.service';
import { KX_MOTION } from './motion.config';

/**
 * Counter Animation, use SOMENTE com indicadores reais e confirmados.
 *   <span [kxCountUp]="1986" [kxCountFrom]="1900"></span>
 * O valor final já está no DOM desde o início (SEO, leitores de tela e sem JS);
 * a contagem é só visual e respeita prefers-reduced-motion.
 */
@Directive({
  selector: '[kxCountUp]',
  host: { class: 'kx-tnum' },
})
export class KxCountUpDirective implements OnInit, OnDestroy {
  readonly kxCountUp = input.required({ transform: numberAttribute });
  readonly kxCountFrom = input(0, { transform: numberAttribute });
  readonly kxCountLocale = input('pt-BR');
  /** Não formatar com separador de milhar (ex.: anos). */
  readonly kxCountPlain = input(false);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(KxMotionService);
  private readonly config = inject(KX_MOTION);
  private raf = 0;

  private format(n: number): string {
    return this.kxCountPlain() ? String(Math.round(n)) : Math.round(n).toLocaleString(this.kxCountLocale());
  }

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.textContent = this.format(this.kxCountUp());
    host.setAttribute('aria-label', host.textContent);
    this.motion.observe(host, (e) => {
      if (!e.isIntersecting) return;
      this.motion.unobserve(host);
      if (this.motion.reducedMotion()) return;
      const from = this.kxCountFrom();
      const to = this.kxCountUp();
      const start = performance.now();
      const dur = this.config.counterDuration;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        host.textContent = this.format(from + (to - from) * eased);
        if (t < 1) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.motion.unobserve(this.el.nativeElement);
  }
}
