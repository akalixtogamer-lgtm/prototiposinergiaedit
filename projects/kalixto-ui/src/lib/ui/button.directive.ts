import { Directive, computed, input } from '@angular/core';

export type KxButtonVariant = 'primary' | 'accent' | 'ghost' | 'ghost-inverse' | 'link';
export type KxButtonSize = 'sm' | 'md' | 'lg';

/**
 * Botão/link com todos os estados (hover, focus, active, disabled, loading).
 *   <a kxButton="accent" routerLink="/contato">Fale conosco</a>
 *   <button kxButton="primary" [kxLoading]="sending()">Enviar</button>
 * Estilos em styles/_buttons.scss.
 */
@Directive({
  selector: '[kxButton]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-busy]': 'kxLoading() || null',
  },
})
export class KxButtonDirective {
  readonly kxButton = input<KxButtonVariant | ''>('primary');
  readonly kxSize = input<KxButtonSize>('md');
  readonly kxBlock = input(false);
  readonly kxLoading = input(false);

  protected readonly classes = computed(() =>
    [
      'kx-btn',
      `kx-btn--${this.kxButton() || 'primary'}`,
      this.kxSize() !== 'md' ? `kx-btn--${this.kxSize()}` : '',
      this.kxBlock() ? 'kx-btn--block' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
