import { KxFooterColumn, KxNavItem } from 'kalixto-ui';

/**
 * Menu principal e colunas do rodapé. Os rótulos são chaves do dicionário
 * (core/i18n/pt.ts e en.ts); os destinos são ids de página + âncora.
 * Todo item aponta para uma rota ou âncora real.
 */
export const NAV: KxNavItem[] = [
  {
    label: 'nav.company',
    children: [
      { label: 'nav.companyAbout', page: 'company', fragment: 'sobre', description: 'nav.companyAboutDesc' },
      { label: 'nav.companyAreas', page: 'company', fragment: 'areas', description: 'nav.companyAreasDesc' },
      { label: 'nav.companyExperience', page: 'company', fragment: 'experiencia', description: 'nav.companyExperienceDesc' },
    ],
  },
  {
    label: 'nav.services',
    children: [
      { label: 'nav.servicesOverview', page: 'services', description: 'nav.servicesOverviewDesc' },
      { label: 'nav.cinema', page: 'cinema', description: 'nav.cinemaDesc' },
      { label: 'nav.cati', page: 'cati', description: 'nav.catiDesc' },
      { label: 'nav.focusGroup', page: 'services', fragment: 'focus-group', description: 'nav.focusGroupDesc' },
    ],
  },
  { label: 'nav.research', page: 'research' },
  { label: 'nav.contact', page: 'contact' },
];

export const FOOTER: KxFooterColumn[] = [
  {
    title: 'footer.colCompany',
    links: [
      { label: 'nav.companyAbout', page: 'company', fragment: 'sobre' },
      { label: 'nav.companyAreas', page: 'company', fragment: 'areas' },
      { label: 'nav.companyExperience', page: 'company', fragment: 'experiencia' },
    ],
  },
  {
    title: 'footer.colServices',
    links: [
      { label: 'nav.methodologies', page: 'services', fragment: 'metodologias' },
      { label: 'nav.focusGroup', page: 'services', fragment: 'focus-group' },
      { label: 'nav.cinema', page: 'cinema' },
      { label: 'nav.cati', page: 'cati' },
    ],
  },
  {
    title: 'footer.colParticipate',
    links: [
      { label: 'nav.research', page: 'research' },
      { label: 'nav.contact', page: 'contact' },
    ],
  },
];
