import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const root='/home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108';
const access=JSON.parse(await readFile(root+'/.review/analytics/access.json','utf8'));
const origin=access.origin;
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const google=[],errors=[],posts=[];
await context.route('**/*',async route=>{
 const request=route.request(),url=new URL(request.url());
 if(/google-analytics|googletagmanager|doubleclick|googleadservices/.test(url.hostname)){google.push(url.hostname+url.pathname);await route.fulfill({status:204,body:''});return;}
 if(request.method()==='POST'){
  if(url.pathname==='/api/contact'){
   posts.push(request.postDataJSON());
   await route.fulfill({status:posts.length===1?502:202,contentType:'application/json',body:JSON.stringify(posts.length===1?{error:'Please try again.'}:{accepted:true,analyticsEligible:false,newsletterWarning:false})});return;
  }
  await route.fulfill({status:405,body:''});return;
 }
 await route.continue();
});
const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
const layouts=[],routes=[],redirects=[];
try{
 await page.goto(access.shareUrl,{waitUntil:'networkidle'});
 await page.locator('#hero-title').waitFor({timeout:30000});
 for(const [width,height] of [[1440,1000],[768,1024],[390,844],[320,740]]){
  await page.setViewportSize({width,height});
  await page.evaluate(()=>localStorage.removeItem('chickzen.analytics-consent.v1'));
  const response=await page.goto(origin,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.match(response.headers()['x-robots-tag'],/noindex/);
  await page.locator('.cookie-panel').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const panel=await page.locator('.cookie-panel').boundingBox();assert.ok(panel.x>=0&&panel.y>=0&&panel.x+panel.width<=width&&panel.y+panel.height<=height);
  if(width===1440||width===390)await page.screenshot({path:root+`/.review/analytics/consent-${width}.png`});
  await page.getByRole('button',{name:'Reject analytics',exact:true}).click();assert.equal(await page.locator('.cookie-panel').count(),0);assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');
  await page.getByRole('button',{name:'Change analytics cookie settings'}).click();assert.equal(await page.getByRole('button',{name:'Reject analytics',exact:true}).evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'Accept analytics',exact:true}).click();assert.equal(await page.locator('.cookie-panel').count(),0);assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.cookie-panel').count(),0);assert.equal(await page.locator('.cookie-settings').count(),1);assert.equal(await page.evaluate(()=>typeof window.dataLayer),'undefined');
  layouts.push({width,consentFits:true,acceptRejectReopen:true,choicePersists:true,zeroCollection:true});
 }
 await page.setViewportSize({width:1440,height:1000});
 const catalog=JSON.parse(await readFile(root+'/src/lib/analytics/catalog.json','utf8'));
 for(const path of Object.keys(catalog.pages).filter(p=>p!=='/404')){
  const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);assert.match(response.headers()['x-robots-tag'],/noindex/);assert.equal(await page.locator('main h1').count(),1,path);
  const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');assert.equal(canonical,'https://chickzen.com'+(path==='/'?'':path));
  routes.push({path,status:200,canonical});
 }
 for(const path of ['/unknown-chickzen-page','/blog/unknown-chickzen-post','/missing/nested/page']){
  const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),404,path);assert.equal(await page.locator('link[rel="canonical"]').count(),0,path);assert.ok((await page.locator('meta[name="robots"]').evaluateAll(nodes=>nodes.map(n=>n.content))).some(v=>v.includes('noindex')));routes.push({path,status:404,canonical:null});
 }
 const aliases={'/origin-story':'/about','/good-vibes':'/about#recommendations','/lets-begin':'/contact','/shop':'/services','/home':'/','/journal':'/blog','/services/checkout':'/services/lets-begin','/journal/a-case-for-strawberry-lemonade':'/blog/a-case-for-strawberry-lemonade'};
 for(const [path,target] of Object.entries(aliases)){
  const response=await context.request.get(origin+path+'?utm_source=newsletter&email=private-test@example.com&gclid=FAKE_SECRET',{maxRedirects:0});assert.equal(response.status(),308,path);const location=new URL(response.headers().location,origin);assert.equal(location.pathname+location.hash,target);assert.equal(location.search,'?utm_source=newsletter');redirects.push({path,target,status:308,onlySafeCampaignQuery:true});
 }
 const sitemap=await(await context.request.get(origin+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,23);assert.ok(!sitemap.includes('/services/lets-begin'));assert.ok(!sitemap.includes('/success'));
 await page.goto(origin+'/services',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-service-id]').count(),13);await page.locator('.service-product summary').first().click();await page.locator('[data-service-id]').first().click();await page.waitForURL(/\/contact\?service=/);assert.match(await page.locator('textarea[name="message"]').inputValue(),/Discovery Catalyst/);
 await page.getByLabel('Your name',{exact:true}).fill('Test Reviewer');await page.getByLabel('Email address',{exact:true}).fill('mock@example.com');await page.getByLabel('What would you like help with?').selectOption('Not sure yet');
 await page.evaluate(()=>{const form=document.querySelector('.contact-form');form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
 await page.getByRole('status').filter({hasText:'Please try again.'}).waitFor();assert.equal(posts.length,1);
 await page.getByRole('button',{name:'Send your inquiry'}).click();await page.getByRole('status').filter({hasText:'Your inquiry is on its way'}).waitFor();assert.equal(posts.length,2);assert.equal(posts[0].submissionId,posts[1].submissionId);assert.ok(await page.getByRole('button',{name:'Inquiry submitted'}).isDisabled());
 assert.deepEqual(google,[]);assert.deepEqual(errors,[]);
 const report={deploymentId:access.deploymentId,sourceCommit:'ccc3de7',origin,layouts,routes,redirects,sitemapUrls:23,checkoutExcluded:true,form:{mockedOnly:true,doubleSubmitSuppressed:true,retryIdStable:true},googleRequests:0,errors};
 await writeFile(root+'/.review/analytics/deployed-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:layouts.length,routes:routes.length,redirects:redirects.length,sitemapUrls:23,googleRequests:0,errors},null,2));
}finally{await browser.close();}
