import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KxButtonDirective, KxButtonVariant, KxIconComponent, KxPathPipe, KxTranslatePipe } from 'kalixto-ui';
import { SITE } from '../core/config/site.config';

/**
 * Botão "Cadastrar como participante".
 * Com SITE.integrations.participantSignupUrl configurado: abre o cadastro do
 * sistema da Sinergia (nova aba). Sem ele: leva ao formulário de contato com o
 * assunto "participante" já selecionado, o botão sempre tem uma ação real.
 */
@Component({
  selector: 'sn-signup-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, KxButtonDirective, KxIconComponent, KxPathPipe, KxTranslatePipe],
  host: { style: 'display: contents' },
  template: `
    @if (url) {
      <a [kxButton]="variant()" [kxSize]="size()" [href]="url" target="_blank" rel="noopener">
        <kx-icon name="user-plus" class="kx-btn__icon" [size]="18" />
        {{ labelKey() | kxT }}
        <span class="kx-sr-only">({{ 'a11y.newTab' | kxT }})</span>
      </a>
    } @else {
      <a [kxButton]="variant()" [kxSize]="size()" [routerLink]="'contact' | kxPath" [queryParams]="{ assunto: 'participante' }">
        <kx-icon name="user-plus" class="kx-btn__icon" [size]="18" />
        {{ labelKey() | kxT }}
      </a>
    }
  `,
})
export class SignupLinkComponent {
  protected readonly url = SITE.integrations.participantSignupUrl;
  readonly labelKey = input('research.signupCta');
  readonly variant = input<KxButtonVariant>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
