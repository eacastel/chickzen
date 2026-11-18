const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
const calls=[];const originalLoad=Module._load;
Module._load=function(id,...args){if(id==='next/cache')return {revalidateTag:(...args)=>calls.push(['tag',...args]),revalidatePath:(...args)=>calls.push(['path',...args])};return originalLoad.call(this,id,...args)};
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {POST}=require('../src/app/api/revalidate/route.ts');
const secret='fixture-secret-only-not-a-real-key-12345';
Object.assign(process.env,{CONTENTFUL_REVALIDATE_SECRET:secret,CONTENTFUL_SPACE_ID:'test-space',CONTENTFUL_ENVIRONMENT:'master'});
const payload={id:'entry',spaceId:'test-space',environmentId:'master'};
const req=(body=payload,key=secret,topic='ContentManagement.Entry.publish')=>new Request('https://chickzen.test/api/revalidate',{method:'POST',headers:{'x-chickzen-revalidate-secret':key,'x-contentful-topic':topic,'content-type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});
test('missing/wrong credentials cannot invalidate caches',async()=>{
 calls.length=0;
 for(const key of ['',secret+'bad','x'.repeat(secret.length)])assert.equal((await POST(req(payload,key))).status,401);
 assert.equal(calls.length,0);
 delete process.env.CONTENTFUL_REVALIDATE_SECRET;assert.equal((await POST(req())).status,503);process.env.CONTENTFUL_REVALIDATE_SECRET=secret;
});
test('draft events, foreign content and oversized/malformed payloads cannot invalidate caches',async()=>{
 calls.length=0;
 assert.equal((await POST(req(payload,secret,'ContentManagement.Entry.save'))).status,202);
 for(const body of [{...payload,spaceId:'another-client'},{...payload,environmentId:'staging'},null,'{bad'])assert.equal((await POST(req(body))).status,400);
 assert.equal((await POST(req('x'.repeat(9000)))).status,413);assert.equal(calls.length,0);
});
test('published entry and asset events expire CMS data and dependent routes',async()=>{
 for(const topic of ['ContentManagement.Entry.publish','ContentManagement.Asset.publish','ContentManagement.Entry.unpublish','ContentManagement.Asset.delete']){
  calls.length=0;const response=await POST(req(payload,secret,topic));assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{revalidated:true});assert.equal(response.headers.get('cache-control'),'no-store');
  assert.deepEqual(calls,[['tag','contentful',{expire:0}],['path','/','layout']]);
 }
});
