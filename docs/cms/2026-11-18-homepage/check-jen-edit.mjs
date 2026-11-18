import fs from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire(process.cwd()+'/package.json');
const {createClient}=require('contentful');
const {documentToPlainTextString}=require('@contentful/rich-text-plain-text-renderer');
const {chromium}=createRequire('/home/eacastel/Avanti/clients/keanyassociates/package.json')('playwright-core');
const client=createClient({space:process.env.CONTENTFUL_SPACE_ID,accessToken:process.env.CONTENTFUL_ACCESS_TOKEN});
const entry=await client.getEntry('1qbeBkbNgHYTJjeqebOhmT');
const expected=documentToPlainTextString(entry.fields.body).replace(/\s+/g,'');
const browser=await chromium.launch({executablePath:'/home/eacastel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,args:['--no-sandbox']});
const result={checkedAt:new Date().toISOString(),entry:entry.sys.id,publishedAt:entry.sys.updatedAt,checks:[]};
try{
 for(const origin of ['https://chickzen.com','https://chickzen-preview.vercel.app']){
 const context=await browser.newContext();await context.route('**/*',r=>/google-analytics|googletagmanager|doubleclick/.test(r.request().url())||r.request().method()!=='GET'?r.abort():r.continue());
 const page=await context.newPage();await page.goto(origin+'/about',{waitUntil:'networkidle'});
 const actual=(await page.locator('.page-intro .editorial-prose').textContent()).replace(/\s+/g,'');
 let first=0;while(first<Math.min(actual.length,expected.length)&&actual[first]===expected[first])first++;
 result.checks.push({origin,exactCopy:actual===expected,expectedCharacters:expected.length,actualCharacters:actual.length,...(actual!==expected?{differenceAt:first,publishedExcerpt:expected.slice(first,first+180),renderedExcerpt:actual.slice(first,first+180)}:{})});await context.close();
 }
 fs.writeFileSync('docs/cms/2026-11-18-homepage/jen-edit-validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close()}
