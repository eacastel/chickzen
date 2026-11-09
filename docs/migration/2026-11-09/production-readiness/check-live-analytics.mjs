import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const scripts=[],collectors=[],errors=[];
await context.route('**/*',async route=>{
 const request=route.request(),url=new URL(request.url());
 if(/google-analytics|googletagmanager|doubleclick|googleadservices/.test(url.hostname)){
  if(url.pathname==='/gtm.js'){scripts.push(url.href);return route.fulfill({status:200,contentType:'application/javascript',body:'/* QA stub; no actual Google tags or events. */'});}
  collectors.push(url.href);return route.fulfill({status:204,body:''});
 }
 if(request.method()==='POST')return route.fulfill({status:405,body:''});
 return route.continue();
});
const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
try{
 const response=await page.goto('https://chickzen.com/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
 assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');assert.equal(scripts.length,0);
 await page.getByRole('button',{name:'Accept analytics',exact:true}).click();
 await page.waitForFunction(()=>window.dataLayer?.some(e=>e?.event==='ck_page_view'));
 assert.equal(scripts.length,1);assert.equal(new URL(scripts[0]).searchParams.get('id'),'GTM-WDHMFN7J');
 await page.locator('header a[href="/services"]').first().click();await page.waitForURL('https://chickzen.com/services');
 await page.waitForFunction(()=>window.dataLayer?.some(e=>e?.event==='ck_page_view'&&e.page_path==='/services'));
 const views=await page.evaluate(()=>window.dataLayer.filter(e=>e?.event==='ck_page_view').map(e=>e.page_path));assert.deepEqual(views,['/','/services']);
 assert.deepEqual(collectors,[]);assert.deepEqual(errors,[]);
 const report={checkedAt:new Date().toISOString(),origin:'https://chickzen.com',deploymentId:'dpl_2t4iy5feGKcbDBjdmMJrLBSnuc6U',sourceCommit:'b539b67',tlsVerified:true,liveConsentGate:true,googleScriptStubbed:true,googleContainer:'GTM-WDHMFN7J',pageviews:views,realGoogleCollectors:0,realEmailOrPaymentSent:false,errors};
 await fs.writeFile('/home/eacastel/Avanti/webdev/chickzen/docs/migration/2026-11-09/production-readiness/live-analytics-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
