# FUTURE_IMPROVEMENTS, Melhorias futuras

## Alta prioridade (antes do lançamento)
1. **Endpoint do formulário de contato**: um backend próprio (ou serviço de formulários) com proteção antispam (honeypot + rate limit, ou CAPTCHA acessível) e e-mail para a equipe.
2. **Página de Política de Privacidade (LGPD)** com link no footer e no consentimento do formulário.
3. **Pré-renderização (SSG)** com `@angular/ssr` (`outputMode: 'static'`): HTML pronto por rota e idioma, para SEO e LCP. A arquitetura já está pronta (rotas estáticas geradas por `pages.ts`).
4. **sitemap.xml e robots.txt** gerados a partir de `PAGES` × idiomas (com `/acesso-interno` excluído).
5. Preencher as pendências de `CLIENT_PENDING.md`.

## Médio prazo
6. **Pesquisas abertas via API do sistema** em vez do JSON: trocar a fonte em `OpenResearchService.load()`; a tela não muda.
7. **CMS headless** (ou o próprio sistema) para a equipe editar textos sem deploy. Os dicionários `pt.ts`/`en.ts` já isolam todo o conteúdo.
8. **Sessão administrativa real**: quando o sistema expuser uma API de sessão (cookie HttpOnly), implementar `AdminAuthAdapter` e, se fizer sentido, um atalho "Ir para o painel" para quem já está logado.
9. FAQ em Serviços e Pesquisa aberta (`kx-accordion` pronto).
10. Fotos institucionais autorizadas no lugar de parte das ilustrações, em AVIF/WebP com `srcset`.
11. Analytics com consentimento (banner de cookies conforme a LGPD), só depois da política de privacidade.

## Biblioteca kalixto-ui
12. Publicar a lib num registro privado (GitHub Packages) para instalar com `npm i @kalixto/ui` nos outros projetos.
13. Storybook ou página "playground" com todos os componentes e efeitos.
14. Testes unitários (Vitest já está configurado no workspace) para i18n, rotas localizadas e diretivas de motion.
15. Novos efeitos opcionais: marquee de logos, horizontal scroll opcional (com fallback vertical), cursor de destaque desligável.
16. Tema escuro (os tokens já permitem; falta mapear a marca).
