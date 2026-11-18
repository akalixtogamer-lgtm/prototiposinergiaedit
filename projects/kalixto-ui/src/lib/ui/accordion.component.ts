import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { KxIconComponent } from '../icons/icon.component';

export interface KxAccordionItem {
  question: string;
  answer: string;
}

let uid = 0;

/**
 * Acordeão / FAQ acessível (padrão WAI-ARIA: botão com aria-expanded + região).
 * Abertura suave com grid-template-rows (sem medir altura em JS).
 */
@Component({
  selector: 'kx-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxIconComponent],
  template: `
    <ul role="list" class="list">
      @for (item of items(); track item.question; let i = $index) {
        <li class="item" [class.is-open]="isOpen(i)">
          <h3 class="q-wrap">
            <button
              type="button"
              class="q"
              [id]="id + '-q-' + i"
              [attr.aria-expanded]="isOpen(i)"
              [attr.aria-controls]="id + '-a-' + i"
              (click)="toggle(i)"
            >
              <span>{{ item.question }}</span>
              <span class="sign" aria-hidden="true"><kx-icon name="chevron-down" [size]="22" /></span>
            </button>
          </h3>
          <div class="a" [id]="id + '-a-' + i" role="region" [attr.aria-labelledby]="id + '-q-' + i">
            <div class="a-inner"><p>{{ item.answer }}</p></div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    .list { margin: 0; border-top: var(--kx-border); }
    .item { border-bottom: var(--kx-border); }
    .q-wrap { margin: 0; font: inherit; }
    .q {
      display: flex; width: 100%; align-items: center; justify-content: space-between; gap: var(--kx-space-2);
      min-height: 64px; padding: var(--kx-space-2) 0;
      border: 0; background: none; text-align: left; cursor: pointer;
      font: 600 var(--kx-text-lg) / 1.35 var(--kx-font-body);
      color: var(--kx-color-fg);
      transition: color var(--kx-duration-fast);
    }
    .q:hover { color: var(--kx-color-brand); }
    .sign {
      display: grid; place-items: center; width: 40px; height: 40px; flex: none;
      border-radius: 50%; border: var(--kx-border);
      transition: transform var(--kx-duration-base) var(--kx-ease-out), background-color var(--kx-duration-base);
    }
    .is-open .sign { transform: rotate(180deg); background: var(--kx-color-brand-soft); }
    .a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--kx-duration-base) var(--kx-ease-in-out); }
    .is-open .a { grid-template-rows: 1fr; }
    .a-inner { overflow: hidden; }
    .a-inner p { padding: 0 var(--kx-space-6) var(--kx-space-3) 0; color: var(--kx-color-fg-muted); max-width: 70ch; }
  `,
})
export class KxAccordionComponent {
  readonly items = input.required<KxAccordionItem[]>();
  /** Permitir vários abertos ao mesmo tempo. */
  readonly multiple = input(false);
  protected readonly id = `kx-acc-${++uid}`;
  private readonly open = signal<Set<number>>(new Set());

  protected isOpen(i: number): boolean {
    return this.open().has(i);
  }
  protected toggle(i: number): void {
    this.open.update((s) => {
      const next = new Set(this.multiple() ? s : s.has(i) ? [i] : []);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }
}
