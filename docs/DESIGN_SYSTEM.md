# DESIGN_SYSTEM, Tokens e padrões

Existem duas camadas:
1. **kalixto-ui** (`projects/kalixto-ui/src/styles/_tokens.scss`): define **todas** as variáveis `--kx-*` com valores neutros. Os componentes leem apenas essas variáveis.
2. **Marca Sinergia** (`projects/sinergia-site/src/styles/_brand.scss`): sobrescreve as `--kx-*` com a identidade real, **preservada do protótipo aprovado**. A estética do Flim não substituiu nada.

## Cores (Sinergia), tema escuro
Desde 17/11/2026 o site usa **tema escuro**, a partir das referências da cliente. A paleta da marca é a mesma; mudaram os papéis.

| Token | Valor | Uso |
|---|---|---|
| `--kx-color-bg` | `#090e0a` (ink-1) | fundo da página |
| `--kx-color-bg-subtle` | `#0e1510` (ink-2) | seções alternadas |
| `--kx-color-surface` | `#141d16` (ink-3) | cards |
| `--kx-color-surface-raised` | `#1b261d` (ink-4) | superfície elevada |
| `--kx-color-surface-inverse` | `#050806` (ink-0) | capítulo, dropdown, footer |
| `--kx-color-brand-deep` | `#08130a` | header, hero, faixas de CTA, footer |
| `--kx-color-brand` / `--kx-color-action` | `#98d7aa` (verde 300, menta) | links, ícones, eyebrows, botão primário, card ativo |
| `--kx-color-action-hover` | `#bfe9cb` | hover do primário |
| `--kx-color-on-action` | `#06210a` | texto sobre menta |
| `--kx-color-accent` | `#edb161` (areia 400, o "dourado") | CTA principal, foco, indicadores |
| `--kx-chapter-tone` | `#236a36` (verde 700) | painel do capítulo |
| `--kx-color-fg` / `-muted` / `-subtle` | `#ecf2ed` / `#b3bdb5` / `#919c93` | textos |
| `--kx-color-line` / `-strong` | branco 9% / 24% | bordas |

Contraste: todas as combinações passaram no axe (WCAG 2.2 AA). O tema claro original continua disponível: é o padrão da biblioteca, basta não sobrescrever os tokens.

## Tipografia
| Papel | Família | Token |
|---|---|---|
| Títulos | Source Serif 4 (variável, opsz) | `--kx-font-display` |
| Texto | IBM Plex Sans 400/500/600 | `--kx-font-body` |
| Rótulos / eyebrow | IBM Plex Mono 400/500 | `--kx-font-mono` |

Escala fluida com `clamp()`: `--kx-text-display`, `h1` (36→72px), `h2` (28→44px), `h3` (20→24px), `lg` 18px, `md` 16px, `sm` 14px e `xs` 12px. As fontes são self-hosted (`@fontsource`, subconjunto latino, `font-display: swap`).

## Espaçamento (base 8px)
`--kx-space-0-5` 4 · `-1` 8 · `-2` 16 · `-3` 24 · `-4` 32 · `-5` 40 · `-6` 48 · `-8` 64 · `-10` 80 · `-12` 96 · `-16` 128 · `--kx-section-y` fluido (64→128px).

## Grid e containers
- `--kx-container` 1240px, `--kx-container-narrow` 760px, `--kx-gutter` fluido (16→40px).
- Classes: `.kx-container`, `.kx-section` (`--subtle`, `--inverse`, `--tight`), `.kx-grid--2/3/4` (auto-fit, sem media queries), `.kx-split` (1 coluna → 2 a partir de 1024px), `.kx-stack` e `.kx-row`.

## Breakpoints
`xs 360 · sm 480 · md 768 · lg 1024 · xl 1280 · xxl 1600`, com os mixins `kx-up(bp)` e `kx-down(bp)`. O menu desktop aparece a partir de 1024px.

## Bordas, raios e sombras
- Raios: `sm 4` · `md 8` · `lg 16` · `xl 24` · `pill`.
- Sombras: `--kx-shadow-sm/md/lg` (verde muito escuro com baixa opacidade).

## Movimento
- Curvas: `--kx-ease-out` (0.22, 1, 0.36, 1), `--kx-ease-in-out` e `--kx-ease-standard`.
- Durações: `instant 120` · `fast 200` · `base 400` · `slow 700` · `slower 1000` ms. Todas vão a 0 com `prefers-reduced-motion`.
- Detalhes de cada efeito em INTERACTIONS.md.

## Camadas (z-index)
`base 1 · raised 10 · sticky 50 (section-nav) · header 100 · fab 150 (WhatsApp) · overlay 200 · skip 300`.

## Padrões reutilizáveis
| Padrão | Onde |
|---|---|
| Header, Footer, WhatsApp | `kx-header` (faixa ou **pílula flutuante**), `kx-footer`, `kx-whatsapp-fab` |
| Hero da home | `features/home` (único, com composição própria) |
| Hero das páginas internas | `sn-page-hero` |
| Section Header | `kx-section-header` |
| Cards | `kx-card` (default, feature, plain, **cover**) · `kx-service-card` (recorte) |
| Faixa horizontal | `kx-service-rail` |
| Botões | `[kxButton]`: primary, accent, ghost, ghost-inverse, link · sm/md/lg · loading |
| Formulários | estilos em `contact.page.scss` (campo, erro, resumo, alerta) |
| FAQ | `kx-accordion` (pronto; nenhuma página usa ainda, porque as perguntas dependem da cliente) |
| CTA | `kx-cta-band` |
| Navegação interna | `kx-section-nav` |
| Selos, fases, números, etiquetas | `.sn-seals`, `.sn-phase`, `.sn-stat`, `.sn-tags` (`_patterns.scss`) |
| Conteúdo pendente | `.sn-pending` (mensagem honesta, nunca texto falso) |

## Imagens
Todas as ilustrações são **SVGs próprios** (`public/images/*.svg`) feitos com a paleta da marca (a de estrutura full-service foi redesenhada para o tema escuro): sala de cinema, focus group, estações CATI, estrutura full-service e pesquisa aberta. Não há foto de banco nem imagem de terceiros. O logo branco com fundo transparente foi extraído do PNG original. **Pendente:** logo vetorial oficial.
