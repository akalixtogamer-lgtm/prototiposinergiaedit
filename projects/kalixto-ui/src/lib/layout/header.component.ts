import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { KX_CONFIG, KxNavItem } from '../config/kx-config';
import { KxPathPipe, KxTranslatePipe } from '../i18n/i18n.pipes';
import { KxI18nService } from '../i18n/i18n.service';
import { KxLangSwitchComponent } from '../i18n/lang-switch.component';
import { KxIconComponent } from '../icons/icon.component';
import { KxMotionService } from '../motion/motion.service';

/**
 * Header responsivo.
 * Desktop: fixo, compacta após 24px de scroll; dropdowns abrem por hover, clique
 *   ou teclado (Enter/Espaço/↓), fecham com Esc ou ao sair. Link ativo por rota.
 * Mobile (< 1024px): botão MENU abre painel em tela cheia com tipografia grande
 *   e submenus em acordeão; Esc fecha, foco preso no painel, rolagem travada.
 * Conteúdo projetado: [kxHeaderLogo] e [kxHeaderActions].
 */
@Component({
  selector: 'kx-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, KxTranslatePipe, KxPathPipe, KxLangSwitchComponent, KxIconComponent],
  host: {
    class: 'kx-header',
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-open]': 'mobileOpen()',
    '[class.is-floating]': 'floating()',
    '(document:keydown.escape)': 'onEscape()',
  },
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class KxHeaderComponent {
  protected readonly cfg = inject(KX_CONFIG);
  private readonly motion = inject(KxMotionService);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly i18n = inject(KxI18nService);

  /** Chaves de rótulos acessíveis (traduzidas pelo app). */
  readonly navLabelKey = input('a11y.mainNav');
  readonly menuLabelKey = input('a11y.menu');
  readonly closeLabelKey = input('a11y.close');
  readonly langLabelKey = input('a11y.language');
  /** Barra em pílula flutuante (translúcida, com borda), em vez de faixa de ponta a ponta. */
  readonly floating = input(false);

  protected readonly scrolled = signal(false);
  protected readonly mobileOpen = signal(false);
  protected readonly openDropdown = signal<number | null>(null);
  protected readonly openAccordion = signal<number | null>(null);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly toggle = viewChild<ElementRef<HTMLButtonElement>>('toggle');
  private closeTimer?: ReturnType<typeof setTimeout>;
  /** Aberto pelo hover: o clique seguinte confirma (não fecha). */
  private openedByHover = false;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off = this.motion.onScrollFrame(() => {
        const s = window.scrollY > 24;
        if (s !== this.scrolled()) this.scrolled.set(s);
      });
      destroyRef.onDestroy(off);
    });
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.mobileOpen.set(false);
        this.openDropdown.set(null);
      });
    effect(() => {
      const open = this.mobileOpen();
      this.doc.body.classList.toggle('kx-scroll-lock', open);
      if (open) setTimeout(() => this.panel()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus(), 60);
    });
  }

  protected isActiveParent(item: KxNavItem): boolean {
    if (!item.children) return false;
    const url = this.router.url.split(/[?#]/)[0];
    return item.children.some((c) => c.page && url === this.pathOf(c.page));
  }

  private pathOf(page: string): string {
    return this.i18n.path(page);
  }

  // ---- Dropdown (desktop) ----
  protected hoverOpen(i: number): void {
    if (!window.matchMedia('(hover: hover)').matches) return;
    clearTimeout(this.closeTimer);
    if (this.openDropdown() !== i) this.openedByHover = true;
    this.openDropdown.set(i);
  }
  protected hoverClose(): void {
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.openDropdown.set(null), 160);
  }
  protected toggleDropdown(i: number): void {
    if (this.openDropdown() === i && this.openedByHover) {
      this.openedByHover = false; // já aberto pelo hover: o clique mantém aberto
      return;
    }
    this.openedByHover = false;
    this.openDropdown.update((v) => (v === i ? null : i));
  }
  protected onTriggerKey(e: KeyboardEvent, i: number): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.openDropdown.set(i);
      const li = (e.target as HTMLElement).parentElement;
      // espera o Angular renderizar o menu visível antes de mover o foco
      requestAnimationFrame(() => requestAnimationFrame(() => li?.querySelector<HTMLElement>('.dd a')?.focus()));
    }
  }
  protected onDropdownKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const links = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('a')];
    const i = links.indexOf(this.doc.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[next]?.focus();
  }
  protected onFocusOut(e: FocusEvent): void {
    const li = e.currentTarget as HTMLElement;
    if (!li.contains(e.relatedTarget as Node)) this.openDropdown.set(null);
  }

  // ---- Mobile ----
  protected toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
    if (!this.mobileOpen()) this.toggle()?.nativeElement.focus();
  }
  protected toggleAccordion(i: number): void {
    this.openAccordion.update((v) => (v === i ? null : i));
  }
  protected trapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const root = this.panel()?.nativeElement;
    if (!root) return;
    const items = [
      this.toggle()?.nativeElement,
      ...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ].filter(Boolean) as HTMLElement[];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && this.doc.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && this.doc.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  protected onEscape(): void {
    if (this.mobileOpen()) {
      this.mobileOpen.set(false);
      this.toggle()?.nativeElement.focus();
    }
    if (this.openDropdown() !== null) this.openDropdown.set(null);
  }
}
