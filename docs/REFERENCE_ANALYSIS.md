# REFERENCE_ANALYSIS, Engenharia reversa do Flim.ai

Inspeção feita em 17/11/2026 no navegador (painel do Claude Desktop), em 1440×900 e 375×812, nas páginas `/`, `/database`, `/search-engine`, `/ai` e `/workflow`. Além das capturas de tela, li o DOM, os estilos computados e a lista de `ScrollTrigger` ativos via JavaScript.

O Flim.ai serviu como **benchmark de experiência**. Nada foi copiado: código, textos, imagens, marca, fontes (Swizzy, PP Neue Montreal Mono) e cores ficaram de fora.

Legenda de confiança: **[C]** confirmado na inspeção · **[H]** hipótese, não confirmada.

---

## 1. Estrutura de navegação observada
- [C] Menu desktop: `HOME · PRODUCT ▸ · PRICING · FLIM FOR TEAMS · BLOG ▸`, com `LOG-IN` e `SIGN-UP` à direita, tudo em fonte mono e caixa alta.
- [C] `PRODUCT` abre um dropdown escuro e compacto com `Database / Search / AI / Workflow`. A abertura é **por hover**; a seta (`nav-link-icon-dropdown`) indica que há submenu.
- [C] Mobile: um botão `MENU` abre um painel em tela cheia com links em tipografia grande (Home, Product ˅, Pricing, Flim for Teams, Blog ˅) e submenus em acordeão.
- [C] O botão mobile **não tem** `aria-expanded` nem `aria-label`. É uma lacuna de acessibilidade que **não** repetimos.

## 2. Hierarquia das páginas
- [C] Home: hero → "What is Flim" (horizontal fixado) → banco de dados com "física" → capítulos (`title-section`) para AI Tools e Workflow → seções de interface → footer.
- [C] Páginas internas (`/database`, `/search-engine`, `/ai`, `/workflow`): hero centralizado → `bento-wrapper` / `focus-wrapper` (blocos de destaque) → newsletter com faixa colorida → **FAQ** → footer.

## 3. Componentes identificados
Header fixo, dropdown, painel mobile, hero, barra de busca fixa, cards com imagens, capítulo (`title-section`) com painel colorido e círculo, seções "interface" com janelas simuladas, newsletter, FAQ em acordeão, footer em colunas com marca gigante, loader e cursor customizado.

## 4. Comportamento do header
- [C] `position: fixed`, 58px de altura, três camadas (`navbar`, `navbar-normal`, `navbar-difference`).
- [C] Topo com degradê/fade branco sobre o conteúdo. Sobre seções escuras, o header continua legível.
- [H] A variante `navbar-difference` sugere troca de esquema conforme a seção. Não encontrei `mix-blend-mode` ativo nos filhos.

## 5. Comportamento do scroll
- [C] **Lenis** (smooth scroll por JS; o `<html>` recebe a classe `lenis`).
- [C] **GSAP 3.15 + ScrollTrigger**, com 84 gatilhos na home. A maior parte são reveals de texto (`start: top 90%`, `toggleActions: play`).
- [C] `intro-horizontal-block`: **pin + scrub** (`start: top top`, `end: bottom bottom`, `scrub: 1`) com `xPercent`, ou seja, rolagem horizontal presa.
- [C] `what-is-flim-block`: `opacity` + `scale` com stagger.
- [C] `title-section`: gatilhos `top 70% → bottom 90%` (entrada) e `top bottom → bottom top` (progresso).
- [C] Lottie animado por scroll (`top 70% → top 30%`).
- [C] Footer: `footer-logo-i-door` com `rotationY` em scrub até o fim da página (a "porta" no i do logo).
- [C] **No mobile, nenhum pin fica ativo** (`pinCount = 0` em 375px).

