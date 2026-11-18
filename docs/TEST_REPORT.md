# TEST_REPORT, Relatório de testes

Data: 17/11/2026 · Build de produção (`ng build`) servido com fallback de SPA · Chrome headless (Playwright).
Scripts: `tests/e2e.py` (funcional), `tests/axe.py` (acessibilidade) e `tests/serve.py` (servidor). Ver "Como rodar" no fim.

## Resumo
| Bateria | Resultado |
|---|---|
| Build de produção | OK, 106 kB transferidos na carga inicial; cada página é um chunk lazy de 1,5 a 14 kB |
| Build da biblioteca (`ng build kalixto-ui`) | OK (ng-packagr, modo parcial) |
| Testes funcionais | **108/108** (93 iniciais + 9 do tema escuro + 6 do hero em vídeo) |
| Acessibilidade (axe-core, WCAG 2.0/2.1/2.2 A+AA, 10 páginas) | **0 violações** |
| Scroll horizontal indesejado (320, 375, 768, 1024, 1440, 1920 px) | Nenhum |
| Erros de JavaScript no console | Nenhum |

## Rotas (16 rotas × 3 verificações = 48 testes)
Todas as rotas PT e EN abrem a página certa (nenhuma cai no 404), com `<html lang>` correto (`pt-BR` / `en`) e `hreflang` pt-BR, en e x-default:
`/ · /empresa · /servicos · /servicos/cinema · /servicos/estacoes-cati · /pesquisa-aberta · /contato · /acesso-interno`
`/en · /en/company · /en/services · /en/services/cinema · /en/services/cati-stations · /en/open-research · /en/contact · /en/internal-access`

