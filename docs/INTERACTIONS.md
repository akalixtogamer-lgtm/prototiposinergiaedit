# INTERACTIONS, Efeitos implementados

A configuração fica centralizada em `projects/kalixto-ui/src/lib/motion/motion.config.ts` (números) e em `styles/_motion.scss` (estados visuais). Para mudar o ritmo do site todo, ajuste `KX_MOTION_DEFAULTS` ou passe `motion: {...}` em `provideKalixtoUi()` (`app.config.ts`).

Regras gerais:
- **Um** IntersectionObserver e **um** listener de scroll (passivo, em `requestAnimationFrame`, fora do Angular) para o site inteiro.
- Só `opacity`, `transform` e `clip-path` são animados, então não há reflow nem CLS.
- `prefers-reduced-motion: reduce` desliga reveals, parallax, contadores, a cortina do menu, o flutuar dos chips e as transições de página. **O conteúdo aparece direto.**
- Sem JavaScript, `<noscript>` deixa tudo visível.
- A animação acontece uma vez só (`once: true`): rolar de volta não repete.

## Entrada (`[kxReveal]`)
| Efeito | Duração | Delay | Easing | Gatilho | Inicial → Final | Onde |
|---|---|---|---|---|---|---|
| fade-in | 700ms | 0 (+ `kxRevealDelay`) | ease-out | 12% visível, margem −8% embaixo | opacity 0 → 1 | eyebrows, alguns botões |
| fade-up | 800ms | 0 | ease-out | idem | opacity 0, +32px Y → 0 | parágrafos, cards, selos, números |
| fade-down | 800ms | 0 | ease-out | idem | opacity 0, −32px Y → 0 | disponível |
| slide-left | 900ms | 0 | ease-out | idem | opacity 0, +48px X → 0 | painel de canais (Contato) |
| slide-right | 900ms | 0 | ease-out | idem | opacity 0, −48px X → 0 | disponível |
| scale-in | 700ms | 0 | ease-out | idem | opacity 0, scale .94 → 1 | disponível |
| image (Image Reveal) | 1100ms | 0 | ease-out | idem | recorte 12%/6% + scale 1.06 → sem recorte | imagens dos heros, ilustrações, marca do footer |
| section | 900ms | 0 | ease-out | idem | opacity 0, +64px Y → 0 | disponível |

## Conteúdo
| Efeito | Como funciona | Finalidade | Onde |
|---|---|---|---|
| **Text Reveal** (`[kxSplitText]`) | Cada palavra sobe de uma máscara (`translateY 110% → 0`, 1000ms, +45ms por palavra). O texto inteiro fica no `aria-label` e as palavras são `aria-hidden` | Dar peso aos títulos sem atrasar a leitura | H1 da home e das páginas, títulos de seção, capítulo, faixas de CTA |
| **Stagger** (`[kxStagger]`) | Distribui `--kx-r-delay` de 90ms em 90ms entre os filhos com reveal | Grid entra em sequência, guiando o olhar | Grids de cards, selos, números, fases |
| **Counter** (`[kxCountUp]`) | Conta de `from` até o valor em 1600ms (easeOutQuart). O valor final já está no DOM | Destacar indicadores **reais** | 1986, 40 anos, 3 fases, 100% (Home e Empresa) |
| Flutuar (chips do hero) | `translateY ±6px`, 6s, alternado | Vida discreta na composição | Chips "Fase 1 · Roteiro" e "Fase 3 · Lançamento" |

## Scroll
| Efeito | Como funciona | Finalidade | Onde |
|---|---|---|---|
| Smooth scrolling | `scroll-behavior: smooth` nativo (não sequestra a rolagem) | Âncoras suaves | Global |
| Anchor Scroll | `withInMemoryScrolling` + `ViewportScroller.setOffset([0, 88])` + `scroll-padding-top` | Âncora para abaixo do header fixo | Links com `#fragmento` (menu, footer, section nav) |
| **Parallax** (`[kxParallax]`) | `translateY = −distância_do_centro × speed`, limitado a ±48px | Profundidade discreta | Imagens do hero da home (0.08) e das páginas internas (0.06) |
| **Section Reveal / Capítulo** (`kx-chapter`) | O círculo escala de 0.55 a 1 conforme a seção sobe até o centro da tela (scrub) | Marcar a passagem para uma grande área | Home → "Cinema e audiovisual" |
| **Sticky Content** (`kx-sticky-steps`) | A coluna do título fica presa (`position: sticky`); a etapa mais próxima do centro fica ativa e o indicador cresce | Narrativa de processo sem pin/scrub | Serviços → Focus group (Início → Meio → Fim) |
| **Scroll Progress** (`kx-scroll-progress`) | Barra de 3px em areia no topo, `scaleX = rolagem` | Mostrar quanto da página falta | Global |
| Header compacto | 72px → 60px e sombra após 24px de rolagem | Ganhar espaço sem perder o menu | Global |
| Header em pílula | Barra flutuante a 12px do topo, translúcida com desfoque (72% → 88% de opacidade ao rolar) e borda sutil (ref. Datatainment/Addifico) | Elegância sem esconder o conteúdo | Global |

