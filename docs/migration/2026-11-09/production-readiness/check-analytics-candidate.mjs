import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const root='/home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108';
const {bypass}=JSON.parse(await fs.readFile(root+'/.review/production/access.json','utf8'));
const safeError=error=>String(error?.stack||error).replaceAll(bypass,'[redacted]');
process.on('unhandledRejection',error=>{console.error(safeError(error));process.exitCode=1;});
const candidate=process.argv[2];assert.match(candidate,/^https:\/\/chickzen-[a-z0-9]+-emilio-castellanos-projects\.vercel\.app$/);
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const results=[];
async function setup(origin,rehost=false){
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const scripts=[],collectors=[],posts=[],errors=[];
 let closing=false;
 await context.route('**/*',async route=>{
  try {
  const request=route.request(),url=new URL(request.url());
  if(/google-analytics|googletagmanager|doubleclick|googleadservices/.test(url.hostname)){
   if(url.pathname==='/gtm.js'){scripts.push(url.href);return route.fulfill({status:200,contentType:'application/javascript',body:'/* QA stub: no real tags or collectors loaded. */'});}
   collectors.push(url.href);return route.fulfill({status:204,body:''});
  }
  if(request.method()==='POST'){
   if(url.origin===origin&&url.pathname==='/api/contact'){
    posts.push(request.postDataJSON());return route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({accepted:true,analyticsEligible:rehost,newsletterWarning:false})});
   }
   return route.fulfill({status:405,body:''});
  }
  if(url.origin===origin&&(rehost||origin===candidate)){
   const backend=new URL(url.pathname+url.search,candidate);
   const headers={...request.headers(),'x-vercel-protection-bypass':bypass};delete headers.host;
   const response=await route.fetch({url:backend.href,headers,maxRedirects:0});return route.fulfill({response});
  }
  return route.continue();
  } catch(error) {
   if(!closing){errors.push(safeError(error));await route.abort().catch(()=>{});}
  }
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
 return {context,page,scripts,collectors,posts,errors,close:async()=>{closing=true;await context.close();}};
}
const events=page=>page.evaluate(()=>window.dataLayer?.filter(e=>e?.event?.startsWith('ck_'))||[]);
try{
 for(const origin of ['https://chickzen.com',candidate,'https://chickzen-preview.vercel.app']){
  const {page,scripts,collectors,posts,errors,close}=await setup(origin);
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Accept analytics',exact:true}).click();
  assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');assert.deepEqual(scripts,[]);assert.deepEqual(collectors,[]);assert.deepEqual(posts,[]);assert.deepEqual(errors,[]);
  results.push({origin,case:origin==='https://chickzen.com'?'live remains OFF':'excluded hostname',googleQueue:false,googleRequests:0});await close();
 }
 const {page,scripts,collectors,posts,errors,close}=await setup('https://chickzen.com',true);
 await page.goto('https://chickzen.com/',{waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');assert.equal(scripts.length,0);
 await page.getByRole('button',{name:'Accept analytics',exact:true}).click();
 await page.waitForFunction(()=>window.dataLayer?.some(e=>e?.event==='ck_page_view'));
 assert.equal((await events(page)).filter(e=>e.event==='ck_page_view').length,1);assert.equal(scripts.length,1);
 await page.locator('header a[href="/services"]').first().click();await page.waitForURL('https://chickzen.com/services');
 const service=page.locator('[data-service-id]').first();const id=await service.getAttribute('data-service-id');
 const details=service.locator('xpath=ancestor::details[1]');
 if(await details.count())await details.locator('summary').click();
 await service.click();await page.waitForURL(/\/contact/);
 await page.getByLabel('Your name',{exact:true}).fill('Mock Analytics Reviewer');
 await page.getByLabel('Email address',{exact:true}).fill('mock-private@example.invalid');
 await page.getByLabel('What would you like help with?').selectOption('Not sure yet');
 await page.locator('textarea[name="message"]').fill('This private test message must never enter analytics.');
 await page.getByRole('button',{name:'Send your inquiry'}).click();
 await page.getByRole('status').filter({hasText:'Your inquiry is on its way'}).waitFor();
 const all=await events(page);assert.ok(all.some(e=>e.event==='ck_service_select'&&e.service_id===id));
 assert.equal(all.filter(e=>e.event==='ck_inquiry_accepted').length,1);assert.equal(posts.length,1);
 const serialized=JSON.stringify(all);assert.ok(!serialized.includes('mock-private'));assert.ok(!serialized.includes('private test message'));assert.ok(!serialized.includes(posts[0].submissionId));
 assert.deepEqual(collectors,[]);assert.deepEqual(errors,[]);
 results.push({case:'actual candidate served to simulated production browser origin',consentGate:true,singleGoogleScriptStub:true,serviceEvent:true,mockedInquiryEvent:true,noInquiryPersonalData:true,eventNames:all.map(e=>e.event),realProviderPosts:0,realGoogleCollectors:0,errors});
 await close();
 const report={checkedAt:new Date().toISOString(),sourceCommit:'b539b67',applicationSource:'bb4e997',candidate,livePromotionPerformed:false,googleScriptStubbed:true,allProviderPostsIntercepted:true,results};
 await fs.writeFile(root+'/.review/production/analytics-candidate-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
