# COMPONENTS, Catálogo

## Biblioteca `kalixto-ui` (portátil)

### Configuração
```ts
provideKalixtoUi({
  config: { siteName, siteUrl, nav: KxNavItem[], footer: KxFooterColumn[], whatsapp: { phone, messageKey } },
  i18n: { defaultLang, languages: KxLanguage[], dictionaries, storageKey? },
  pages: KxPage[],
  motion?: { stagger?, threshold?, rootMargin?, once?, parallaxMax?, counterDuration?, effects?: {...} },
})
```

### Layout
| Seletor | Entradas | Slots | Observações |
|---|---|---|---|
| `kx-header` | `floating` (pílula), `navLabelKey`, `menuLabelKey`, `closeLabelKey`, `langLabelKey` | `[kxHeaderLogo]`, `[kxHeaderActions]`, `[kxHeaderMobileFoot]` | Lê `config.nav`. Variáveis: `--kx-header-bg/fg/dd-bg` |
| `kx-footer` | `wordmark` | `[kxFooterBrand]`, `[kxFooterAside]`, `[kxFooterLegal]` | Lê `config.footer` |
| `kx-whatsapp-fab` | `labelKey`, `ariaKey` |, | Some quando não há número configurado |
| `kx-scroll-progress` |, |, | Decorativo (`aria-hidden`) |

### UI
| Seletor | Entradas principais |
|---|---|
| `[kxButton]` | `kxButton` (primary, accent, ghost, ghost-inverse, link), `kxSize` (sm, md, lg), `kxBlock`, `kxLoading` |
| `kx-card` | `title`*, `text`, `eyebrow`, `icon`, `image`, `imageAlt`, `link` / `fragment` / `href`, `cta`, `variant` (default, feature, plain, cover) |
| `kx-service-card` | `title`*, `text`, `icon`, `eyebrow`, `link` / `fragment` / `href`, `active`. Variáveis: `--kx-svc-bg`, `--kx-svc-active-bg`, `--kx-svc-active-fg`, `--kx-notch-bg` |
| `kx-service-rail` | `title`*, `eyebrow`, `lead`, `prevLabel`, `nextLabel`; cards projetados. Variáveis: `--kx-rail-bg`, `--kx-rail-title` |
| `kx-section-header` | `title`*, `eyebrow`, `lead`, `level` (1, 2, 3), `align`, `inverse` |
| `kx-accordion` | `items`* (`{question, answer}[]`), `multiple` |
| `kx-chapter` | `title`*, `eyebrow`, `text`, `tone` (brand, accent, deep); conteúdo projetado no círculo. Variável: `--kx-chapter-tone` |
| `kx-sticky-steps` | `steps`* (`{label, title, text, bullets?}[]`); conteúdo projetado na coluna presa |
| `kx-section-nav` | `links`* (`{id, label}[]`), `label` |
| `kx-cta-band` | `title`*, `text`; ações projetadas |
| `kx-icon` | `name`*, `size`, `stroke`, `label` (vazio = decorativo). Lista em `KX_ICON_NAMES` |

### Motion (diretivas)
| Diretiva | Entradas |
|---|---|
| `[kxReveal]` | efeito (fade-in, fade-up, fade-down, slide-left, slide-right, scale-in, image, section), `kxRevealDelay` |
| `[kxStagger]` | intervalo em ms (opcional) |
| `[kxSplitText]` | texto*, `kxSplitDelay` |
| `[kxParallax]` | `kxParallaxSpeed` (0.05 a 0.3) |
| `[kxCountUp]` | valor*, `kxCountFrom`, `kxCountLocale`, `kxCountPlain` |

### i18n e SEO
| Item | Uso |
|---|---|
| `kxT` (pipe) | `{{ 'chave' \| kxT }}` ou `{{ 'chave' \| kxT: { n: 3 } }}` |
| `kxGet` (pipe) | listas e objetos do dicionário |
| `kxPath` (pipe) | `[routerLink]="'contact' \| kxPath"` → `/contato` ou `/en/contact` |
| `KxI18nService` | `lang()`, `language()`, `t()`, `get()`, `path()`, `switchTo()` |
| `kx-lang-switch` | seletor PT/EN (`aria-pressed`) |
| `kxLocalizedRoutes(pages, i18n, extra)` | gera as rotas de todos os idiomas |
| `KxSeoService` | iniciado automaticamente |
| `kxWhatsAppUrl(phone, text)` | monta o link `wa.me` |

## App `sinergia-site`
| Item | Papel |
|---|---|
| `sn-page-hero` | Topo das páginas internas (breadcrumb, H1 com Text Reveal, imagem com reveal e parallax) |
| `sn-contact-channels` | E-mail, telefone, WhatsApp e endereços: **só os configurados**; em desenvolvimento, avisa o que falta |
| `sn-signup-link` | Botão "Cadastrar como participante": URL do sistema, quando houver, ou Contato com `?assunto=participante` |
| `ContactService` | POST JSON para `contactEndpoint`; sem endpoint, lança `ContactNotConfiguredError` |
| `OpenResearchService` | Lê o JSON de pesquisas e filtra públicas e abertas |
| `ADMIN_AUTH` / `ExternalAdminAuth` / `adminGuard` | Acesso interno pelo sistema existente; guard pronto para rotas futuras |

## kx-video-bg

Vídeo de fundo decorativo para heros.

| Input | Tipo | Descrição |
|---|---|---|
| `sources` | `KxVideoSource[]` (`src`, `type`, `media?`) | Fontes em ordem de preferência; `media` escolhe versão leve no celular |
| `poster` | `string` | Capa exibida antes de tocar e quando o movimento está reduzido |
| `playLabel` / `pauseLabel` | `string` | Rótulos acessíveis do botão |

Comportamento: mudo, em loop, `playsinline`, `preload="metadata"`, `aria-hidden`. Pausa fora da tela (IntersectionObserver do `KxMotionService`). Não toca com `prefers-reduced-motion`, Save-Data ou rede 2G. Botão de pausar/retomar sempre visível (WCAG 2.2.2). Posição do enquadramento por `--kx-video-position`.
