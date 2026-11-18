/**
 * Configuração do site Sinergia, ÚNICO lugar para dados de contato e integrações.
 *
 * Regra do projeto: nada aqui pode ser inventado. Campos vazios ('') ficam
 * ocultos no site em produção e aparecem marcados como PENDENTE no modo de
 * desenvolvimento (ng serve), para a equipe saber o que falta.
 * Lista completa de pendências: docs/CLIENT_PENDING.md
 */
export interface SiteAddress {
  label: { pt: string; en: string };
  lines: string[];
  mapUrl?: string;
}

export interface SiteConfig {
  siteName: string;
  /** Domínio público definitivo (canonical/hreflang). PENDENTE. */
  siteUrl: string;
  contact: {
    /** E-mail comercial oficial. PENDENTE. */
    email: string;
    /** Telefone no formato exibido, ex.: '+55 21 0000-0000'. PENDENTE. */
    phone: string;
    /** Endereços oficiais. PENDENTE. */
    addresses: SiteAddress[];
  };
  whatsapp: {
    /** Número oficial, só dígitos com DDI+DDD (ex.: 5521900000000). PENDENTE. */
    phone: string;
  };
  integrations: {
    /**
     * Endpoint que recebe o formulário de contato (POST JSON).
     * Pode ser um backend próprio ou serviço de formulários. PENDENTE.
     */
    contactEndpoint: string;
    /**
     * Fluxo de cadastro de participante do sistema da Sinergia. PENDENTE.
     * Vazio: os botões de cadastro levam ao formulário de contato com o
     * assunto "participante" já selecionado.
     */
    participantSignupUrl: string;
    /**
     * Endereço de entrada do sistema administrativo da Sinergia (autenticação
     * e sessão ficam nele, não no site). PENDENTE.
     */
    adminUrl: string;
    /** Arquivo com as pesquisas abertas publicadas (JSON). */
    openResearchSource: string;
  };
}

export const SITE: SiteConfig = {
  siteName: 'Sinergia Research & Intelligence',
  siteUrl: '',
  contact: {
    email: '',
    phone: '',
    addresses: [],
  },
  whatsapp: {
    phone: '',
  },
  integrations: {
    contactEndpoint: '',
    participantSignupUrl: '',
    adminUrl: '',
    openResearchSource: 'data/open-research.json',
  },
};
