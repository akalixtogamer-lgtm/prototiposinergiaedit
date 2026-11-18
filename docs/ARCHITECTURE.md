# ARCHITECTURE, Site institucional Sinergia

## Diagnóstico inicial (Fase 1)
- O repositório `prototiposinergia` é o **protótipo do sistema** da Sinergia (áreas logadas, administrador, participante etc.), feito em HTML único. **Ele não é o site** e não tem Angular.
- Decisão: o site institucional nasce como um **workspace Angular novo**, separado do sistema. O protótipo ficou intocado. Dele saíram apenas os textos públicos já aprovados pela cliente (Home, Cinema, CAT, CIA, Focus group) e a identidade visual (cores, fontes, logo).
- **Nenhuma ligação com o protótipo** permanece no site: o cadastro de participante e o acesso interno são URLs configuráveis, por enquanto vazias (ver CLIENT_PENDING.md).

## Stack
- Angular 22 (standalone, signals, zoneless, controle de fluxo `@if/@for`), TypeScript 6.
- Sem bibliotecas de animação: IntersectionObserver + CSS + um único listener de scroll em `requestAnimationFrame`.
- Fontes hospedadas no próprio site via `@fontsource`, sem chamadas ao Google.

## Workspace
```
sinergia-site/
├─ projects/
│  ├─ kalixto-ui/            ← BIBLIOTECA PORTÁTIL (nada da Sinergia aqui dentro)
│  │  └─ src/
│  │     ├─ styles/          tokens, base, botões, motion  (@use 'kx')
│  │     └─ lib/
│  │        ├─ config/       provideKalixtoUi(), KxConfig, KxNavItem
│  │        ├─ motion/       config, serviço, reveal, stagger, split text, parallax, count-up, progresso
│  │        ├─ i18n/         serviço, pipes (kxT, kxGet, kxPath), rotas localizadas, seletor PT/EN
│  │        ├─ seo/          title, description, robots, canonical, hreflang
│  │        ├─ layout/       header, footer, WhatsApp flutuante
│  │        ├─ icons/        kx-icon (SVG próprios)
│  │        └─ ui/           botão, card, section header, acordeão, capítulo, sticky steps, section nav, CTA band
│  └─ sinergia-site/         ← APP DA SINERGIA
│     ├─ public/             imagens (SVG próprios, logo), data/open-research.json
│     └─ src/
│        ├─ styles/          _brand.scss (identidade), _patterns.scss (padrões do site)
│        └─ app/
│           ├─ core/
│           │  ├─ config/    site.config.ts (contatos/integrações), pages.ts, navigation.ts
│           │  ├─ i18n/      pt.ts, en.ts (mesma estrutura, tipada), i18n.config.ts
│           │  ├─ services/  contact.service.ts, open-research.service.ts
│           │  ├─ models/    open-research.model.ts
│           │  └─ guards/    admin.guard.ts (adaptador de autenticação externa)
│           ├─ shared/       page-hero, contact-channels, signup-link
│           └─ features/     home, company, services, cinema, cati, open-research, contact, admin, not-found
└─ docs/
```

## Mapa de navegação (mapa da cliente → rotas)

| Mapa da cliente | Rota PT | Rota EN | Página |
|---|---|---|---|
| Splash / Abertura | `/` | `/en` | `features/home` |
| A Empresa (+ Áreas de atuação, Experiência com produtos e serviços) | `/empresa` (`#sobre`, `#internacional`, `#numeros`, `#areas`, `#experiencia`) | `/en/company` | `features/company` |
| Serviços (Metodologias PITC-PATC, Focus group) | `/servicos` (`#metodologias`, `#focus-group`, `#linhas`) | `/en/services` | `features/services` |
| Cinema | `/servicos/cinema` | `/en/services/cinema` | `features/cinema` |
| Estações de CATI próprias | `/servicos/estacoes-cati` | `/en/services/cati-stations` | `features/cati` |
| Pesquisa aberta | `/pesquisa-aberta` | `/en/open-research` | `features/open-research` |
| Contato | `/contato` | `/en/contact` | `features/contact` |
| Área de admin (botão no footer) | `/acesso-interno` (noindex) | `/en/internal-access` | `features/admin` |
|, | qualquer outra |, | 404 |
| Botão flutuante de WhatsApp | global | global | `kx-whatsapp-fab` |

