import asyncio, sys
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4300'
pages=sys.argv[1].split(',')
w=int(sys.argv[2]); h=int(sys.argv[3]) if len(sys.argv)>3 else 900
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':w,'height':h})
        pg=await ctx.new_page()
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for path in pages:
            await pg.goto(BASE+path, wait_until='load'); await __import__('asyncio').sleep(0.6)
            # rola a página toda para disparar reveals
            H=await pg.evaluate('document.documentElement.scrollHeight')
            y=0
            while y<H:
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(120); y+=500
                H=await pg.evaluate('document.documentElement.scrollHeight')
            await pg.wait_for_timeout(1300)
            await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(500)
            name=(path.strip('/').replace('/','_') or 'home')+f'_{w}.png'
            await pg.screenshot(path=name, full_page=True)
            ovf=await pg.evaluate('document.documentElement.scrollWidth>window.innerWidth')
            print(path, 'H=',H, 'overflowX=',ovf)
        print('ERRS', errs[:20])
        await b.close()
asyncio.run(main())
