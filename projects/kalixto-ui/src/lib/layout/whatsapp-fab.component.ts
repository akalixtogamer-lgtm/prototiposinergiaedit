import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { KX_CONFIG } from '../config/kx-config';
import { KxI18nService } from '../i18n/i18n.service';
import { KxIconComponent } from '../icons/icon.component';

/**
 * Botão flutuante de WhatsApp (canto inferior direito).
 * Número e mensagem inicial vêm de KX_CONFIG.whatsapp; sem número configurado,
 * o botão NÃO aparece (nunca leva a um número inventado).
 * Mensagem segue o idioma atual. Rótulo expande no hover/foco em telas largas.
 */
@Component({
  selector: 'kx-whatsapp-fab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxIconComponent],
  template: `
    @if (href()) {
      <a class="fab" [href]="href()" target="_blank" rel="noopener" [attr.aria-label]="ariaLabel()">
        <kx-icon name="whatsapp" [size]="28" [stroke]="1.7" />
        <span class="txt" aria-hidden="true">{{ i18n.t(labelKey()) }}</span>
      </a>
    }
  `,
  styles: `
    :host {
      position: fixed;
      right: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      z-index: var(--kx-z-fab);
    }
    .fab {
      display: inline-flex;
      align-items: center;
      height: 56px;
      min-width: 56px;
      padding: 0 14px;
      border-radius: var(--kx-radius-pill);
      background: var(--kx-color-whatsapp);
      color: #fff;
      text-decoration: none;
      box-shadow: var(--kx-shadow-lg);
      transition: background-color var(--kx-duration-fast), transform var(--kx-duration-base) var(--kx-ease-out);
    }
    .txt {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      font: 600 var(--kx-text-sm) / 1 var(--kx-font-body);
      opacity: 0;
      transition: max-width var(--kx-duration-slow) var(--kx-ease-out), opacity var(--kx-duration-base), margin var(--kx-duration-slow) var(--kx-ease-out);
    }
    .fab:hover, .fab:focus-visible { background: var(--kx-color-whatsapp-hover); color: #fff; transform: translateY(-2px); }
    .fab:active { transform: scale(0.96); }
    @media (hover: hover) and (min-width: 768px) {
      .fab:hover .txt, .fab:focus-visible .txt { max-width: 220px; opacity: 1; margin-left: 10px; }
    }
  `,
})
export class KxWhatsAppFabComponent {
  private readonly cfg = inject(KX_CONFIG);
  protected readonly i18n = inject(KxI18nService);
  readonly labelKey = input('whatsapp.label');
  readonly ariaKey = input('whatsapp.aria');

  protected readonly href = computed(() => {
    const phone = (this.cfg.whatsapp.phone || '').replace(/\D/g, '');
    if (!phone) return '';
    this.i18n.lang(); // dependência: refaz a mensagem ao trocar o idioma
    const text = this.i18n.t(this.cfg.whatsapp.messageKey);
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  });
  protected readonly ariaLabel = computed(() => {
    this.i18n.lang();
    return this.i18n.t(this.ariaKey());
  });
}

/** Link de WhatsApp reutilizável (para páginas de contato etc.). */
export function kxWhatsAppUrl(phone: string, text: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : '';
}