## Demais testes
| Resultado | Teste | Detalhe |
|---|---|---|
| PASSOU | 404 com noindex | noindex, nofollow |
| PASSOU | Acesso interno com noindex | noindex, nofollow |
| PASSOU | Links internos válidos (16 destinos) | [] |
| PASSOU | Nenhum link vazio (#) | [] |
| PASSOU | Links externos | nenhum (prototipo removido) |
| PASSOU | Dropdown abre no hover |  |
| PASSOU | Dropdown fecha ao sair |  |
| PASSOU | Dropdown: ↓ abre e foca o 1º item |  |
| PASSOU | Dropdown: Esc fecha |  |
| PASSOU | Dropdown abre no clique |  |
| PASSOU | Item do dropdown navega com âncora | http://127.0.0.1:4300/empresa#areas |
| PASSOU | Âncora para abaixo do header fixo | top=88 |
| PASSOU | Indicador de seção ativa | ['Áreas de atuação'] |
| PASSOU | Item ativo no menu (A Empresa) | A Empresa |
| PASSOU | Header compacta ao rolar | 72px → 60px |
| PASSOU | PT→EN mantém a página e a âncora | http://127.0.0.1:4300/en/services#focus-group |
| PASSOU | Menu traduzido | Company / Services / Open research / Contact |
| PASSOU | Footer traduzido |  |
| PASSOU | EN→PT volta para o slug em português | http://127.0.0.1:4300/servicos#focus-group |
| PASSOU | Seletor indica idioma ativo (aria-pressed) |  |
| PASSOU | Envio vazio mostra resumo de erros | 5 erros |
| PASSOU | Foco vai para o resumo de erros |  |
| PASSOU | Campo inválido com aria-invalid + aria-describedby |  |
| PASSOU | Validação de e-mail | Digite um e-mail válido, como nome@empresa.com.br. |
| PASSOU | Validação de telefone |  |
| PASSOU | Sem endpoint: erro honesto, sem falso sucesso | Não foi possível enviar  O envio pelo site está temporariamente indisponível. Use um dos c |
| PASSOU | ?assunto=participante pré-seleciona o assunto |  |
| PASSOU | Pesquisa aberta: estado vazio (sem dados fictícios) |  |
| PASSOU | CTA de cadastro leva a destino válido | /contato?assunto=participante |
| PASSOU | Link de acesso interno no footer |  |
| PASSOU | Acesso interno fora do menu principal |  |
| PASSOU | WhatsApp oculto sem número oficial |  |
| PASSOU | Mobile: botão MENU visível |  |
| PASSOU | Mobile: menu abre (aria-expanded) |  |
| PASSOU | Mobile: rolagem travada |  |
| PASSOU | Mobile: submenu em acordeão |  |
| PASSOU | Mobile: Esc fecha o menu |  |
| PASSOU | Mobile: link navega e fecha o menu | http://127.0.0.1:4300/contato |
| PASSOU | Sem scroll horizontal em 320/375/768/1024/1440/1920 |  |
| PASSOU | Reduced motion: conteúdo visível sem animar | 1 |
| PASSOU | Reduced motion: parallax desligado | none |
| PASSOU | Tab 1 foca "Pular para o conteúdo" |  |
| PASSOU | Skip link move o foco para o conteúdo |  |
| PASSOU | Sem erros de JavaScript no console | [] |

## Rodada 2, tema escuro (17/11/2026)
- Testes novos: 7 cards na faixa; botão "anterior" desabilitado no início; "próximo" rola; "anterior" habilita; card ativo por hover (recorte + descrição); card ativo por foco de teclado; destino do card; header em pílula; tema escuro aplicado.
- axe encontrou **contraste 1.3:1** nas etiquetas de categoria (texto verde 900 sobre fundo escuro). Corrigido para menta; voltou a **0 violações**.
- Cards capa: o texto da CATI disputava com a ilustração. Degradê reforçado na base e card mais alto (440px).

## Bugs encontrados e corrigidos durante os testes
1. **Título quebrado palavra por palavra**: a classe da diretiva de Text Reveal (`kx-split`) colidia com o utilitário de layout `.kx-split`. Renomeada para `kx-split-text`.
2. **Dropdown fechava ao clicar depois do hover**: o hover abria e o clique alternava. Agora o clique logo após o hover confirma a abertura.
3. **Foco do teclado não chegava ao dropdown, ao resumo de erros e ao resultado do envio**: o foco era aplicado antes da renderização (Angular zoneless). Passou a ser feito no frame seguinte.
4. **axe: `label-content-name-mismatch`** no seletor PT/EN: o `aria-label` "Português" não continha o texto visível "PT". Agora o botão lê "PT Português".
5. **axe: contraste 2.5:1** nas etapas inativas do focus group (opacidade 0.55). A opacidade foi trocada por borda tracejada; o texto mantém o contraste integral.
6. Faixa escura sob a imagem do hero no mobile (o parallax ultrapassava a folga da imagem). A folga foi aumentada (`scale 1.25`).

## Inspeção visual
Capturas de página inteira em 1440px (todas as páginas), 375px (Home e Contato) e 320px (Serviços), conferidas manualmente: hierarquia, quebras, imagens, cards, formulário e footer reorganizados por largura, não apenas reduzidos.

## Não testado / limitações
- Safari (WebKit) e Firefox: o motion usa APIs padrão (IntersectionObserver, `clip-path`, `color-mix`), mas não foi rodado nesses motores. As View Transitions são ignoradas onde não há suporte.
- Leitor de tela real (NVDA, VoiceOver): coberto só por regras automáticas e ARIA; vale uma rodada manual.
- Envio real do formulário: depende do endpoint (pendente). O teste confirma que, sem endpoint, o site **não** finge sucesso.
- Lighthouse/Core Web Vitals em hospedagem real: pendente de domínio.

## Como rodar
```bash
npm run build
python3 tests/serve.py dist/sinergia-site/browser      # http://127.0.0.1:4300
pip install playwright && playwright install chromium   # se ainda não tiver
python3 tests/e2e.py
npm i -D axe-core && python3 tests/axe.py
```

## Hero em vídeo (kx-video-bg)

| Resultado | Teste |
|---|---|
| PASSOU | Vídeo toca automaticamente (WebM no desktop) e sem som |
| PASSOU | Em telas ≤ 767px carrega a versão 960px (MP4) |
| PASSOU | Botão "Pausar vídeo" pausa e retoma; `aria-pressed` acompanha o estado |
| PASSOU | Vídeo pausa sozinho quando sai da tela |
| PASSOU | Com `prefers-reduced-motion` o vídeo não toca e fica a capa (poster) |
| PASSOU | `<video>` com `aria-hidden` e conteúdo do hero legível sobre a imagem (axe: 0 violações) |

Obs.: os testes esperam o evento `load` (com o vídeo em loop a rede nunca fica ociosa).
