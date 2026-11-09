const {test, beforeEach}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),Module=require("node:module");
const ts=require("typescript");
// Compile the isolated server modules in memory; all provider requests are mocked.
const resolve=Module._resolveFilename;
Module._resolveFilename=function(id,parent,...rest){return resolve.call(this,id.startsWith("@/")?path.join(__dirname,"../src",id.slice(2)):id,parent,...rest);};
Module._extensions[".ts"]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,"utf8"),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {POST}=require("../src/app/api/contact/route.ts");
const {quoteServices}=require("../src/lib/checkout.ts");
const {GET:geo}=require("../src/app/api/geo/route.ts");
const {isPublicProduction,isAnalyticsProduction}=require("../src/lib/deployment.ts");
const inquiry={name:"Review Visitor",email:"visitor@example.com",business:"Example business",topic:"Clarity & focused strategy",message:"I would like help clarifying the positioning for my business.",newsletter:false,website:"",submissionId:"0e2b5612-57bc-4a9a-bf3e-657cf6416880"};
let calls=[];
const request=(body=inquiry,origin="https://chickzen.test")=>new Request("https://chickzen.test/api/contact",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(body)});
beforeEach(()=>{
 calls=[];Object.assign(process.env,{SITE_LAUNCHED:"false",ANALYTICS_ENABLED:"false",VERCEL_ENV:"preview",NEXT_PUBLIC_GTM_ID:"",EMAIL_DELIVERY_ENABLED:"true",RESEND_API_KEY:"test-not-a-real-key",CONTACT_EMAIL_FROM:"website@example.com",CONTACT_EMAIL_TO:"jen@example.com",MAILERLITE_API_KEY:"test-not-a-real-key",MAILERLITE_GROUP_ID:"test-group"});
 global.fetch=async(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return Response.json({id:"mock-acknowledgement"});};
});
test("cross-origin requests never send email",async()=>{assert.equal((await POST(request(inquiry,"https://other.test"))).status,403);assert.equal(calls.length,0);});
test("invalid email, short message and filled honeypot never send",async()=>{
 for(const change of [{email:"bad\r\nBcc: other@example.com"},{message:"short"},{website:"spam"},{newsletter:"yes"}])assert.equal((await POST(request({...inquiry,...change}))).status,400);
 assert.equal(calls.length,0);
});
test("oversized payload rejected before provider calls",async()=>{assert.equal((await POST(request({...inquiry,message:"x".repeat(17000)}))).status,413);assert.equal(calls.length,0);});
test("disabled preview fails closed with email fallback",async()=>{process.env.EMAIL_DELIVERY_ENABLED="false";assert.equal((await POST(request())).status,503);assert.equal(calls.length,0);});
test("accepted inquiry uses fixed inbox, visitor reply-to and stable retry key",async()=>{
 const response=await POST(request());assert.equal(response.status,202);assert.deepEqual(await response.json(),{accepted:true,analyticsEligible:false,newsletterWarning:false});assert.equal(calls.length,1);
 assert.equal(calls[0].url,"https://api.resend.com/emails");assert.deepEqual(calls[0].body.to,["jen@example.com"]);assert.equal(calls[0].body.reply_to,inquiry.email);assert.equal(calls[0].options.headers["Idempotency-Key"],"chickzen-inquiry/"+inquiry.submissionId);
});
test("newsletter requires explicit opt-in and never forces resubscription",async()=>{
 assert.equal((await POST(request({...inquiry,newsletter:true}))).status,202);assert.equal(calls.length,2);assert.equal(calls[1].url,"https://connect.mailerlite.com/api/subscribers");assert.deepEqual(calls[1].body.groups,["test-group"]);assert.equal(calls[1].body.resubscribe,undefined);assert.equal(calls[1].body.status,undefined);
});
test("email failure cannot produce success or a newsletter signup",async()=>{
 global.fetch=async()=>Response.json({error:"provider failure"},{status:500});assert.equal((await POST(request({...inquiry,newsletter:true}))).status,502);
});
test("newsletter failure preserves the accepted inquiry with an honest warning",async()=>{
 global.fetch=async(url)=>url.includes("resend")?Response.json({id:"mock"}):Response.json({error:"unavailable"},{status:503});
 const response=await POST(request({...inquiry,newsletter:true}));assert.equal(response.status,202);assert.deepEqual(await response.json(),{accepted:true,analyticsEligible:false,newsletterWarning:true});
});
const types=[{fields:{services:[{sys:{id:"clarity",type:"Entry"},fields:{price:300,usPrice:350}},{sys:{id:"messaging",type:"Entry"},fields:{price:450}}]}}];
test("checkout calculates amounts from CMS prices and selected currency",()=>{
 assert.equal(quoteServices(["clarity","messaging"],"EUR",types).amount,75000);assert.equal(quoteServices(["clarity","messaging"],"USD",types).amount,80000);
});
test("checkout rejects unknown, repeated, empty services and invalid currency",()=>{
 for(const [ids,currency] of [[["missing"],"EUR"],[["clarity","clarity"],"EUR"],[[],"EUR"],[["clarity"],"GBP"]])assert.throws(()=>quoteServices(ids,currency,types));
});
test("geolocation supports Vercel and Netlify without shared caching",async()=>{
 let response=await geo(new Request("https://chickzen.test/api/geo",{headers:{"x-vercel-ip-country":"US","x-nf-geo":'{"country":"ES"}'}}));assert.deepEqual(await response.json(),{geo:{country:"US"}});assert.equal(response.headers.get("cache-control"),"private, no-store");
 response=await geo(new Request("https://chickzen.test/api/geo",{headers:{"x-nf-geo":'{"country":"ES"}'}}));assert.deepEqual(await response.json(),{geo:{country:"ES"}});
});
test("preview stays unindexed even when the launch flag is accidentally enabled",()=>{
 process.env.SITE_LAUNCHED="true";process.env.VERCEL_ENV="preview";assert.equal(isPublicProduction(),false);process.env.VERCEL_ENV="production";assert.equal(isPublicProduction(),true);process.env.SITE_LAUNCHED="false";assert.equal(isPublicProduction(),false);
});


