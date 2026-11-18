import { KxPage } from 'kalixto-ui';

/**
 * Mapa de páginas (fonte: mapa de arquitetura da cliente).
 * Cada página tem um id estável e um slug por idioma; as rotas são geradas
 * por kxLocalizedRoutes(). Para criar uma página nova, adicione aqui.
 */
export const PAGES: KxPage[] = [
  {
    id: 'home',
    slugs: { pt: '', en: '' },
    loadComponent: () => import('../../features/home/home.page').then((m) => m.HomePage),
    titleKey: 'seo.home.title',
    descriptionKey: 'seo.home.description',
  },
  {
    id: 'company',
    slugs: { pt: 'empresa', en: 'company' },
    loadComponent: () => import('../../features/company/company.page').then((m) => m.CompanyPage),
    titleKey: 'seo.company.title',
    descriptionKey: 'seo.company.description',
  },
  {
    id: 'services',
    slugs: { pt: 'servicos', en: 'services' },
    loadComponent: () => import('../../features/services/services.page').then((m) => m.ServicesPage),
    titleKey: 'seo.services.title',
    descriptionKey: 'seo.services.description',
  },
  {
    id: 'cinema',
    slugs: { pt: 'servicos/cinema', en: 'services/cinema' },
    loadComponent: () => import('../../features/cinema/cinema.page').then((m) => m.CinemaPage),
    titleKey: 'seo.cinema.title',
    descriptionKey: 'seo.cinema.description',
  },
  {
    id: 'cati',
    slugs: { pt: 'servicos/estacoes-cati', en: 'services/cati-stations' },
    loadComponent: () => import('../../features/cati/cati.page').then((m) => m.CatiPage),
    titleKey: 'seo.cati.title',
    descriptionKey: 'seo.cati.description',
  },
  {
    id: 'research',
    slugs: { pt: 'pesquisa-aberta', en: 'open-research' },
    loadComponent: () => import('../../features/open-research/open-research.page').then((m) => m.OpenResearchPage),
    titleKey: 'seo.research.title',
    descriptionKey: 'seo.research.description',
  },
  {
    id: 'contact',
    slugs: { pt: 'contato', en: 'contact' },
    loadComponent: () => import('../../features/contact/contact.page').then((m) => m.ContactPage),
    titleKey: 'seo.contact.title',
    descriptionKey: 'seo.contact.description',
  },
  {
    id: 'admin',
    slugs: { pt: 'acesso-interno', en: 'internal-access' },
    loadComponent: () => import('../../features/admin/admin-gateway.page').then((m) => m.AdminGatewayPage),
    titleKey: 'seo.admin.title',
    noindex: true,
  },
];
