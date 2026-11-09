// Local-only fixture using the actual analytics modules, without a Next build or providers.
// QA browsers map https://chickzen.com to this fixture and block every Google collector.
// Never navigate a production origin without that interception in place.
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),ts=require("typescript");
const root=path.resolve(__dirname,".."),catalog=require("../src/lib/analytics/catalog.json");
const container="GTM-WDHMFN7J";
function bundle(){
 const modules={};
 for(const name of ["policy","client"]){
  modules["./"+name]=ts.transpileModule(fs.readFileSync(path.join(root,"src/lib/analytics",name+".ts"),"utf8"),{compilerOptions:{esModuleInterop:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
 }
 modules["./catalog.json"]="module.exports="+JSON.stringify(catalog);
 return `(()=>{const definitions={${Object.entries(modules).map(([id,code])=>JSON.stringify(id)+":function(module,exports,require){"+code+"}").join(",")}};const cache={};function require(id){if(!cache[id]){cache[id]={exports:{}};definitions[id](cache[id],cache[id].exports,require);}return cache[id].exports;}window.__ck=require('./client');})();`;
}
function html(){
 return `<!doctype html><html><head><meta charset="utf-8"><title>Local analytics fixture</title></head><body>
 <header class="masthead"><a id="email" href="mailto:hello@chickzen.com">Email</a><a id="phone" href="tel:+34606989881">Phone</a><a id="whatsapp" href="https://wa.me/34606989881">WhatsApp</a></header>
 <main><h1>Local analytics contract fixture</h1><a id="contact" href="/contact">Contact</a><a id="about" href="/about">About</a><a id="home" href="/">Home</a><a id="anchor" href="#begin">Anchor</a><a id="guide" data-guide-request="strawberry_lemonade" href="mailto:hello@chickzen.com?subject=guide">Guide request</a>
 ${Object.keys(catalog.services).map(id=>`<a data-service-id="${id}" href="/contact?service=${id}">${id}</a>`).join(" ")}
 <div id="begin">Contact section</div><button id="accept">Accept analytics</button><button id="reject">Reject analytics</button></main>
 <script src="/analytics.js"></script><script>
 window.__cleanup=__ck.configureAnalytics(true,${JSON.stringify(container)});
 document.querySelector('#accept').onclick=()=>__ck.chooseAnalytics('accepted');
 document.querySelector('#reject').onclick=()=>__ck.chooseAnalytics('rejected');
 document.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;event.preventDefault();const url=new URL(link.href);if(url.origin===location.origin){history.pushState(history.state,'',url);__ck.trackPage();}});
 window.addEventListener('popstate',()=>__ck.trackPage());
 </script></body></html>`;
}
const server=http.createServer((req,res)=>{
 if(req.method!=="GET"){res.writeHead(405);res.end();return;}
 res.setHeader("Cache-Control","no-store");
 if(req.url.split("?")[0]==="/analytics.js"){res.setHeader("Content-Type","application/javascript");res.end(bundle());return;}
 res.setHeader("Content-Type","text/html; charset=utf-8");res.end(html());
});
server.listen(0,"127.0.0.1",()=>{
 const ready={origin:`http://127.0.0.1:${server.address().port}`,port:server.address().port,source:root,containerId:container,requiresProductionHostInterception:true};
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(ready,null,2));
 console.log(JSON.stringify(ready));
});
