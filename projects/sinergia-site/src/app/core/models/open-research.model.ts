/**
 * Pesquisa aberta publicada no site (arquivo public/data/open-research.json).
 * Só entram no site itens com visibility 'public' e status 'open' ou 'soon'.
 * Nunca publique aqui estudos internos, sigilosos ou resultados.
 */
export type Localized = { pt: string; en: string };

export interface OpenResearch {
  id: string;
  visibility: 'public' | 'internal';
  status: 'open' | 'soon' | 'closed';
  title: Localized;
  description: Localized;
  audience: Localized;
  requirements?: Localized;
  /** Ex.: { pt: 'cerca de 10 minutos', en: 'about 10 minutes' } */
  duration?: Localized;
  /** Data ISO (AAAA-MM-DD) do fim das inscrições. */
  deadline?: string;
  /** Link de participação (fluxo de inscrição existente ou formulário da pesquisa). */
  url: string;
}
