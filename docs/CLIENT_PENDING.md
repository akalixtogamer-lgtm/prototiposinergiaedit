# CLIENT_PENDING, Informações que dependem da Sinergia

Nada abaixo foi inventado. Enquanto não chegar, o site **esconde** o item em produção e o mostra marcado como **PENDENTE** em desenvolvimento (`npm start`).

## Contato e canais, `projects/sinergia-site/src/app/core/config/site.config.ts`
| Item | Campo | Efeito enquanto vazio |
|---|---|---|
| E-mail comercial oficial | `contact.email` | Não aparece em Contato nem no footer |
| Telefone oficial | `contact.phone` | Idem |
| Endereço(s) (rótulo PT/EN, linhas, link do mapa) | `contact.addresses[]` | Idem |
| Número oficial do WhatsApp (DDI + DDD, só dígitos) | `whatsapp.phone` | **O botão flutuante não aparece** |
| Mensagem inicial do WhatsApp (revisar) | `whatsapp.message` em `pt.ts`/`en.ts` | Texto provisório já escrito |
| Destino do formulário de contato | `integrations.contactEndpoint` | O envio mostra "temporariamente indisponível" (nunca um falso sucesso) |
| Domínio definitivo | `siteUrl` | canonical/hreflang usam o endereço atual do navegador |

## Integrações com o sistema da Sinergia
| Item | Campo | Efeito enquanto vazio |
|---|---|---|
| URL de cadastro de participante do sistema | `integrations.participantSignupUrl` | Os botões "Cadastrar como participante" levam a **Contato** com o assunto "Pesquisa aberta / participante" já marcado |
| URL de entrada do sistema administrativo | `integrations.adminUrl` | A página Acesso interno avisa que o endereço não está configurado |
| (Futuro) API de sessão do sistema | `ADMIN_AUTH` em `core/guards/admin.guard.ts` | Necessária só se o site ganhar rotas administrativas próprias |

## Conteúdo, `core/i18n/pt.ts` e `core/i18n/en.ts`
| Item | Onde | Efeito enquanto vazio |
|---|---|---|
| **Metodologias PITC e PATC**: nome, o que é, objetivos e como funciona | `services.methods.items` | Mensagem "descrição sendo preparada" + CTA de especialista |
| **Estrutura das estações CATI**: posições, horários, capacidade, cidades, supervisão | `cati.structure` | Mensagem "detalhes sendo confirmados" |
| Confirmar que "CAT" no protótipo = "CATI" do mapa e que Ad Hoc / B2B / Tracking são as pesquisas feitas nas estações | `cati.offer` | Hoje usa os textos da página "CAT" aprovada |
| Experiência internacional: estúdios, países ou projetos que **podem** ser citados | `company.international` | Hoje usa só o que o protótipo afirma (unidade nacional/internacional, fornecedor homologado, ICC/ESOMAR) |
| Clientes e cases autorizados |, (não há seção) | Nenhum cliente é citado |
| Números adicionais (ex.: nº de entrevistas/ano, painel) | `home.stats` | Só os indicadores comprovados: 1986, 40 anos, 3 fases, 100% interno |
| Perguntas frequentes (FAQ) |, | `kx-accordion` está pronto para receber |
| Revisão do inglês por alguém da Sinergia | `en.ts` | Tradução feita a partir do PT aprovado |
| Textos de focus group (marca d'água, captura bloqueada): confirmar que podem ficar no site institucional | `services.focus` | Vieram da página pública "Focus group online" do protótipo |

## Pesquisas abertas, `projects/sinergia-site/public/data/open-research.json`
- Hoje está `[]` → a página mostra "Nenhuma pesquisa aberta no momento" + cadastro.
- Formato de cada item em `docs/open-research.example.json`. Só entram itens com `"visibility": "public"` e `"status": "open"` ou `"soon"`.
- Definir **quem publica** e como (editar o JSON, ou API do sistema; ver FUTURE_IMPROVEMENTS).

## Marca e documentos
| Item | Observação |
|---|---|
| Logo vetorial (SVG) oficial | Hoje: PNG 399×180 do protótipo, com versão branca de fundo transparente extraída automaticamente |
| Favicon oficial | Hoje: ícone provisório desenhado a partir do logo |
| Política de privacidade (LGPD) | Não há link no footer porque a página não existe. Necessária antes do lançamento (o formulário coleta dados) |
| Fotos institucionais autorizadas | Hoje só ilustrações SVG próprias |

## Vídeo do hero

- Confirmar a origem e a licença de uso do vídeo do hero (fornecido pelo Wallace, arquivo "Untitled Scene").
- No Figma, a capa do vídeo (componente "Imagem/Hero · sala de cinema") está comprimida (960px). Para trocar pela versão em alta, substitua o preenchimento de imagem pelo arquivo `public/video/hero-cinema-poster.jpg`.

## Selos e certificações (retirados até confirmação)

Os selos "Membro fundador da ANEP", "Código ICC/ESOMAR", "Conforme a LGPD" e "Desde 1986" vinham do protótipo do sistema e não foram confirmados em fonte pública, então saíram do site e do Figma (hero da Home, A Empresa, Cinema, Contato, rodapé e diferenciais de CATI).

- Para voltar: preencher `common.seals` em `core/i18n/pt.ts` e `en.ts`, os blocos reaparecem sozinhos onde existiam.
- Confirmar também o ano de fundação (1986), que segue no texto e nos números da Home/Empresa.
- O aviso de consentimento do formulário continua citando a LGPD (é uma obrigação legal do formulário, não um selo).
