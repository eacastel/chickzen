import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const origin=process.argv[2], label=process.argv[3];
const dir=process.cwd()+'/docs/cms/2026-11-18-homepage';
fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const out={checkedAt:new Date().toISOString(),origin,checks:[]};
try {
for(const width of [1440,390,320]){
 const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
 await ctx.route('**/*',route=>{
  const u=new URL(route.request().url());
  if(route.request().method()!=='GET'||/google-analytics|googletagmanager|doubleclick/.test(u.hostname))return route.abort();
  return route.continue();
 });
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const r=await page.goto(origin,{waitUntil:'networkidle'});
 const reject=page.getByRole('button',{name:'Reject analytics',exact:true});
 if(await reject.isVisible())await reject.click();
 const data=await page.evaluate(()=>({title:document.title,canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href'),h1:document.querySelector('h1')?.innerText,overflow:document.documentElement.scrollWidth>innerWidth,logos:document.querySelectorAll('.client-logo-slide').length,photos:[...document.querySelectorAll('.hero img')].map(i=>({complete:i.complete,width:i.naturalWidth})),text:[...document.querySelectorAll('.hero,#work,.approach-band,#about,.journal,#begin')].map(e=>e.textContent.replace(/\s+/g,' ').trim()),logoNames:[...document.querySelectorAll('.client-logo-slide figcaption')].map(e=>e.textContent)}));
 const result={width,status:r.status(),...data,errors};
 if(label!=='before') {
  const baseline=JSON.parse(fs.readFileSync(dir+'/before.json')).checks.find(c=>c.width===width);
  result.copyUnchanged=JSON.stringify(baseline.text)===JSON.stringify(result.text);
  if(data.logos!==20||data.overflow||errors.length||data.photos.some(i=>!i.width))throw new Error('Homepage check failed: '+JSON.stringify(result));
  const logos=page.locator('.client-logos');await logos.scrollIntoViewIfNeeded();
  const count=logos.locator('.client-logos-controls > span');const first=await count.innerText();
  await page.getByRole('button',{name:'Next client logo',exact:true}).click();const next=await count.innerText();
  await page.getByRole('button',{name:'Previous client logo',exact:true}).click();const previous=await count.innerText();
  result.controls=first!==next&&first===previous;
  await logos.locator('.client-logos-viewport').focus();await page.keyboard.press('ArrowLeft');result.wraps=(await count.innerText()).startsWith('20 /');
  result.reducedMotionNoAutoplay=await page.getByRole('button',{name:/Play client logo slideshow|Pause client logo slideshow/}).count()===0;
  if(!result.controls||!result.wraps||!result.reducedMotionNoAutoplay)throw new Error('Carousel accessibility check failed');
  await logos.locator('.client-logo-slide').last().locator('img').evaluate(img=>new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)return resolve(true);img.onload=()=>resolve(true);img.onerror=()=>reject(new Error('Logo failed'));setTimeout(()=>reject(new Error('Logo load timeout')),15000)}));
  await logos.screenshot({path:dir+`/${label}-logos-${width}.png`});
 }
 await page.screenshot({path:dir+`/${label}-${width}.png`,fullPage:width!==320});
 out.checks.push(result);await ctx.close();
}
fs.writeFileSync(dir+`/${label}.json`,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({label,origin,checks:out.checks.map(({text,logoNames,...c})=>c)}));
} finally {await browser.close()}