test("acknowledged delivery is analytics eligible only on the released production domain", async()=>{
 Object.assign(process.env,{SITE_LAUNCHED:"true",ANALYTICS_ENABLED:"true",VERCEL_ENV:"production",NEXT_PUBLIC_GTM_ID:"GTM-WDHMFN7J"});
 for(const [origin,eligible] of [["https://chickzen.com",true],["https://www.chickzen.com",true],["https://chickzen-preview.vercel.app",false],["http://chickzen.com",false],["https://chickzen.com.example.org",false]]){
  const response=await POST(new Request(origin+"/api/contact",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(inquiry)}));
  assert.equal(response.status,202);assert.equal((await response.json()).analyticsEligible,eligible);
 }
 process.env.NEXT_PUBLIC_GTM_ID="";
 const response=await POST(new Request("https://chickzen.com/api/contact",{method:"POST",headers:{origin:"https://chickzen.com","content-type":"application/json"},body:JSON.stringify(inquiry)}));
 assert.equal((await response.json()).analyticsEligible,false);
});
test("a successful HTTP response without a provider acknowledgement never accepts an inquiry",async()=>{
 for(const result of [{},{id:""},{id:" "},{id:5}]){
  global.fetch=async()=>Response.json(result);
  const response=await POST(request());assert.equal(response.status,502);assert.notEqual((await response.json()).accepted,true);
 }
});

test("analytics release is independent from public indexing and fails closed",async()=>{
 Object.assign(process.env,{SITE_LAUNCHED:"true",VERCEL_ENV:"production",NEXT_PUBLIC_GTM_ID:"GTM-WDHMFN7J",ANALYTICS_ENABLED:"false"});
 assert.equal(isPublicProduction(),true);assert.equal(isAnalyticsProduction(),false);
 const send=()=>POST(new Request("https://chickzen.com/api/contact",{method:"POST",headers:{origin:"https://chickzen.com","content-type":"application/json"},body:JSON.stringify(inquiry)}));
 assert.equal((await(await send()).json()).analyticsEligible,false);
 process.env.ANALYTICS_ENABLED="true";assert.equal(isAnalyticsProduction(),true);
 assert.equal((await(await send()).json()).analyticsEligible,true);
 process.env.VERCEL_ENV="preview";assert.equal(isAnalyticsProduction(),false);
 assert.equal((await(await send()).json()).analyticsEligible,false);
 delete process.env.ANALYTICS_ENABLED;process.env.VERCEL_ENV="production";assert.equal(isAnalyticsProduction(),false);
});