## Cards de serviço e faixa (referência Addifico)
| Efeito | Detalhe | Onde |
|---|---|---|
| **Card ativo com recorte** (`kx-service-card`) | Em hover ou foco: o fundo vira menta (400ms), o ícone sobe 4px, o **recorte** do canto superior direito cresce a partir do canto (`scale 0 → 1`, 400ms, ease-out) com cantos convexos, a seta ↗ fica dentro dele e a descrição abre (`grid-template-rows 0fr → 1fr`). Em telas de toque a descrição fica sempre visível | Home › Serviços |
| **Faixa horizontal** (`kx-service-rail`) | Rolagem nativa com scroll-snap; botões ←/→ rolam um card (suave, ou direto em reduced motion) e ficam desabilitados nas pontas; a faixa sangra até a borda da tela; entra com slide-left | Home › Serviços |
| Título gigante | "Serviços" em serif (até 144px) com Text Reveal | Home › Serviços |
| **Card capa** (`kx-card variant="cover"`) | Imagem ocupa o card, degradê escuro na base; no hover: lift, zoom da imagem e o ícone fica areia | Serviços › Linhas |

## Hover
| Efeito | Detalhe | Onde |
|---|---|---|
| **Card Lift** | `translateY(-6px)`, sombra média, borda mais forte, 400ms | `kx-card` com link |
| **Image Zoom** | `scale(1.05)`, 700ms | Imagem dos cards (`.kx-hover-zoom`) |
| **Overlay Reveal** | Degradê verde sobe sobre a imagem (opacity 0 → 1) | Cards com imagem |
| Ícone do card | Fundo verde-claro → verde, ícone branco | Cards com ícone e link |
| Seta do CTA | Desliza 6px para a direita | Cards e botões com seta |
| **Button Transition** | O preenchimento sobe da base (`translateY 101% → 0`, 400ms), o texto troca de cor e o `:active` faz `scale(.97)` | Todos os `[kxButton]` |
| Links do footer | Sublinhado cresce da esquerda (`background-size 0 → 100%`) | Footer |
| Links do menu | Traço em areia cresce do centro (40% no hover, 100% no ativo) | Header |
| WhatsApp | Sobe 2px e o rótulo "Fale pelo WhatsApp" expande (≥768px) | Botão flutuante |

## Navegação
| Efeito | Detalhe | Onde |
|---|---|---|
| **Dropdown Transition** | Fade + 8px, 200/400ms. Abre por hover (fecha com 160ms de tolerância), clique ou teclado (↓ foca o 1º item, ↑/↓ percorre, Esc fecha). O clique logo após o hover mantém o menu aberto. Há uma ponte invisível entre botão e menu | "A Empresa", "Serviços" |
| **Mobile Menu Transition** | Cortina `clip-path` (700ms), itens entram com stagger de 50ms, ícone hambúrguer vira X, submenus em acordeão (`grid-template-rows`), foco preso, Esc fecha, rolagem do fundo travada, fecha ao navegar | < 1024px |
| **Active Navigation** | `routerLinkActive` + `aria-current="page"`. O item pai do dropdown fica ativo quando a página-filha está aberta | Header |
| Seção ativa | `kx-section-nav` destaca a seção que passou de 35% da tela (`aria-current="location"`) | Empresa, Serviços |
| Transição de página | View Transitions API: a página sai em fade de 180ms e entra em 360ms com +12px; o header não participa | Toda navegação |
| Troca de idioma | Vai para a mesma página no outro idioma, mantendo a âncora | Seletor PT/EN |

## Formulário (Contato)
| Estado | Comportamento |
|---|---|
| Campo tocado e inválido | Borda vermelha, mensagem com ícone, `aria-invalid` e `aria-describedby` |
| Envio inválido | Resumo de erros no topo (links que focam o campo) recebe o foco |
| Enviando | Botão com spinner (`aria-busy`), desabilitado, texto "Enviando…" |
| Sucesso | Alerta verde (`role=status`) recebe o foco, o formulário some e aparece "Enviar outra mensagem" |
| Erro de rede | Alerta vermelho (`role=alert`) |
| Sem endpoint configurado | Alerta "envio temporariamente indisponível", **nunca** um falso sucesso |

## Hero em vídeo

Home: vídeo `public/video/hero-cinema.{webm,mp4}` (+ `hero-cinema-960.mp4` para celular, capa `hero-cinema-poster.webp`). Sombreamento em gradiente garante contraste do texto. Pausa automática fora da tela; com movimento reduzido fica só a capa; botão Pausar/Retomar no canto superior direito.
