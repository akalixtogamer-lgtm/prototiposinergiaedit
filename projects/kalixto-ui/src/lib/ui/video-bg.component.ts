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
import { KxMotionService } from '../motion/motion.service';
import { KxIconComponent } from '../icons/icon.component';

export interface KxVideoSource {
  src: string;
  type: string;
  /** Media query opcional (ex.: '(max-width: 767px)' para uma versão menor no celular). */
  media?: string;
}

/**
 * Vídeo de fundo decorativo (hero).
 * - Sem som, em loop, inline; a imagem de capa (poster) aparece até o vídeo carregar.
 * - Botão de pausar/reproduzir sempre disponível (WCAG 2.2.2: movimento > 5s precisa de controle).
 * - prefers-reduced-motion: não toca sozinho, fica a capa; o botão permite tocar.
 * - Pausa sozinho quando sai da tela (economiza bateria e CPU) e volta ao reaparecer.
 * - Economia de dados (Save-Data) ou conexão 2G: fica só a capa.
 * - É decorativo (aria-hidden): o conteúdo do hero fica no texto por cima.
 *
 *   <kx-video-bg [sources]="[{src:'video/hero.webm',type:'video/webm'}]" poster="video/hero.jpg" />
 */
@Component({
  selector: 'kx-video-bg',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxIconComponent],
  host: { class: 'kx-video-bg' },
  template: `
    <video
      #video
      class="media"
      [poster]="poster()"
      muted
      loop
      playsinline
      preload="metadata"
      disablepictureinpicture
      aria-hidden="true"
      tabindex="-1"
    >
      @for (s of sources(); track s.src) {
        <source [src]="s.src" [type]="s.type" [attr.media]="s.media || null" />
      }
    </video>
    <button
      type="button"
      class="toggle"
      [attr.aria-label]="playing() ? pauseLabel() : playLabel()"
      [attr.aria-pressed]="!playing()"
      (click)="toggle()"
    >
      <kx-icon [name]="playing() ? 'pause' : 'play-tri'" [size]="18" />
    </button>
  `,
  styles: `
    /* sem z-index no host: o botão (z 3) fica acima do conteúdo do hero, e o vídeo abaixo do véu */
    :host { position: absolute; inset: 0; overflow: hidden; display: block; background: var(--kx-color-surface-inverse); }
    .media { width: 100%; height: 100%; object-fit: cover; object-position: var(--kx-video-position, center); display: block; }
    .toggle {
      position: absolute; z-index: 3;
      right: var(--kx-video-toggle-right, var(--kx-gutter)); bottom: var(--kx-video-toggle-bottom, 24px);
      display: grid; place-items: center; width: 44px; height: 44px;
      border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.35);
      background: rgba(0, 0, 0, 0.35); color: #fff; cursor: pointer;
      backdrop-filter: blur(8px);
      transition: background-color var(--kx-duration-fast), transform var(--kx-duration-instant);
    }
    .toggle:hover { background: rgba(0, 0, 0, 0.6); }
    .toggle:active { transform: scale(0.94); }
  `,
})
export class KxVideoBgComponent {
  readonly sources = input.required<KxVideoSource[]>();
  readonly poster = input('');
  readonly playLabel = input('Reproduzir vídeo de fundo');
  readonly pauseLabel = input('Pausar vídeo de fundo');

  protected readonly playing = signal(false);
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(KxMotionService);
  /** O usuário pausou: não retomar sozinho ao voltar à tela. */
  private userPaused = false;
  private visible = true;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const v = this.video().nativeElement;
      v.muted = true; // garante autoplay em todos os navegadores
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const lowData = !!conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? '');
      if (this.motion.reducedMotion() || lowData) this.userPaused = true;
      v.addEventListener('play', () => this.playing.set(true));
      v.addEventListener('pause', () => this.playing.set(false));
      this.motion.observe(this.host.nativeElement, (e) => {
        this.visible = e.isIntersecting;
        if (!e.isIntersecting) v.pause();
        else if (!this.userPaused) this.play();
      });
      if (!this.userPaused) this.play();
      destroyRef.onDestroy(() => {
        this.motion.unobserve(this.host.nativeElement);
        v.pause();
      });
    });
  }

  private play(): void {
    this.video()
      .nativeElement.play()
      .catch(() => this.playing.set(false)); // autoplay bloqueado: fica a capa e o botão
  }

  protected toggle(): void {
    const v = this.video().nativeElement;
    if (v.paused) {
      this.userPaused = false;
      if (this.visible) this.play();
    } else {
      this.userPaused = true;
      v.pause();
    }
  }
}
