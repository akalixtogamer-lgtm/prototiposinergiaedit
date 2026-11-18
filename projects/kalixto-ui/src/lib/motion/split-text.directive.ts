import { Directive, ElementRef, OnDestroy, Renderer2, effect, inject, input, numberAttribute } from '@angular/core';
import { KxMotionService } from './motion.service';
import { KX_MOTION } from './motion.config';

/**
 * Text Reveal: cada palavra sobe de dentro de uma máscara, em sequência.
 *   <h1 [kxSplitText]="'home.hero.title' | kxT"></h1>
 * O texto completo fica no aria-label do host; as palavras são aria-hidden,
 * então leitores de tela leem a frase inteira uma vez só.
 * Funciona com troca de idioma: o conteúdo é refeito quando o texto muda.
 */
@Directive({
  selector: '[kxSplitText]',
  host: { class: 'kx-split-text' },
})
export class KxSplitTextDirective implements OnDestroy {
  readonly kxSplitText = input.required<string>();
  readonly kxSplitDelay = input(0, { transform: numberAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly r = inject(Renderer2);
  private readonly motion = inject(KxMotionService);
  private readonly config = inject(KX_MOTION);
  private observed = false;

  constructor() {
    effect(() => this.render(this.kxSplitText() ?? ''));
  }

  private render(text: string): void {
    const host = this.el.nativeElement;
    while (host.firstChild) host.removeChild(host.firstChild);
    this.r.setAttribute(host, 'aria-label', text);
    if (this.kxSplitDelay()) host.style.setProperty('--kx-r-delay', `${this.kxSplitDelay()}ms`);
    const words = text.split(/\s+/).filter(Boolean);
    words.forEach((word, i) => {
      const mask = this.r.createElement('span');
      this.r.addClass(mask, 'kx-split-word-mask');
      this.r.setAttribute(mask, 'aria-hidden', 'true');
      const inner = this.r.createElement('span');
      this.r.addClass(inner, 'kx-split-word');
      inner.style.setProperty('--kx-word-i', String(i));
      this.r.appendChild(inner, this.r.createText(word));
      this.r.appendChild(mask, inner);
      this.r.appendChild(host, mask);
      if (i < words.length - 1) this.r.appendChild(host, this.r.createText(' '));
    });
    if (!this.observed) {
      this.observed = true;
      this.motion.observe(host, (e) => {
        if (e.isIntersecting) {
          host.classList.add('is-visible');
          if (this.config.once) this.motion.unobserve(host);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.motion.unobserve(this.el.nativeElement);
  }
}
