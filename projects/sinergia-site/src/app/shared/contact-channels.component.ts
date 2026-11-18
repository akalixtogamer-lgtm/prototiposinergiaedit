import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { KxI18nService, KxIconComponent, KxTranslatePipe, kxWhatsAppUrl } from 'kalixto-ui';
import { SITE } from '../core/config/site.config';

/**
 * Canais oficiais de contato (e-mail, telefone, WhatsApp, endereços).
 * Mostra SÓ o que está configurado em SITE. Em desenvolvimento, avisa o que falta.
 */
@Component({
  selector: 'sn-contact-channels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KxIconComponent, KxTranslatePipe],
  host: { '[class.is-inverse]': 'inverse()' },
  template: `
    @if (hasAny()) {
      <ul role="list" class="list">
        @if (site.contact.email) {
          <li>
            <kx-icon name="mail" />
            <span><span class="lbl">{{ 'contact.email' | kxT }}</span>
            <a [href]="'mailto:' + site.contact.email">{{ site.contact.email }}</a></span>
          </li>
        }
        @if (site.contact.phone) {
          <li>
            <kx-icon name="phone" />
            <span><span class="lbl">{{ 'contact.phone' | kxT }}</span>
            <a [href]="'tel:' + phoneDigits()">{{ site.contact.phone }}</a></span>
          </li>
        }
        @if (whatsUrl()) {
          <li>
            <kx-icon name="whatsapp" />
            <span><span class="lbl">{{ 'contact.whatsapp' | kxT }}</span>
            <a [href]="whatsUrl()" target="_blank" rel="noopener">{{ 'contact.whatsappCta' | kxT }}<span class="kx-sr-only"> ({{ 'a11y.newTab' | kxT }})</span></a></span>
          </li>
        }
        @for (addr of site.contact.addresses; track $index) {
          <li>
            <kx-icon name="map-pin" />
            <span><span class="lbl">{{ i18n.lang() === 'en' ? addr.label.en : addr.label.pt }}</span>
            <address>@for (line of addr.lines; track $index) {<span>{{ line }}</span>}</address>
            @if (addr.mapUrl) {<a [href]="addr.mapUrl" target="_blank" rel="noopener">{{ 'contact.openMap' | kxT }}</a>}</span>
          </li>
        }
      </ul>
    } @else if (dev) {
      <p class="pending" role="note">{{ 'contact.pendingChannels' | kxT }}</p>
    }
  `,
  styles: `
    .list { margin: 0; display: grid; gap: var(--kx-space-2); }
    li { display: grid; grid-template-columns: 24px 1fr; gap: var(--kx-space-2); align-items: start; }
    li kx-icon { color: var(--kx-color-brand); margin-top: 2px; }
    :host(.is-inverse) li kx-icon { color: var(--kx-color-accent); }
    .lbl { display: block; font: 500 var(--kx-text-xs) / 1.4 var(--kx-font-mono); letter-spacing: var(--kx-tracking-label); text-transform: uppercase; opacity: 0.75; }
    address { font-style: normal; display: grid; }
    a { color: inherit; font-weight: 600; }
    .pending { padding: var(--kx-space-2); border: 2px dashed var(--kx-color-warning-fg); border-radius: var(--kx-radius-md); background: var(--kx-color-warning-bg); color: var(--kx-color-warning-fg); font-size: var(--kx-text-sm); }
  `,
})
export class ContactChannelsComponent {
  protected readonly site = SITE;
  protected readonly i18n = inject(KxI18nService);
  protected readonly dev = isDevMode();
  readonly inverse = input(false);

  protected readonly phoneDigits = computed(() => SITE.contact.phone.replace(/[^\d+]/g, ''));
  protected readonly whatsUrl = computed(() => {
    this.i18n.lang();
    return kxWhatsAppUrl(SITE.whatsapp.phone, this.i18n.t('whatsapp.message'));
  });
  protected readonly hasAny = computed(
    () => !!(SITE.contact.email || SITE.contact.phone || this.whatsUrl() || SITE.contact.addresses.length),
  );
}