## 6. Animações identificadas
- [C] **SplitText**: títulos quebrados em palavras com máscara (`split-word-mask` > `split-word`), que sobem em sequência.
- [C] Plugins carregados: Flip, Inertia, Draggable (elementos arrastáveis no banco de dados) e Lottie.
- [C] Pílulas e formas soltas caem e se acomodam na seção do banco de dados ("intro-physics-container").
- [C] Loader em tela cheia na entrada.

## 7. Interações dos cards
- [C] Cards de categoria com imagens e cabeçalho em fonte mono, em grid bento.
- [H] Zoom e troca de imagem no hover, observados visualmente mas não medidos.

## 8. Comportamento dos botões
- [C] Botão primário: fundo `#141414`, raio de 8px, padding `8px 24px`, `transition: all`.
- [C] Botões entram com reveal (gatilho próprio por botão).

## 9. Responsividade
- [C] Breakpoints do Webflow: 991, 767 e 479px, além de 1440px (min), mais regras por altura (`max-height: 576px`).
- [C] Versões mobile próprias de imagens e Lottie (`platform-image-mobile`, `lottie-container-mobile`).

## 10. Comportamento do footer
- [C] Cinco colunas: Product, (casos de uso), Resources, About e Social. Abaixo, o copyright e uma **marca gigante** ocupando a largura, com a animação da "porta".

## 11. Tecnologias identificáveis
Webflow (CMS e runtime), jQuery 3.5, GSAP 3.15 (ScrollTrigger, Flip, SplitText, Inertia, Draggable), Lenis 1.3, Lottie 5.13, Lucide (ícones), CookieYes, GTM.

## 12. Efeitos que podem ser reproduzidos
Reveal de títulos por palavra, fade/slide no scroll, stagger em grids, dropdown por hover, menu mobile em tela cheia, FAQ em acordeão, capítulo com painel colorido, marca gigante no footer e header fixo com estado de rolagem.

## 13. Efeitos que precisam ser adaptados
| Efeito no Flim | Por que adaptar | Como ficou no site Sinergia |
|---|---|---|
| Lenis (smooth scroll por JS) | Sequestra a rolagem nativa, pesa e atrapalha leitor de tela | `scroll-behavior: smooth` nativo, desligado em reduced motion |
| Pin + rolagem horizontal | Difícil em teclado e mobile (o próprio Flim desliga no mobile) | **Sticky Steps**: coluna presa e etapas rolando normalmente |
| Física das pílulas, Draggable | Decorativo, caro e sem relação com o conteúdo | Não reproduzido |
| Loader em tela cheia | Atrasa o conteúdo (piora LCP) | Não reproduzido |
| Cursor customizado | Quebra a expectativa do usuário | Não reproduzido |
| GSAP/SplitText (dependências) | ~100 kB extras | IntersectionObserver + CSS (zero dependências) |
| "Porta" 3D no logo do footer | Depende da marca do Flim | Marca "Sinergia" vazada com revelação |
| Paleta, fontes e estética | Identidade de outro produto | Identidade Sinergia (verde 950, areia, Source Serif 4 + IBM Plex) |

## 14. Limitações da inspeção
- O banner de cookies foi recusado e a inspeção seguiu sem rastreamento; o estado logado não foi visto.
- Durações e easings exatos das timelines GSAP não ficam expostos de forma completa: registrei gatilhos e propriedades, não curvas.
- O navegador usado foi o painel do app (Chromium) com viewport emulado; Safari e Firefox não foram testados na referência.
- Os comportamentos de hover dos cards foram observados visualmente, sem medição (marcados [H]).

---

## Tabela de comportamentos

