import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxButtonDirective, KxIconComponent, KxPathPipe, KxTranslatePipe } from 'kalixto-ui';
import { ADMIN_AUTH } from '../../core/guards/admin.guard';

/**
 * Acesso interno (link discreto no rodapé).
 * O site não tem área administrativa própria: esta página só encaminha para o
 * sistema da Sinergia, onde ficam autenticação, sessão e permissões.
 * Fora dos buscadores (noindex) e fora do menu.
 */
@Component({
  selector: 'sn-admin-gateway',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxButtonDirective, KxIconComponent, KxPathPipe, KxTranslatePipe],
  template: `
    <section class="kx-section" style="padding-top: calc(var(--sn-header-offset) + var(--kx-section-y))">
      <div class="kx-container kx-container--narrow box">
        <span class="lock" aria-hidden="true"><kx-icon name="lock" [size]="28" /></span>
        <span class="kx-eyebrow">{{ 'admin.eyebrow' | kxT }}</span>
        <h1>{{ 'admin.title' | kxT }}</h1>
        <p class="kx-muted">{{ 'admin.text' | kxT }}</p>
        @if (loginUrl) {
          <div class="kx-row">
            <a kxButton="primary" [href]="loginUrl" rel="nofollow">
              <kx-icon name="log-in" class="kx-btn__icon" [size]="18" />{{ 'admin.cta' | kxT }}
            </a>
            <a kxButton="ghost" [routerLink]="'home' | kxPath">{{ 'admin.back' | kxT }}</a>
          </div>
        } @else {
          <p class="sn-pending" role="note">{{ 'admin.unavailable' | kxT }}</p>
          <div><a kxButton="ghost" [routerLink]="'home' | kxPath">{{ 'admin.back' | kxT }}</a></div>
        }
      </div>
    </section>
  `,
  styles: `
    .box { display: grid; gap: var(--kx-space-2); justify-items: start; padding-block: var(--kx-space-6); }
    h1 { font-size: var(--kx-text-h2); }
    .lock { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: var(--kx-color-brand-soft); color: var(--kx-color-brand); }
  `,
})
export class AdminGatewayPage {
  protected readonly loginUrl = inject(ADMIN_AUTH).loginUrl();
}
