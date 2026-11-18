import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { KxMotionService } from './motion.service';

/**
 * Scroll Progress: barra fina no topo que mostra quanto da página já foi lida.
 * Decorativa (aria-hidden): a posição de leitura já é comunicada pela barra de rolagem.
 */
@Component({
  selector: 'kx-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span #bar class="bar"></span>`,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host { position: fixed; inset: 0 0 auto 0; height: 3px; z-index: calc(var(--kx-z-header) + 1); pointer-events: none; }
    .bar { display: block; height: 100%; background: var(--kx-color-accent); transform-origin: 0 50%; transform: scaleX(0); }
  `,
})
export class KxScrollProgressComponent {
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');

  constructor() {
    const motion = inject(KxMotionService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off = motion.onScrollFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        this.bar().nativeElement.style.transform = `scaleX(${p.toFixed(4)})`;
      });
      destroyRef.onDestroy(off);
    });
  }
}
