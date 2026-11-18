import asyncio, json
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4300'
AXE=open('node_modules/axe-core/axe.min.js').read()
routes=['/','/empresa','/servicos','/servicos/cinema','/servicos/estacoes-cati','/pesquisa-aberta','/contato','/acesso-interno','/en','/nao-existe']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await (await b.new_context(viewport={'width':1440,'height':900}, reduced_motion='reduce')).new_page()
        total={}
        for r in routes:
            await pg.goto(BASE+r, wait_until='load'); await __import__('asyncio').sleep(0.6); await pg.wait_for_timeout(400)
            await pg.add_script_tag(content=AXE)
            res=await pg.evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})")
            for v in res['violations']:
                k=(v['id'],v['impact'])
                total.setdefault(k,[]).append((r,len(v['nodes']),v['nodes'][0]['target'][0] if v['nodes'] else '', v['nodes'][0].get('failureSummary','')[:160]))
        for k,v in total.items(): print(k, v[:3])
        print('violações distintas:', len(total))
        await b.close()
asyncio.run(main())
