const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),ts=require("typescript");
require.extensions[".ts"]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,"utf8"),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const policy=require("../src/lib/analytics/policy.ts");
const {legacyDestination}=require("../src/lib/legacy-routes.ts");
const catalog=require("../src/lib/analytics/catalog.json");
test("only exact HTTPS production origins and valid containers can collect",()=>{
 for(const value of ["https://chickzen.com","https://www.chickzen.com"])assert.ok(policy.allowedOrigin(value));
 for(const value of ["http://chickzen.com","https://chickzen.com.evil.test","https://chickzen-preview.vercel.app","https://chickzen.netlify.app","http://localhost:3000","https://chickzen.com:444"])assert.equal(policy.allowedOrigin(value),false);
 for(const value of ["","G-6PCNC6QKXE","GTM-X?secret=email"])assert.equal(policy.validContainer(value),false);
 assert.ok(policy.validContainer("GTM-WDHMFN7J"));
});
test("static page context cannot echo an unknown path, title, hash or query",()=>{
 assert.deepEqual(policy.safePage("/contact","https://chickzen.com"),{page_path:"/contact",page_location:"https://chickzen.com/contact",page_title:"Talk with Jen | chickzen"});
 for(const value of ["/private/visitor@example.com","/contact?email=visitor@example.com","/__proto__","constructor"]){
  const page=policy.safePage(value,"https://chickzen.com");assert.equal(page.page_path,"/404");assert.equal(page.page_title,"Page not found | chickzen");assert.equal(page.page_location,"https://chickzen.com/404");
 }
 assert.equal(Object.keys(catalog.pages).length,26);
 assert.equal(Object.keys(catalog.pages).filter(x=>x.startsWith("/blog/")).length,11);
 assert.equal(policy.safePage("/success","https://www.chickzen.com").page_location,"https://www.chickzen.com/success");
});
test("referrers keep only safe internal paths or external origins",()=>{
 assert.equal(policy.safeReferrer("https://chickzen.com/contact?email=private@example.com#secret","https://chickzen.com"),"https://chickzen.com/contact");
 assert.equal(policy.safeReferrer("https://referrer.example/private/person?token=secret#secret","https://chickzen.com"),"https://referrer.example");
 assert.equal(policy.safeReferrer("https://chickzen.com/private-person","https://chickzen.com"),"https://chickzen.com/404");
 for(const value of ["javascript:secret","https://person:password@example.com/private","invalid",""])assert.equal(policy.safeReferrer(value,"https://chickzen.com"),"");
});
test("only public lowercase campaign slugs survive; secrets and duplicates never do",()=>{
 assert.deepEqual(policy.safeCampaign("?utm_source=newsletter&utm_medium=email&utm_campaign=brand-clarity_2026&utm_id=autumn&utm_term=brand&utm_content=hero&gclid=SECRET&payment_intent_client_secret=SECRET&email=visitor@example.com"),{campaign_source:"newsletter",campaign_medium:"email",campaign_name:"brand-clarity_2026",campaign_id:"autumn",campaign_term:"brand",campaign_content:"hero"});
 for(const bad of ["UpperCase","visitor@example.com","https://example.com","call34606989881","1234567","word space","x".repeat(81),"<script>","%2Fsecret"]){
  assert.deepEqual(policy.safeCampaign("?utm_campaign="+encodeURIComponent(bad)),{});
 }
 assert.deepEqual(policy.safeCampaign("?utm_source=first&utm_source=second"),{});
});
test("event allowlists reject unknown services and discard any injected form or stale fields",()=>{
 assert.equal(Object.keys(catalog.services).length,13);
 for(const [id,category] of Object.entries(catalog.services))assert.deepEqual(policy.businessFields({event:"ck_service_select",service_id:id,link_placement:"content",email:"private@example.com"}),{event:"ck_service_select",service_id:id,service_category:category,link_placement:"content"});
 assert.equal(policy.businessFields({event:"ck_service_select",service_id:"private",link_placement:"content"}),null);
 assert.deepEqual(policy.businessFields({event:"ck_inquiry_accepted",service_id:"stale",email:"private@example.com",submissionId:"private"}),{event:"ck_inquiry_accepted",form_id:"contact_general"});
 assert.deepEqual(policy.businessFields({event:"ck_contact_click",contact_method:"whatsapp",link_placement:"header",service_id:"stale"}),{event:"ck_contact_click",contact_method:"whatsapp",link_placement:"header"});
 assert.equal(policy.businessFields({event:"ck_contact_click",contact_method:"private@example.com",link_placement:"content"}),null);
 assert.equal(policy.businessFields({event:"ck_contact_click",contact_method:"email",link_placement:"private"}),null);
});
test("consent expires and malformed or future records fail closed",()=>{
 const now=Date.now();
 for(const choice of ["accepted","rejected"])assert.equal(policy.readConsent(JSON.stringify({version:1,choice,expires:now+policy.CONSENT_DURATION}),now),choice);
 for(const raw of [null,"invalid",JSON.stringify({version:2,choice:"accepted",expires:now+1000}),JSON.stringify({version:1,choice:"accepted",expires:now-1}),JSON.stringify({version:1,choice:"accepted",expires:now+policy.CONSENT_DURATION*2})])assert.equal(policy.readConsent(raw,now),null);
});
test("legacy URLs retain their closest meaning and only approved campaign query values",()=>{
 const cases={"/origin-story":"/about","/good-vibes":"/about#recommendations","/lets-begin":"/contact","/shop":"/services","/home":"/","/journal":"/blog","/services/checkout":"/services/lets-begin","/journal/a-case-for-strawberry-lemonade":"/blog/a-case-for-strawberry-lemonade"};
 for(const [source,target] of Object.entries(cases))assert.equal(legacyDestination(new URL("https://chickzen.com"+source)).href,"https://chickzen.com"+target);
 assert.equal(legacyDestination(new URL("https://chickzen.com/cart")),null);
 assert.equal(legacyDestination(new URL("https://chickzen.com/journal/private-person")),null);
 const clean=legacyDestination(new URL("https://chickzen.com/good-vibes?utm_source=newsletter&email=private@example.com&gclid=secret&utm_campaign=public-campaign"));
 assert.equal(clean.href,"https://chickzen.com/about?utm_source=newsletter&utm_campaign=public-campaign#recommendations");
});
