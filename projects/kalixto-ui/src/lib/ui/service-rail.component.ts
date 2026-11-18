import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { KxIconComponent } from '../icons/icon.component';
import { KxSplitTextDirective } from '../motion/split-text.directive';
import { KxRevealDirective } from '../motion/reveal.directive';

/**
 * Faixa horizontal de cards com título gigante (referência: "Services" do Addifico).
 * - Rolagem nativa (toque, trackpad, Shift+roda), com scroll-snap.
 * - Botões anterior/próximo (desabilitados nas pontas) para mouse e teclado.
 * - A faixa "sangra" até as bordas da tela, sinalizando que há mais cards.
 * - Define --kx-notch-bg para o recorte dos kx-service-card combinar com o fundo.
 *
 *   <kx-service-rail title="Serviços" eyebrow="…" prevLabel="Anterior" nextLabel="Próximo">
 *     <kx-service-card … /> …
 *   </kx-service-rail>
 */
@Component({
  selector: 'kx-service-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxIconComponent, KxSplitTextDirective, KxRevealDirective],
  host: { class: 'kx-service-rail' },
  template: `
    <div class="kx-container head">
      <div class="copy">
        @if (eyebrow()) { <span class="kx-eyebrow" kxReveal="fade-in">{{ eyebrow() }}</span> }
        <h2 class="title" [kxSplitText]="title()"></h2>
        @if (lead()) { <p class="kx-lead" kxReveal [kxRevealDelay]="150">{{ lead() }}</p> }
      </div>
      <div class="nav" role="group" [attr.aria-label]="title()">
        <button type="button" class="nav-btn" [disabled]="atStart()" (click)="scroll(-1)" [attr.aria-label]="prevLabel()">
          <kx-icon name="arrow-left" [size]="20" />
        </button>
        <button type="button" class="nav-btn" [disabled]="atEnd()" (click)="scroll(1)" [attr.aria-label]="nextLabel()">
          <kx-icon name="arrow-right" [size]="20" />
        </button>
      </div>
    </div>
    <div #track class="track" kxReveal="slide-left" [kxRevealDelay]="200">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      --kx-notch-bg: var(--kx-rail-bg, var(--kx-color-bg));
      display: block;
      background: var(--kx-rail-bg, transparent);
      padding-block: var(--kx-section-y);
      overflow: hidden;
    }
    .head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--kx-space-3); margin-bottom: var(--kx-space-4); }
    .copy { display: grid; gap: var(--kx-space-2); }
    .title { font-size: clamp(3.25rem, 1.5rem + 8vw, 9rem); line-height: 0.92; letter-spacing: -0.035em; color: var(--kx-rail-title, var(--kx-color-brand)); }
    .nav { display: flex; gap: var(--kx-space-1); flex: none; }
    .nav-btn {
      display: grid; place-items: center; width: 52px; height: 52px;
      border-radius: 50%; border: 1px solid var(--kx-color-line-strong);
      background: transparent; color: var(--kx-color-fg); cursor: pointer;
      transition: background-color var(--kx-duration-fast), color var(--kx-duration-fast), border-color var(--kx-duration-fast), transform var(--kx-duration-instant);
    }
    .nav-btn:hover:not(:disabled) { background: var(--kx-color-fg); color: var(--kx-color-bg); border-color: var(--kx-color-fg); }
    .nav-btn:active:not(:disabled) { transform: scale(0.94); }
    .nav-btn:disabled { opacity: 0.35; cursor: default; }
    .track {
      --_pad: max(var(--kx-gutter), calc((100vw - var(--kx-container)) / 2));
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: clamp(250px, 72vw, 300px);
      gap: var(--kx-space-2);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: var(--_pad);
      padding: 6px var(--_pad) var(--kx-space-2);
      scrollbar-width: thin;
      scrollbar-color: var(--kx-color-line-strong) transparent;
    }
    @media (min-width: 768px) { .track { grid-auto-columns: clamp(260px, 30vw, 320px); } }
    :host ::ng-deep .track > * { scroll-snap-align: start; }
    @media (max-width: 599.98px) { .nav { display: none; } }
  `,
})
export class KxServiceRailComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly lead = input('');
  readonly prevLabel = input('Anterior');
  readonly nextLabel = input('Próximo');

  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.track().nativeElement;
      const update = () => {
        this.atStart.set(el.scrollLeft <= 4);
        this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
      };
      update();
      el.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      destroyRef.onDestroy(() => {
        el.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      });
    });
  }

  protected scroll(dir: 1 | -1): void {
    const el = this.track().nativeElement;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: smooth ? 'smooth' : 'auto' });
  }
}
