"""Testes funcionais do site Sinergia (Playwright + Chrome). Saída: relatório em texto."""
import asyncio, json
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4300'
R=[]
def ok(name, cond, info=''):
    R.append((('PASSOU' if cond else 'FALHOU'), name, info)); 

ROUTES={'pt':['/','/empresa','/servicos','/servicos/cinema','/servicos/estacoes-cati','/pesquisa-aberta','/contato','/acesso-interno'],
        'en':['/en','/en/company','/en/services','/en/services/cinema','/en/services/cati-stations','/en/open-research','/en/contact','/en/internal-access']}

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page()
        errors=[]
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.on('console', lambda m: errors.append(m.text) if m.type=='error' else None)

        # 1. Rotas, título, lang e hreflang
        for lang, routes in ROUTES.items():
            for r in routes:
                await pg.goto(BASE+r, wait_until='load'); await __import__('asyncio').sleep(0.6)
                h1=(await pg.locator('h1').first.get_attribute('aria-label')) or (await pg.locator('h1').first.inner_text())
                html_lang=await pg.evaluate('document.documentElement.lang')
                title=await pg.title()
                alts=await pg.evaluate("[...document.querySelectorAll('link[rel=alternate]')].map(l=>l.hreflang)")
                is404='não encontrada' in h1.lower() or 'not found' in h1.lower()
                ok(f'Rota {r} abre', not is404, f'h1="{h1[:50]}" title="{title}"')
                ok(f'Rota {r} lang', html_lang==('pt-BR' if lang=='pt' else 'en'), html_lang)
                ok(f'Rota {r} hreflang', set(alts)>={'pt-BR','en','x-default'}, str(alts))
        await pg.goto(BASE+'/rota-inexistente', wait_until='load'); await __import__('asyncio').sleep(0.6)
        ok('404 para rota inexistente', 'não encontrada' in (await pg.locator('h1').inner_text()).lower())
        robots=await pg.evaluate("document.querySelector('meta[name=robots]')?.content")
        ok('404 com noindex', robots and 'noindex' in robots, robots)
        await pg.goto(BASE+'/acesso-interno', wait_until='load'); await __import__('asyncio').sleep(0.6)
        robots=await pg.evaluate("document.querySelector('meta[name=robots]')?.content")
        ok('Acesso interno com noindex', 'noindex' in (robots or ''), robots)

        # 2. Todos os links internos de todas as páginas apontam para rotas existentes
        links=set()
        for r in ROUTES['pt']+ROUTES['en']:
            await pg.goto(BASE+r, wait_until='load'); await __import__('asyncio').sleep(0.6)
            hrefs=await pg.evaluate("[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))")
            links.update(h for h in hrefs if h)
        internal=sorted({h.split('#')[0].split('?')[0] or '/' for h in links if h.startswith('/')})
        bad=[]
        for h in internal:
            await pg.goto(BASE+h, wait_until='load'); await __import__('asyncio').sleep(0.6)
            t=(await pg.locator('h1').first.inner_text()).lower()
            if 'não encontrada' in t or 'not found' in t: bad.append(h)
        ok(f'Links internos válidos ({len(internal)} destinos)', not bad, str(bad))
        empties=[h for h in links if h in ('#','', 'javascript:void(0)')]
        ok('Nenhum link vazio (#)', not empties, str(empties))
        ext=sorted(h for h in links if h.startswith('http'))
        ok('Links externos', True, str(ext) if ext else 'nenhum (prototipo removido)')

        # 3. Dropdown desktop: hover, teclado, Esc
        await pg.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6)
        trig=pg.locator('kx-header .nav .has-dd button').first
        await trig.hover(); await pg.wait_for_timeout(400)
        ok('Dropdown abre no hover', await trig.get_attribute('aria-expanded')=='true')
        await pg.mouse.move(700,600); await pg.wait_for_timeout(500)
        ok('Dropdown fecha ao sair', await trig.get_attribute('aria-expanded')=='false')
        await trig.focus(); await pg.keyboard.press('ArrowDown'); await pg.wait_for_timeout(300)
        focused=await pg.evaluate('document.activeElement.closest(".dd")!==null')
        ok('Dropdown: ↓ abre e foca o 1º item', focused)
        await pg.keyboard.press('ArrowDown')
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
        ok('Dropdown: Esc fecha', await trig.get_attribute('aria-expanded')=='false')
        await trig.click(); await pg.wait_for_timeout(300)
        ok('Dropdown abre no clique', await trig.get_attribute('aria-expanded')=='true')
        await pg.locator('kx-header .dd a').filter(has_text='Áreas de atuação').first.click()
        await pg.wait_for_timeout(1500)
        ok('Item do dropdown navega com âncora', pg.url.endswith('/empresa#areas'), pg.url)
        top=await pg.evaluate("document.getElementById('areas').getBoundingClientRect().top")
        ok('Âncora para abaixo do header fixo', 40 < top < 200, f'top={top:.0f}')
        active=await pg.evaluate("[...document.querySelectorAll('kx-section-nav a.is-active')].map(a=>a.textContent.trim())")
        ok('Indicador de seção ativa', active==['Áreas de atuação'], str(active))
        cur=await pg.evaluate("document.querySelector('kx-header .nav-link.is-active')?.textContent.trim()")
        ok('Item ativo no menu (A Empresa)', cur and 'Empresa' in cur, str(cur))

        # 4. Header compacta no scroll
        h0=await pg.evaluate("document.querySelector('kx-header .inner').offsetHeight")
        await pg.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6); h0=await pg.evaluate("document.querySelector('kx-header .inner').getBoundingClientRect().height")
        await pg.evaluate('window.scrollTo(0,600)'); await pg.wait_for_timeout(700)
        h1=await pg.evaluate("document.querySelector('kx-header .inner').getBoundingClientRect().height")
        ok('Header compacta ao rolar', h1<h0, f'{h0:.0f}px → {h1:.0f}px')

        # 5. Troca de idioma mantém a página e a âncora
        await pg.goto(BASE+'/servicos#focus-group', wait_until='load'); await __import__('asyncio').sleep(0.6)
        await pg.locator('kx-header .tools kx-lang-switch button', has_text='EN').click(); await pg.wait_for_timeout(1200)
        ok('PT→EN mantém a página e a âncora', pg.url.endswith('/en/services#focus-group'), pg.url)
        txt=await pg.locator('kx-header .nav').inner_text()
        ok('Menu traduzido', 'Services' in txt and 'Contact' in txt, txt.replace('\n',' | '))
        foot=await pg.locator('kx-footer').inner_text()
        ok('Footer traduzido', 'internal access' in foot.lower() and 'take part' in foot.lower())
        await pg.locator('kx-header .tools kx-lang-switch button', has_text='PT').click(); await pg.wait_for_timeout(1000)
        ok('EN→PT volta para o slug em português', pg.url.endswith('/servicos#focus-group'), pg.url)
        pressed=await pg.locator('kx-header .tools kx-lang-switch button[aria-pressed=true]').inner_text()
        ok('Seletor indica idioma ativo (aria-pressed)', pressed.strip().startswith('PT'))

        # 6. Formulário de contato
        await pg.goto(BASE+'/contato', wait_until='load'); await __import__('asyncio').sleep(0.6)
        await pg.locator('form button[type=submit]').click(); await pg.wait_for_timeout(500)
        n=await pg.locator('.summary li').count()
        ok('Envio vazio mostra resumo de erros', n==5, f'{n} erros')
        foc=await pg.evaluate("document.activeElement.classList.contains('summary')")
        ok('Foco vai para o resumo de erros', foc)
        inv=await pg.locator('#f-name').get_attribute('aria-invalid')
        desc=await pg.locator('#f-name').get_attribute('aria-describedby')
        ok('Campo inválido com aria-invalid + aria-describedby', inv=='true' and desc=='e-name')
        await pg.fill('#f-name','Teste QA'); await pg.fill('#f-email','email-invalido')
        await pg.locator('#f-email').blur(); await pg.wait_for_timeout(200)
        msg=await pg.locator('#e-email').inner_text()
        ok('Validação de e-mail', 'válido' in msg, msg)
        await pg.fill('#f-phone','123'); await pg.locator('#f-phone').blur()
        ok('Validação de telefone', await pg.locator('#e-phone').count()==1)
        await pg.fill('#f-phone','(21) 3333-4444')
        await pg.fill('#f-email','qa@exemplo.com'); await pg.select_option('#f-subject','cinema')
        await pg.fill('#f-message','Mensagem de teste com mais de dez caracteres.')
        await pg.check('#f-consent')
        await pg.locator('form button[type=submit]').click(); await pg.wait_for_timeout(800)
        alert=await pg.locator('.alert').first.inner_text()
        ok('Sem endpoint: erro honesto, sem falso sucesso', 'indisponível' in alert and 'enviada' not in alert.lower(), alert.replace('\n',' '))
        await pg.goto(BASE+'/contato?assunto=participante', wait_until='load'); await __import__('asyncio').sleep(0.6)
        ok('?assunto=participante pré-seleciona o assunto', await pg.locator('#f-subject').input_value()=='participante')

        # 7. Pesquisa aberta: estado vazio + CTA de cadastro com ação
        await pg.goto(BASE+'/pesquisa-aberta', wait_until='load'); await __import__('asyncio').sleep(0.6); await pg.wait_for_timeout(600)
        ok('Pesquisa aberta: estado vazio (sem dados fictícios)', await pg.locator('.empty h3').count()==1)
        href=await pg.locator('.empty sn-signup-link a').get_attribute('href')
        ok('CTA de cadastro leva a destino válido', href=='/contato?assunto=participante', href)

        # 8. Acesso interno discreto no footer
        await pg.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6)
        a=pg.locator('kx-footer a.f-admin'); 
        ok('Link de acesso interno no footer', await a.count()==1 and (await a.get_attribute('href'))=='/acesso-interno')
        inmenu=await pg.locator('kx-header a[href*=acesso]').count()
        ok('Acesso interno fora do menu principal', inmenu==0)

        # 9. WhatsApp sem número configurado não aparece
        ok('WhatsApp oculto sem número oficial', await pg.locator('kx-whatsapp-fab a').count()==0)

        # 10. Mobile: menu
        m=await b.new_context(viewport={'width':375,'height':812}, is_mobile=True, has_touch=True)
        mp=await m.new_page()
        await mp.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6)
        btn=mp.locator('kx-header .menu-btn')
        ok('Mobile: botão MENU visível', await btn.is_visible())
        await btn.click(); await mp.wait_for_timeout(800)
        ok('Mobile: menu abre (aria-expanded)', await btn.get_attribute('aria-expanded')=='true')
        ok('Mobile: rolagem travada', await mp.evaluate("document.body.classList.contains('kx-scroll-lock')"))
        await mp.locator('.panel .m-link', has_text='Serviços').click(); await mp.wait_for_timeout(500)
        ok('Mobile: submenu em acordeão', await mp.locator('.panel .m-link', has_text='Serviços').get_attribute('aria-expanded')=='true')
        await mp.keyboard.press('Escape'); await mp.wait_for_timeout(600)
        ok('Mobile: Esc fecha o menu', await btn.get_attribute('aria-expanded')=='false')
        await btn.click(); await mp.wait_for_timeout(700)
        await mp.locator('.panel .m-link', has_text='Contato').click(); await mp.wait_for_timeout(1200)
        ok('Mobile: link navega e fecha o menu', mp.url.endswith('/contato') and await btn.get_attribute('aria-expanded')=='false', mp.url)
        for w in (320,375,768,1024,1440,1920):
            await mp.set_viewport_size({'width':w,'height':800})
            for r in ['/','/empresa','/servicos','/contato']:
                await mp.goto(BASE+r, wait_until='load'); await __import__('asyncio').sleep(0.6)
                o=await mp.evaluate('document.documentElement.scrollWidth - window.innerWidth')
                if o>0: ok(f'Sem scroll horizontal {w}px {r}', False, f'+{o}px')
        ok('Sem scroll horizontal em 320/375/768/1024/1440/1920', not any(x[1].startswith('Sem scroll horizontal ') and x[0]=='FALHOU' for x in R))

        # 11. prefers-reduced-motion
        rm=await b.new_context(viewport={'width':1440,'height':900}, reduced_motion='reduce')
        rp=await rm.new_page(); await rp.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6); await rp.wait_for_timeout(300)
        op=await rp.evaluate("getComputedStyle(document.querySelector('kx-service-card')).opacity")
        ok('Reduced motion: conteúdo visível sem animar', op=='1', op)
        await rp.wait_for_timeout(800)
        vp=await rp.evaluate("document.querySelector('kx-video-bg video').paused")
        ok('Reduced motion: vídeo do hero não toca sozinho (fica a capa)', vp)

        # 11b. Faixa de serviços (ref. Addifico)
        await pg.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6)
        rail=pg.locator('kx-service-rail'); await rail.scroll_into_view_if_needed(); await pg.wait_for_timeout(1200)
        n=await pg.locator('kx-service-card').count()
        ok('Faixa de serviços com 7 cards', n==7, str(n))
        prev=pg.locator('kx-service-rail .nav-btn').first; nxt=pg.locator('kx-service-rail .nav-btn').last
        ok('Botão "anterior" desabilitado no início', await prev.is_disabled())
        await nxt.click(); await pg.wait_for_timeout(900)
        sl=await pg.evaluate("document.querySelector('kx-service-rail .track').scrollLeft")
        ok('Botão "próximo" rola a faixa', sl>100, f'scrollLeft={sl}')
        ok('Botão "anterior" habilita após rolar', not await prev.is_disabled())
        card=pg.locator('kx-service-card').nth(4); await card.hover(); await pg.wait_for_timeout(600)
        sc=await card.evaluate("e=>getComputedStyle(e.querySelector('.notch')).transform")
        op=await card.evaluate("e=>getComputedStyle(e.querySelector('.desc')).opacity")
        ok('Card ativo: recorte aparece e descrição abre (hover)', sc in ('none','matrix(1, 0, 0, 1, 0, 0)') and op=='1', f'{sc} op={op}')
        await pg.mouse.move(5,5); await pg.wait_for_timeout(400)
        await pg.locator('kx-service-card a').first.focus(); await pg.wait_for_timeout(600)
        op=await pg.locator('kx-service-card').first.evaluate("e=>getComputedStyle(e.querySelector('.desc')).opacity")
        ok('Card ativo também com foco de teclado', op=='1', op)
        href=await pg.locator('kx-service-card a').nth(3).get_attribute('href')
        ok('Card leva ao destino certo (Focus group)', href=='/servicos#focus-group', href)

        # 11b2. Vídeo do hero
        await pg.goto(BASE+'/', wait_until='load'); await pg.wait_for_timeout(2500)
        v=await pg.evaluate("(()=>{const v=document.querySelector('kx-video-bg video');return {paused:v.paused, muted:v.muted, loop:v.loop, inline:v.playsInline, poster:v.getAttribute('poster'), hidden:v.getAttribute('aria-hidden')}})()")
        ok('Hero: vídeo toca sem som, em loop, inline, com capa', (not v['paused']) and v['muted'] and v['loop'] and v['inline'] and v['poster'].endswith('.webp'), str(v))
        ok('Hero: vídeo é decorativo (aria-hidden)', v['hidden']=='true')
        tg=pg.locator('kx-video-bg .toggle'); await tg.click(); await pg.wait_for_timeout(300)
        ok('Hero: botão pausa o vídeo (WCAG 2.2.2)', await pg.evaluate("document.querySelector('kx-video-bg video').paused") and (await tg.get_attribute('aria-label'))=='Reproduzir vídeo de fundo')
        await tg.click(); await pg.wait_for_timeout(500)
        ok('Hero: botão retoma o vídeo', not await pg.evaluate("document.querySelector('kx-video-bg video').paused"))
        await pg.evaluate('window.scrollTo(0, 2500)'); await pg.wait_for_timeout(900)
        ok('Hero: vídeo pausa sozinho fora da tela', await pg.evaluate("document.querySelector('kx-video-bg video').paused"))
        await pg.evaluate('window.scrollTo(0, 0)'); await pg.wait_for_timeout(900)
        ok('Hero: vídeo volta a tocar ao reaparecer', not await pg.evaluate("document.querySelector('kx-video-bg video').paused"))

        # 11c. Header em pílula flutuante
        rad=await pg.evaluate("getComputedStyle(document.querySelector('kx-header .bar')).borderRadius")
        ok('Header flutuante (pílula)', rad.startswith('999'), rad)
        bg=await pg.evaluate("getComputedStyle(document.body).backgroundColor")
        ok('Tema escuro aplicado', bg=='rgb(9, 14, 10)', bg)

        # 12. Teclado: skip link
        await pg.goto(BASE+'/', wait_until='load'); await __import__('asyncio').sleep(0.6)
        await pg.keyboard.press('Tab')
        sk=await pg.evaluate("document.activeElement.classList.contains('kx-skip-link')")
        ok('Tab 1 foca "Pular para o conteúdo"', sk)
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(300)
        ok('Skip link move o foco para o conteúdo', await pg.evaluate("document.activeElement.id==='conteudo'"))

        ok('Sem erros de JavaScript no console', not errors, str(errors[:5]))
        await b.close()

asyncio.run(main())
passed=sum(1 for r in R if r[0]=='PASSOU')
for r in R: print(f'[{r[0]}] {r[1]}' + (f', {r[2]}' if r[2] and r[0]=='FALHOU' else ''))
print(f'\n{passed}/{len(R)} passaram')
json.dump(R, open('e2e-result.json','w'), ensure_ascii=False, indent=1)
