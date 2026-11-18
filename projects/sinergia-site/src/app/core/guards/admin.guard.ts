import { Injectable, InjectionToken, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SITE } from '../config/site.config';

/**
 * Adaptador de autenticação administrativa.
 *
 * O site institucional NÃO tem sistema administrativo próprio: autenticação,
 * sessão e permissões ficam no sistema existente da Sinergia (SITE.integrations.adminUrl),
 * que confere a conta em cada tela e ação. Por isso o adaptador padrão apenas
 * encaminha para lá.
 *
 * Quando o sistema ganhar uma API de sessão (ex.: cookie HttpOnly + /api/session),
 * troque o provider de ADMIN_AUTH por uma implementação que consulte essa API;
 * o guard abaixo passa a proteger qualquer rota /admin/** sem mudar as telas.
 */
export interface AdminAuthAdapter {
  /** Há sessão administrativa válida? */
  isAuthenticated(): Promise<boolean>;
  /** URL de entrada no sistema administrativo (vazio = não configurado). */
  loginUrl(): string;
}

@Injectable({ providedIn: 'root' })
export class ExternalAdminAuth implements AdminAuthAdapter {
  async isAuthenticated(): Promise<boolean> {
    return false; // a sessão vive no sistema externo; o site nunca a presume
  }
  loginUrl(): string {
    return SITE.integrations.adminUrl;
  }
}

export const ADMIN_AUTH = new InjectionToken<AdminAuthAdapter>('ADMIN_AUTH', {
  providedIn: 'root',
  factory: () => inject(ExternalAdminAuth),
});

/**
 * Proteção de rotas administrativas internas (para uso futuro em /admin/**).
 * Sem sessão válida, manda para a página de acesso interno.
 */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(ADMIN_AUTH);
  const router = inject(Router);
  return (await auth.isAuthenticated()) ? true : router.parseUrl('/acesso-interno');
};
