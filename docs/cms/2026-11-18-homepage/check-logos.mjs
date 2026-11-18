import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json')('playwright-core');
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const dir=process.cwd()+'/docs/cms/2026-11-18-homepage';
const origin=process.argv[2];const result={origin,checkedAt:new Date().toISOString(),logos:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.route('**/*',route=>/googletagmanager|google-analytics|doubleclick/.test(route.request().url())||route.request().method()!=='GET'?route.abort():route.continue());
 const page=await context.newPage();await page.goto(origin,{waitUntil:'networkidle'});
 const section=page.locator('.client-logos'),counter=section.locator('.client-logos-controls > span');
 await section.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
 const start=await counter.innerText();await page.waitForTimeout(5000);result.autoplay=await counter.innerText()!==start;
 await page.getByRole('button',{name:'Pause client logo slideshow',exact:true}).click();
 const paused=await counter.innerText();await page.waitForTimeout(5000);result.pauseWorks=await counter.innerText()===paused;
 const viewport=section.locator('.client-logos-viewport');await viewport.focus();
 const images=section.locator('.client-logo-slide img');
 for(let i=0;i<20;i++){
  const current=Number((await counter.innerText()).split('/')[0])-1;
  await images.nth(current).evaluate(img=>new Promise((resolve,reject)=>{
   if(img.complete&&img.naturalWidth)return resolve(true);
   img.onload=()=>resolve(true);img.onerror=()=>reject(new Error('Logo failed to load'));
   setTimeout(()=>reject(new Error('Logo timed out')),20000);
  }));
  result.logos.push(await section.locator('.client-logo-slide').nth(current).evaluate(e=>({name:e.querySelector('figcaption').textContent,width:e.querySelector('img').naturalWidth})));
  if(current===18){await page.waitForTimeout(600);await section.screenshot({path:dir+'/preview-new-logos-1440.png'})}
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(600);
 }
 if(!result.autoplay||!result.pauseWorks||new Set(result.logos.map(l=>l.name)).size!==20)throw new Error('Logo behavior failed');
 await page.setViewportSize({width:390,height:900});await section.scrollIntoViewIfNeeded();await viewport.focus();
 for(let i=0;i<20 && !(await counter.innerText()).startsWith('19 /');i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(100)}
 await page.waitForTimeout(700);await section.screenshot({path:dir+'/preview-new-logos-390.png'});
 fs.writeFileSync(dir+'/logo-validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close()}