## Hierarquia e fluxo
```
Home ─┬─ A Empresa ─┬─ #areas ──────────► Cinema / Serviços / CATI
      │             └─ #experiencia ────► "Qual é o seu negócio?" → Cinema | Serviços
      ├─ Serviços ──┬─ #metodologias (PITC-PATC)
      │             ├─ #focus-group
      │             └─ #linhas ─────────► Cinema | Estações CATI
      ├─ Pesquisa aberta ──► cadastro de participante (URL do sistema ou Contato?assunto=participante)
      ├─ Contato ◄──────── todos os CTAs "Fale com um especialista"
      └─ Footer ─► Acesso interno ─► sistema administrativo da Sinergia (URL configurável)
```

## Decisões técnicas
- **Rotas geradas a partir de `pages.ts`** (`kxLocalizedRoutes`): uma entrada por página, com slug por idioma e lazy loading. Para criar uma página nova, basta uma linha.
- **i18n por URL**: o PT fica na raiz e o EN em `/en`, cada idioma com URL própria (bom para SEO). Trocar o idioma mantém a página e a âncora. Os dicionários são tipados: o `en.ts` não compila se faltar uma chave do `pt.ts`.
- **SEO**: `KxSeoService` define title, description, robots (noindex no acesso interno e no 404), canonical e `hreflang` (pt-BR, en, x-default) a cada navegação.
- **Área administrativa**: o site **não** cria um sistema administrativo. `ADMIN_AUTH` (adaptador) aponta para o sistema existente; `adminGuard` está pronto para proteger futuras rotas `/admin/**` quando houver uma API de sessão.
- **Dados que dependem da cliente** ficam em `site.config.ts` e nos dicionários. O que está vazio some em produção e aparece marcado como **PENDENTE** em `ng serve`.
- **Pesquisa aberta**: lida de `public/data/open-research.json` (hoje `[]`). O serviço filtra por `visibility: 'public'` e status `open`/`soon`, então nada interno ou sigiloso aparece. Pode virar uma API sem mudar a tela.
- **Formulário de contato**: faz POST JSON para `contactEndpoint`. Sem endpoint, mostra um erro honesto e **nunca simula sucesso**.

## Matriz de componentes por página

| Componente | Home | Empresa | Serviços | Cinema | CATI | Pesquisa | Contato | Admin |
|---|---|---|---|---|---|---|---|---|
| kx-header / kx-footer / WhatsApp | ● | ● | ● | ● | ● | ● | ● | ● |
| sn-page-hero | | ● | ● | ● | ● | ● | ● | |
| kx-section-nav | | ● | ● | | | | | |
| kx-section-header | ● | ● | ● | ● | ● | ● | | |
| kx-card | ● | ● | ● | ● | ● | ● | | |
| kx-chapter | ● | | | | | | | |
| kx-sticky-steps | | | ● | | | | | |
| kx-cta-band | ● | ● | ● | ● | ● | | | |
| kxCountUp | ● | ● | | | | | | |
| sn-contact-channels | (footer) | | | | | | ● | |
| sn-signup-link | ● | | | | | ● | | |

A matriz de interações está em INTERACTIONS.md.

## Como rodar
```bash
npm install
npm start                         # ng serve → http://localhost:4200 (mostra pendências)
npm run build                     # build de produção em dist/sinergia-site/browser
npx ng build kalixto-ui           # empacota a biblioteca em dist/kalixto-ui
```
Hospedagem: qualquer servidor estático com **fallback de SPA** (toda rota → `index.html`).
