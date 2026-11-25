import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json');
const {chromium}=require('playwright-core');
const root='/home/eacastel/Avanti/worktrees/chickzen-editorial-strategy-20261108';
const [backend,stage,outfile]=process.argv.slice(2);
assert.ok(['candidate','live','preview'].includes(stage));
assert.match(backend,/^https:\/\/(chickzen\.com|chickzen-preview\.vercel\.app|chickzen-[a-z0-9]+-emilio-castellanos-projects\.vercel\.app)$/);
const {bypass}=JSON.parse(await fs.readFile(root+'/.review/production/access.json','utf8'));
const origin=stage==='preview'?backend:'https://chickzen.com';
const enabled=stage!=='preview';
const key='chickzen.analytics-consent.v1';
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const results=[];
let blockedMutations=0,blockedCollectors=0;
const clean=error=>String(error?.stack||error).replaceAll(bypass,'[redacted]');
async function setup({mobile=false,signals=false,failScript=false,saved=null,blockedStorage=false,host=origin}={}) {
 const context=await browser.newContext({viewport:mobile?{width:360,height:800}:{width:1440,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
 const scripts=[],errors=[];let closing=false;
 await context.addInitScript(({signals,saved,key,blockedStorage})=>{
  if(signals){Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});Object.defineProperty(navigator,'globalPrivacyControl',{get:()=> true});}
  if(saved&&!sessionStorage.getItem('qa-seeded')){localStorage.setItem(key,JSON.stringify(saved));sessionStorage.setItem('qa-seeded','yes');}
  if(blockedStorage){Storage.prototype.setItem=()=>{throw new DOMException('Blocked','SecurityError');};Storage.prototype.getItem=()=>{throw new DOMException('Blocked','SecurityError');};}
  window.addEventListener('beforeunload',()=>{try{sessionStorage.setItem('qa-beforeunload',JSON.stringify({disabled:window['ga-disable-G-6PCNC6QKXE'],cookies:document.cookie,consents:(window.dataLayer||[]).filter(x=>x?.[0]==='consent').map(x=>Array.from(x))}));}catch{}});
 },{signals,saved,key,blockedStorage});
 await context.route('**/*',async route=>{
  try {
   const request=route.request(),url=new URL(request.url());
   if(!['GET','HEAD'].includes(request.method())){blockedMutations++;return route.abort('blockedbyclient');}
   if(url.hostname==='www.googletagmanager.com'&&url.pathname==='/gtm.js'){
    scripts.push(url.href);if(failScript)return route.abort('blockedbyclient');
    return route.fulfill({status:200,contentType:'application/javascript',body:'/* Google intentionally stubbed: dispatch-only QA, no collection. */'});
   }
   if(/google-analytics|googletagmanager|doubleclick|googleadservices|google\.com/.test(url.hostname)){blockedCollectors++;return route.abort('blockedbyclient');}
   if(url.origin===host){
    if(stage==='candidate'){
     const headers={...request.headers(),'x-vercel-protection-bypass':bypass};delete headers.host;
     const response=await route.fetch({url:new URL(url.pathname+url.search,backend).href,headers,maxRedirects:0});return route.fulfill({response});
    }
    return route.continue();
   }
   if(url.hostname==='images.ctfassets.net')return route.continue();
   return route.abort('blockedbyclient');
  }catch(error){if(!closing){errors.push(clean(error));await route.abort().catch(()=>{});}}
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(clean(e)));
 await page.goto(host,{waitUntil:'networkidle'});
 await page.locator('.cookie-panel,.cookie-settings').first().waitFor();
 return {context,page,scripts,errors,close:async()=>{assert.deepEqual(errors,[]);closing=true;await context.close();}};
}
const button=(p,name)=>p.getByRole('button',{name,exact:true});
const record=p=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const events=p=>p.evaluate(()=>window.dataLayer?.filter(e=>e?.event?.startsWith('ck_'))||[]);
const toggle=p=>p.getByRole('checkbox',{name:'Analytics',exact:true});
async function closed(p){await p.locator('.cookie-settings').waitFor();assert.equal(await p.locator('.cookie-panel').count(),0);}
async function reopen(p){await button(p,'Change analytics cookie settings').click();await toggle(p).waitFor();assert.equal(await p.evaluate(()=>document.activeElement?.id),'cookie-heading');}
async function assertGate(p,yes){
 const ev=await events(p);assert.equal(ev.some(e=>e.event==='ck_page_view'),yes&&enabled);
 if(yes&&enabled){
  const cs=await p.evaluate(()=>window.dataLayer.filter(e=>e?.[0]==='consent').map(e=>Array.from(e)));
  const last=cs.at(-1)[2];assert.equal(last.analytics_storage,'granted');
  for(const k of ['ad_storage','ad_user_data','ad_personalization','personalization_storage'])assert.equal(last[k],'denied');
 }
}
try {
 for(const mobile of [false,true]){
  const t=await setup({mobile}),p=t.page;
  for(const name of ['Accept cookies','Reject','Preferences']){const b=button(p,name);assert.ok(await b.isVisible());assert.ok(await b.isEnabled());assert.ok((await b.boundingBox()).height>=44);}
  assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('.cookie-primary')).backgroundColor),'rgb(70, 89, 99)');
  assert.equal(await record(p),null);assert.equal(t.scripts.length,0);await assertGate(p,false);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.screenshot({path:outfile.replace('.json',mobile?'-mobile.png':'-desktop.png')});
  await button(p,'Preferences').click();assert.equal(await toggle(p).isChecked(),false);assert.equal(await record(p),null);
  await toggle(p).check();await button(p,'Cancel').click();assert.equal(await record(p),null);assert.equal(t.scripts.length,0);
  await button(p,'Preferences').click();assert.equal(await toggle(p).isChecked(),false);
  await p.screenshot({path:outfile.replace('.json',mobile?'-preferences-mobile.png':'-preferences-desktop.png')});
  await button(p,'Save preferences').click();await closed(p);assert.equal((await record(p)).choice,'rejected');await assertGate(p,false);
  const rejected=await record(p);await p.reload({waitUntil:'networkidle'});await closed(p);assert.deepEqual(await record(p),rejected);
  await reopen(p);assert.equal(await toggle(p).isChecked(),false);await toggle(p).check();await button(p,'Save preferences').click();await closed(p);await assertGate(p,true);
  assert.equal((await record(p)).choice,'accepted');assert.equal(t.scripts.length,enabled?1:0);
  const accepted=await record(p);await p.reload({waitUntil:'networkidle'});await closed(p);assert.deepEqual(await record(p),accepted);await assertGate(p,true);
  await reopen(p);assert.equal(await toggle(p).isChecked(),true);await toggle(p).uncheck();await button(p,'Cancel').click();await closed(p);assert.deepEqual(await record(p),accepted);
  await reopen(p);assert.equal(await toggle(p).isChecked(),true);
  await p.evaluate(()=>{document.cookie='_ga=qa; Path=/';document.cookie='_ga_6PCNC6QKXE=qa; Path=/; Domain=.chickzen.com';});
  await toggle(p).uncheck();
  if(enabled)await Promise.all([p.waitForNavigation({waitUntil:'networkidle'}),button(p,'Save preferences').click()]);
  else await button(p,'Save preferences').click();
  await closed(p);assert.equal((await record(p)).choice,'rejected');await assertGate(p,false);
  assert.ok(!(await p.evaluate(()=>document.cookie)).includes('_ga='));
  if(enabled){const before=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('qa-beforeunload')));assert.equal(before.disabled,true);assert.ok(!before.cookies.includes('_ga'));assert.equal(before.consents.at(-1)[2].analytics_storage,'denied');}
  const scriptsAfter=t.scripts.length;await p.reload({waitUntil:'networkidle'});await closed(p);assert.equal(t.scripts.length,scriptsAfter);
  await reopen(p);assert.equal(await toggle(p).isChecked(),false);await toggle(p).check();await button(p,'Save preferences').click();await closed(p);await assertGate(p,true);
  results.push({case:mobile?'mobile consent lifecycle':'desktop consent lifecycle',noInitialCollection:true,threeActions:true,preferencesDefaultOff:true,cancelDiscards:true,reloadPreservesRecord:true,withdrawalClearsCookies:true,synchronousDenial:enabled,reEnable:true,noOverflow:true});await t.close();
 }
 for(const choice of ['accepted','rejected']){
  const saved={version:1,choice,expires:Date.now()+30*24*60*60*1000};const t=await setup({saved});
  await closed(t.page);assert.deepEqual(await record(t.page),saved);await assertGate(t.page,choice==='accepted');await reopen(t.page);assert.equal(await toggle(t.page).isChecked(),choice==='accepted');
  await t.page.keyboard.press('Escape');await closed(t.page);assert.deepEqual(await record(t.page),saved);results.push({case:'existing '+choice,expiryUnchanged:true});await t.close();
 }
 for(const options of [{signals:true},{failScript:true},{blockedStorage:true},{}]){
  const t=await setup(options),p=t.page;assert.equal(t.scripts.length,0);
  if(options.signals)assert.deepEqual(await p.evaluate(()=>[navigator.doNotTrack,navigator.globalPrivacyControl]),['1',true]);
  await button(p,'Accept cookies').click();await closed(p);await assertGate(p,true);
  if(!options.blockedStorage)assert.equal((await record(p)).choice,'accepted');
  assert.equal(t.scripts.length,enabled?1:0);
  if(!options.blockedStorage){await p.reload({waitUntil:'networkidle'});await closed(p);await assertGate(p,true);}
  results.push({case:options.signals?'DNT/GPC explicit opt-in':options.failScript?'blocked Google script':options.blockedStorage?'blocked storage':'one-click accept',closes:true,analyticsDispatch:enabled,adsRemainDenied:true});await t.close();
 }
 const t=await setup();await button(t.page,'Reject').click();await closed(t.page);assert.equal((await record(t.page)).choice,'rejected');assert.equal(t.scripts.length,0);await assertGate(t.page,false);results.push({case:'one-click reject',noGoogleRequests:true});await t.close();
 if(stage==='candidate'){
  const t=await setup({host:backend});await button(t.page,'Accept cookies').click();await closed(t.page);assert.equal(t.scripts.length,0);assert.deepEqual(await events(t.page),[]);results.push({case:'private deployment origin',analyticsBlocked:true});await t.close();
 }
 const report={checkedAt:new Date().toISOString(),sourceCommit:'773a210',stage,backend,browserOrigin:origin,googleScripts:'stubbed or deliberately blocked; application dispatch evidence only',realCollectorRequests:0,realProviderMutations:0,blockedCollectors,blockedMutations,results};
 await fs.writeFile(outfile,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
} catch(error){console.error(clean(error));process.exitCode=1;}finally{await browser.close();}