| Elemento | Comportamento observado | Efeito | Gatilho | Adaptação |
|---|---|---|---|---|
| Header | Fixo, 58px, fade no topo | Sticky header | Sempre | Fixo, 72→60px ao rolar 24px, sombra |
| Menu "Product" | Dropdown escuro | Dropdown Transition | Hover | Hover **+ clique + teclado (↓, Esc)**, `aria-expanded` |
| Menu mobile | Tela cheia, tipografia grande, acordeão | Mobile Menu Transition | Clique em MENU | Igual, com cortina `clip-path`, foco preso, Esc, `aria-expanded` |
| Títulos | Palavras sobem de máscaras | Text Reveal (SplitText) | `top 90%` | Diretiva `kxSplitText` (CSS + IO), texto completo no `aria-label` |
| Blocos de texto/botões | Entram com fade | Fade/Slide Up | `top 90%` | `kxReveal` (8 efeitos centralizados) |
| "What is Flim" | Rolagem horizontal presa | Pin + scrub | `top top → bottom bottom` | `kx-sticky-steps` (sem sequestrar o scroll) |
| title-section | Painel colorido + círculo + título | Section Reveal | `top 70%` | `kx-chapter`: círculo cresce com a rolagem (scrub leve) |
| Grids | Itens em sequência | Stagger | Entrada no viewport | `kxStagger` (90ms) |
| Cards | Imagem e destaque no hover | Image Zoom / Card Lift | Hover | `kx-card`: lift, zoom, overlay, seta desliza |
| FAQ | Abre/fecha | Accordion (`grid-template-rows .4s`) | Clique | `kx-accordion` (mesma técnica, ARIA completo) |
| Footer | Colunas + marca gigante + "porta" 3D | Scrub no logo | `top 90% → max` | Colunas + "Sinergia" vazada com Image Reveal |
| Scroll da página | Lenis | Smooth scroll | Wheel | Nativo + barra de progresso (`kx-scroll-progress`) |
| Troca de página | Recarregamento (Webflow) |, |, | View Transitions (fade), header fixo preservado |

---

# Parte 2, Referências da cliente (tema escuro) · 17/11/2026

Inspecionadas no navegador em 1440×900: estilos computados lidos via JavaScript e capturas de tela.

| Referência | Observado [C] | Aplicado no site |
|---|---|---|
| **Cinemetrics Research** (app.cinemetricsresearch.com) | Fundo `#0a0a0f`; destaque dourado `#c9a84c` em CTA pílula; títulos em serif (Playfair) + corpo em Inter; cards `#16161f` com borda `rgba(255,255,255,.06)` e raio de 12px; passos numerados | Fundo escuro em camadas; **areia `#edb161` como "dourado"** dos CTAs; serif mantida (Source Serif 4); cards com borda de 9% branco |
| **Screen Engine / Virtuworks** | Preto puro, linha de produtos em logotipos neon, vídeo central, clima de sala de projeção | Hero com brilhos discretos (areia e verde) sobre quadriculado; ilustração de sala de cinema |
| **iScreeningRoom** | Hero azul com brilho cinematográfico e rolo de filme; seções Security / Precision / Intelligence; FAQ; relatórios | Brilho radial no hero; reforço de "segurança e sigilo" (já presente no conteúdo aprovado) |
| **Datatainment** | Preto; **menu em pílula** com borda; **cards de serviço com imagem de fundo** e degradê escuro, ícone + título + descrição embaixo | **Header flutuante em pílula** translúcida (`floating`); variante **`cover`** do `kx-card` (Serviços › Cinema e CATI) |
| **Card Addifico** (imagem enviada) | Fundo verde-grafite; título gigante "Services"; cards escuros numa faixa horizontal que sangra nas bordas; ícone de traço verde-menta; seta ↗; **card ativo verde-claro com recorte (aba) no canto superior direito** e descrição visível | **`kx-service-rail` + `kx-service-card`**: mesma anatomia, verde-menta Sinergia (`#98d7aa`), recorte com cantos arredondados, ativo por hover **e foco de teclado**, botões ←/→, scroll-snap |

O que **não** foi adotado: o preto puro (a Sinergia fica num verde quase preto, `#090e0a`, para manter a identidade), as fontes, logos e imagens das referências, e fotos de banco.
