# PORTABILITY, Como levar a experiência para outro projeto Angular

Tudo o que é reaproveitável está em **`projects/kalixto-ui`**. Nada ali conhece a Sinergia: cores, textos, menus, páginas e número de WhatsApp entram por configuração.

O que você leva: tokens, botões, sistema de motion (reveal, stagger, text reveal, parallax, contador, progresso), header com dropdown e menu mobile, footer, WhatsApp flutuante, i18n por URL, SEO/hreflang, cards, section header, acordeão, capítulo, sticky steps, section nav e CTA band.

Requisito: Angular 22 ou mais recente (standalone + signals). Nenhuma outra dependência.

---

## Caminho A, Copiar o código-fonte (mais simples, permite editar)

1. Copie a pasta `projects/kalixto-ui/src` para o outro projeto, por exemplo em `src/kalixto-ui/`.
2. No `tsconfig.json` do outro projeto:
   ```json
   "compilerOptions": { "paths": { "kalixto-ui": ["./src/kalixto-ui/public-api.ts"] } }
   ```
3. No `angular.json`, em `build.options`:
   ```json
   "stylePreprocessorOptions": { "includePaths": ["src/kalixto-ui/styles"] }
   ```
4. No `styles.scss` global:
   ```scss
   @use 'kx';          // tokens + base + botões + motion
   :root {             // identidade do novo projeto
     --kx-color-brand: #…;  --kx-color-brand-deep: #…;  --kx-color-accent: #…;
     --kx-font-display: '…';  --kx-font-body: '…';
   }
   ```
5. No `app.config.ts`:
   ```ts
   provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
   provideKalixtoUi({ config, i18n, pages }),
   ```
6. Crie para o projeto novo os equivalentes de `core/config/pages.ts`, `navigation.ts` e `core/i18n/pt.ts` / `en.ts` (copie os da Sinergia como modelo e troque o conteúdo), e gere as rotas:
   ```ts
   export const routes = kxLocalizedRoutes(PAGES, I18N, [{ path: '**', loadComponent: … }]);
   ```
7. No template raiz:
   ```html
   <kx-scroll-progress />
   <kx-header> <a kxHeaderLogo …>…</a> </kx-header>
   <main id="conteudo" tabindex="-1" style="padding-top: var(--kx-header-h)"><router-outlet /></main>
   <kx-footer wordmark="Marca"> … </kx-footer>
   <kx-whatsapp-fab />
   ```

## Caminho B, Usar como pacote (melhor para vários projetos)

1. Neste workspace: `npx ng build kalixto-ui` → gera `dist/kalixto-ui` (com `styles/` incluído).
2. Para instalar localmente: `cd dist/kalixto-ui && npm pack` → `kalixto-ui-0.0.1.tgz`. No outro projeto: `npm i ../caminho/kalixto-ui-0.0.1.tgz`. Ou publique no GitHub Packages.
3. Estilos: `"stylePreprocessorOptions": { "includePaths": ["node_modules/kalixto-ui/styles"] }` + `@use 'kx';`.
4. Siga os passos 5 a 7 do caminho A.

Para atualizar: mude a versão em `projects/kalixto-ui/package.json`, rode o build e reinstale.

---

## O que é do projeto (não leve)
`projects/sinergia-site/src/app/**` (páginas, textos, contatos), `styles/_brand.scss`, `styles/_patterns.scss` e `public/images`. Use-os só como **exemplo** de montagem.

## Ajustes rápidos no projeto novo
| Quero… | Onde |
|---|---|
| Mudar o ritmo de todas as animações | `provideKalixtoUi({ motion: { stagger: 120, effects: { 'fade-up': { duration: 600 } } } })` |
| Desligar repetição/ativar repetição dos reveals | `motion: { once: false }` |
| Outro idioma (ex.: ES) | Adicione um dicionário e `{ code: 'es', prefix: 'es', … }` em `languages`, e os slugs `es` em `pages` |
| Header claro em vez de escuro | `kx-header { --kx-header-bg: #fff; --kx-header-fg: #111; --kx-header-fg-muted: #555; }` |
| Novo ícone | Adicione o path em `lib/icons/icon.component.ts` |
| Menu com submenu | `children: [...]` no item de `nav` |
