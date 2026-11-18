# Sinergia Research & Intelligence, Site institucional (Angular)

Site institucional bilíngue (PT/EN) da Sinergia, montado sobre o mapa de arquitetura da cliente, com experiência de navegação inspirada no Flim.ai e identidade visual própria da Sinergia.

> O **sistema** da Sinergia (áreas logadas) é outro projeto. Este repositório é **só o site**.

## Estrutura
- `projects/kalixto-ui`: **biblioteca portátil** (tokens, motion, header/footer, i18n, SEO, componentes). Pode ser levada para qualquer projeto Angular: ver [docs/PORTABILITY.md](docs/PORTABILITY.md).
- `projects/sinergia-site`: o site (páginas, conteúdo PT/EN, configuração).

## Comandos
```bash
npm install
npm start                 # desenvolvimento: http://localhost:4200 (mostra pendências em destaque)
npm run build             # produção: dist/sinergia-site/browser
npx ng build kalixto-ui    # empacota a biblioteca: dist/kalixto-ui
```
Hospede `dist/sinergia-site/browser` em qualquer servidor estático com fallback de SPA (toda rota → `index.html`).

## Onde mexer
| O quê | Arquivo |
|---|---|
| E-mail, telefone, endereços, WhatsApp, integrações | `projects/sinergia-site/src/app/core/config/site.config.ts` |
| Textos PT / EN | `projects/sinergia-site/src/app/core/i18n/pt.ts` · `en.ts` |
| Menu e rodapé | `projects/sinergia-site/src/app/core/config/navigation.ts` |
| Páginas e URLs | `projects/sinergia-site/src/app/core/config/pages.ts` |
| Pesquisas abertas publicadas | `projects/sinergia-site/public/data/open-research.json` |
| Cores e fontes da marca | `projects/sinergia-site/src/styles/_brand.scss` |
| Ritmo das animações | `projects/kalixto-ui/src/lib/motion/motion.config.ts` |

## Documentação
| Documento | Conteúdo |
|---|---|
| [REFERENCE_ANALYSIS](docs/REFERENCE_ANALYSIS.md) | Engenharia reversa do Flim.ai |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Diagnóstico, mapa de navegação, rotas, decisões, matriz de componentes |
| [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) | Tokens, tipografia, grid, padrões |
| [INTERACTIONS](docs/INTERACTIONS.md) | Cada efeito: duração, gatilho, finalidade, onde aparece |
| [COMPONENTS](docs/COMPONENTS.md) | Catálogo de componentes e APIs |
| [TEST_REPORT](docs/TEST_REPORT.md) | 102/102 testes funcionais, 0 violações de acessibilidade |
| [CLIENT_PENDING](docs/CLIENT_PENDING.md) | **O que falta a Sinergia enviar** |
| [FUTURE_IMPROVEMENTS](docs/FUTURE_IMPROVEMENTS.md) | Próximos passos |
| [PORTABILITY](docs/PORTABILITY.md) | Como levar a experiência para outro projeto Angular |
