import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const root='/home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108';
const fixture=JSON.parse(await readFile(root+'/.review/analytics/fixture.json','utf8'));
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const results=[];
async function setup(origin){
 const context=await browser.newContext();
 const google=[],errors=[];
 await context.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(request.method()!=='GET'){await route.fulfill({status:405,body:''});return;}
  if(url.origin===origin){
   const response=await fetch(fixture.origin+url.pathname+url.search);
   await route.fulfill({status:response.status,contentType:response.headers.get('content-type'),body:await response.text()});return;
  }
  if(url.hostname==='www.googletagmanager.com'&&url.pathname==='/gtm.js'){
   google.push(url.href);await route.fulfill({status:200,contentType:'application/javascript',body:'/* Google script stub: this run proves app dispatch, not wire delivery. */'});return;
  }
  await route.fulfill({status:204,body:''});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 return {context,page,google,errors};
}
const events=page=>page.evaluate(()=>Array.isArray(window.dataLayer)?window.dataLayer.filter(x=>x?.event?.startsWith('ck_')):[]);
try{
 const {context,page,google,errors}=await setup('https://chickzen.com');
 await page.goto('https://chickzen.com/?utm_source=newsletter&utm_medium=email&utm_campaign=clarity-2026&gclid=FAKE_GCLID_PRIVATE&payment_intent_client_secret=FAKE_STRIPE_SECRET&email=fake-private@example.com#FAKE_HASH',{referer:'https://referrer.example/private-person?email=fake-private@example.com'});
 assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');
 await page.click('#email');assert.equal((await events(page)).length,0);
 await page.click('#accept');
 await page.waitForFunction(()=>window.dataLayer?.some(x=>x?.event==='ck_page_view'));
 let all=await events(page);assert.equal(all.length,1);assert.equal(all[0].page_path,'/');assert.equal(all[0].campaign_source,'newsletter');assert.equal(all[0].campaign_name,'clarity-2026');assert.equal(all[0].page_referrer,'https://referrer.example');assert.equal(page.url(),'https://chickzen.com/');
 await page.click('#about');await page.click('#contact');await page.goBack();await page.goForward();
 all=await events(page);assert.equal(all.filter(x=>x.event==='ck_page_view').length,5);
 const before=all.length;
 await page.evaluate(()=>{history.replaceState(history.state,'',location.pathname+'?email=FAKE_PRIVATE#FAKE_HASH');window.__ck.trackPage();window.__ck.trackPage();});
 assert.equal((await events(page)).length,before);
 await page.click('#email');await page.click('#phone');await page.click('#whatsapp');await page.click('#guide');
 const contacts=(await events(page)).filter(x=>x.event==='ck_contact_click');
 for(const method of ['email','phone','whatsapp','contact_page'])assert.ok(contacts.some(x=>x.contact_method===method));
 assert.equal((await events(page)).filter(x=>x.event==='ck_guide_request_click').length,1);
 const ids=await page.locator('[data-service-id]').evaluateAll(nodes=>nodes.map(x=>x.dataset.serviceId));
 for(const id of ids)await page.locator(`[data-service-id="${id}"]`).click();
 const selected=(await events(page)).filter(x=>x.event==='ck_service_select');assert.equal(selected.length,13);assert.deepEqual(selected.map(x=>x.service_id),ids);assert.ok(selected.every(x=>x.page_path==='/contact'));
 await page.click('#email');const last=(await events(page)).at(-1);assert.equal(last.event,'ck_contact_click');assert.equal(last.service_id,null);assert.equal(last.service_category,null);
 await page.evaluate(()=>{
  const ck=window.__ck,capture=ck.captureInquiryContext();
  for(const [status,result] of [[400,{accepted:false}],[202,{accepted:true}],[202,{accepted:true,analyticsEligible:false}],[200,{accepted:true,analyticsEligible:true}],[502,{accepted:false,analyticsEligible:true}]])ck.recordInquiryAccepted(status,result,'internal-private-id',capture);
 });
 assert.equal((await events(page)).filter(x=>x.event==='ck_inquiry_accepted').length,0);
 await page.evaluate(()=>{const ck=window.__ck,capture=ck.captureInquiryContext();ck.recordInquiryAccepted(202,{accepted:true,analyticsEligible:true,newsletterWarning:true},'internal-private-id',capture);ck.recordInquiryAccepted(202,{accepted:true,analyticsEligible:true},'internal-private-id',capture);});
 all=await events(page);assert.equal(all.filter(x=>x.event==='ck_inquiry_accepted').length,1);
 const serialized=JSON.stringify(all);for(const secret of ['FAKE_GCLID_PRIVATE','FAKE_STRIPE_SECRET','FAKE_PRIVATE','FAKE_HASH','fake-private','internal-private-id'])assert.ok(!serialized.includes(secret),secret);
 assert.ok(all.every(x=>!x.page_location.includes('?')&&!x.page_location.includes('#')&&x.measurement_version==='2026-11-09'));
 const initialCount=all.filter(x=>x.event==='ck_page_view').length;
 await page.evaluate(()=>{window.__cleanup();window.__cleanup=window.__ck.configureAnalytics(true,'GTM-WDHMFN7J');window.__ck.trackPage();});
 assert.equal((await events(page)).filter(x=>x.event==='ck_page_view').length,initialCount);assert.equal(google.length,1);
 await page.evaluate(()=>{document.cookie='_ga=fixture; Path=/';document.cookie='_ga_6PCNC6QKXE=fixture; Path=/; Domain=chickzen.com';});
 await Promise.all([page.waitForNavigation(),page.click('#reject')]);
 assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');
 assert.ok(!(await page.evaluate(()=>document.cookie)).includes('_ga'));
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('chickzen.analytics-inquiries.v1')),null);
 await page.reload();assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');assert.equal(google.length,1);assert.deepEqual(errors,[]);
 results.push({case:'production-host fixture',pass:true,pageviewsBeforeWithdrawal:initialCount,services:13,acceptedInquiryEvents:1,googleScriptRequests:google.length,realGoogleCollectors:0,errors});
 await context.close();
 for(const origin of ['https://chickzen-preview.vercel.app','https://dashing-gaufre-cbbd48.netlify.app','http://localhost:3000','http://chickzen.com']){
  const {context,page,google,errors}=await setup(origin);await page.goto(origin+'/');await page.click('#accept');await page.click('#contact');await page.click('#email');assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');assert.equal(google.length,0);assert.deepEqual(errors,[]);results.push({case:origin,zeroCollection:true});await context.close();
 }
 {
  const {context,page,errors}=await setup('https://www.chickzen.com');await page.goto('https://www.chickzen.com/private-fake-person?utm_campaign=fake-private@example.com&gclid=FAKE_GCLID_PRIVATE');await page.click('#accept');const all=await events(page);assert.equal(all[0].page_path,'/404');assert.equal(all[0].page_location,'https://www.chickzen.com/404');assert.equal(all[0].campaign_name,null);assert.deepEqual(errors,[]);results.push({case:'unknown path and rejected campaign',safeGeneric404:true});await context.close();
 }
 await writeFile(root+'/.review/analytics/dispatch-validation.json',JSON.stringify({mode:'actual application modules, stubbed Google script; no real collectors, emails, or payments',results},null,2));
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
