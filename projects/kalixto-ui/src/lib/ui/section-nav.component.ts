import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxMotionService } from '../motion/motion.service';

export interface KxSectionLink {
  id: string;
  label: string;
}

/**
 * Navegação interna da página (Anchor Scroll + indicador de seção ativa).
 * Fica presa logo abaixo do header; a seção visível é destacada (aria-current).
 * Rola horizontalmente em telas estreitas.
 */
@Component({
  selector: 'kx-section-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav class="kx-container" [attr.aria-label]="label()">
      <ul role="list">
        @for (l of links(); track l.id) {
          <li>
            <a [routerLink]="[]" [fragment]="l.id" [attr.aria-current]="active() === l.id ? 'location' : null" [class.is-active]="active() === l.id">{{ l.label }}</a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    :host {
      position: sticky;
      top: var(--kx-header-h-compact);
      z-index: var(--kx-z-sticky);
      display: block;
      background: color-mix(in srgb, var(--kx-color-bg) 92%, transparent);
      backdrop-filter: blur(10px);
      border-bottom: var(--kx-border);
    }
    ul { display: flex; gap: var(--kx-space-0-5); margin: 0; overflow-x: auto; scrollbar-width: none; }
    ul::-webkit-scrollbar { display: none; }
    a {
      position: relative; display: inline-flex; align-items: center; min-height: 52px; padding: 0 14px;
      white-space: nowrap; text-decoration: none; color: var(--kx-color-fg-muted); font-weight: 500; font-size: var(--kx-text-sm);
      transition: color var(--kx-duration-fast);
    }
    a::after {
      content: ''; position: absolute; left: 14px; right: 14px; bottom: -1px; height: 2px;
      background: var(--kx-color-brand); transform: scaleX(0); transform-origin: left;
      transition: transform var(--kx-duration-base) var(--kx-ease-out);
    }
    a:hover { color: var(--kx-color-fg); }
    a.is-active { color: var(--kx-color-brand); }
    a.is-active::after { transform: scaleX(1); }
  `,
})
export class KxSectionNavComponent {
  readonly links = input.required<KxSectionLink[]>();
  readonly label = input('Nesta página');
  protected readonly active = signal('');

  constructor() {
    const motion = inject(KxMotionService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off = motion.onScrollFrame(() => {
        const line = window.innerHeight * 0.35;
        let current = '';
        for (const l of this.links()) {
          const el = document.getElementById(l.id);
          if (el && el.getBoundingClientRect().top <= line) current = l.id;
        }
        if (current !== this.active()) this.active.set(current);
      });
      destroyRef.onDestroy(off);
    });
  }
}
