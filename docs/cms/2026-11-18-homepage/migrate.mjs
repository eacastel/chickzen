import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), dir=path.join(root,'docs/cms/2026-11-18-homepage');
fs.mkdirSync(dir,{recursive:true});
const space=process.env.CONTENTFUL_SPACE_ID, environment=process.env.CONTENTFUL_ENVIRONMENT||'master';
if(space!=='w36tuy329a8r'||environment!=='master') throw new Error('Unexpected Contentful target');
const {managementToken}=JSON.parse(fs.readFileSync('/home/eacastel/.contentfulrc.json','utf8'));
const base=`https://api.contentful.com/spaces/${space}/environments/${environment}`;
async function api(url,method='GET',data,version,extra={}) {
  const r=await fetch(url.startsWith('https:')?url:base+url,{method,headers:{Authorization:`Bearer ${managementToken}`,'Content-Type':'application/vnd.contentful.management.v1+json',...(version?{'X-Contentful-Version':String(version)}:{}),...extra},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(30000)});
  if(r.status===429){await new Promise(r=>setTimeout(r,1200));return api(url,method,data,version,extra)}
  const j=await r.json();
  if(!r.ok) throw new Error(`${method} ${url}: ${r.status} ${JSON.stringify(j.details||j.message)}`);
  await new Promise(r=>setTimeout(r,170));
  return j;
}
const save=(name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
const home=await api('/entries/3m54KNy4Au0MBD00EYMy8B');
const logos=await api('/entries/18KTHceIdEHdccjDio762d');
const pageModel=await api('/content_types/page');
const pageEditor=await api('/content_types/page/editor_interface');
for(const e of [home,logos,pageModel]) if(e.sys.publishedVersion!==e.sys.version-1) throw new Error(`Unpublished changes on ${e.sys.id}; preserve them`);
for(const [name,v] of [['home-before.json',home],['logos-before.json',logos],['page-model-before.json',pageModel],['page-editor-before.json',pageEditor]]) if(!fs.existsSync(path.join(dir,name)))save(name,v);
const defaults=JSON.parse(fs.readFileSync(path.join(root,'src/lib/homepage-defaults.json'),'utf8'));
const stringFields=[['name','Editor label (not shown on the site)','Symbol'],['eyebrow','Small heading above the title','Symbol'],['heading','Heading (Enter creates a line break)','Text'],['emphasis','Final heading line in italics','Symbol'],['label','Subtitle / caption','Symbol'],['summary','Short introduction (offer cards)','Text'],['body','Body text (blank line starts a paragraph)','Text'],['primaryLabel','Main button or link text','Symbol'],['primaryLink','Main button or link destination','Symbol'],['secondaryLabel','Second link text','Symbol'],['secondaryLink','Second link destination','Symbol'],['imageAlt','Image description for accessibility','Symbol']];
const modelFields=stringFields.map(([id,name,type])=>({id,name,type,localized:false,required:id==='name',validations:[]}));
modelFields.push({id:'image',name:'Photo',type:'Link',linkType:'Asset',localized:false,required:false,validations:[{linkMimetypeGroup:['image']}]});
const allModels=await api('/content_types?limit=100');
if(!allModels.items.some(m=>m.sys.id==='homepageBlock')) {
 const model=await api('/content_types/homepageBlock','PUT',{name:'Homepage Block',description:'Content for the current editorial homepage. Open Home > Homepage — current design and edit an existing block. Layout stays in the website.',displayField:'name',fields:modelFields});
 await api('/content_types/homepageBlock/published','PUT',undefined,model.sys.version);
 const editor=await api('/content_types/homepageBlock/editor_interface');
 const hints={heading:'Use Enter to choose line breaks. The italic final line is edited separately below.',body:'Plain text. Add a blank line between paragraphs.',primaryLink:'Keep #begin for the homepage form, #work for the service section, or use a site path such as /about.',secondaryLink:'Use an existing site path or section anchor.',name:'This identifies the section in Contentful. It is not displayed on the website.',image:'Used by the photo block. Publish a replacement image before publishing this entry.'};
 await api('/content_types/homepageBlock/editor_interface','PUT',{controls:modelFields.map(f=>({fieldId:f.id,widgetNamespace:'builtin',widgetId:f.id==='image'?'assetLinkEditor':f.type==='Text'?'multipleLine':'singleLine',...(hints[f.id]?{settings:{helpText:hints[f.id]}}:{})}))},editor.sys.version);
}
async function assetFromFile(id,file,title,description,contentType) {
 const found=await api(`/assets?sys.id=${id}`);if(found.items.length) return found.items[0];
 const upload=await fetch(`https://upload.contentful.com/spaces/${space}/uploads`,{method:'POST',headers:{Authorization:`Bearer ${managementToken}`,'Content-Type':'application/octet-stream'},body:fs.readFileSync(file),signal:AbortSignal.timeout(60000)});
 if(!upload.ok)throw new Error(`Asset upload ${id}: ${upload.status}`);
 const uj=await upload.json();
 const assetFields={title:{'en-US':title},description:{'en-US':description},file:{'en-US':{fileName:path.basename(file),contentType,uploadFrom:{sys:{type:'Link',linkType:'Upload',id:uj.sys.id}}}}};
 let a=await api(`/assets/${id}`,'PUT',{fields:assetFields});
 const process=await fetch(`${base}/assets/${id}/files/en-US/process`,{method:'PUT',headers:{Authorization:`Bearer ${managementToken}`,'X-Contentful-Version':String(a.sys.version)}});
 if(!process.ok)throw new Error(`Asset processing ${id}: ${process.status}`);
 for(let i=0;i<15;i++){await new Promise(r=>setTimeout(r,1000));a=await api(`/assets/${id}`);if(a.fields.file['en-US'].url)break}
 if(!a.fields.file['en-US'].url)throw new Error(`Asset not processed: ${id}`);
 return api(`/assets/${id}/published`,'PUT',undefined,a.sys.version);
}
const photo=await assetFromFile('jen-studio-portrait-editorial',path.join(root,'public/brand/jen-studio-headshot.png'),'Jennifer Castellanos — studio portrait','Jennifer Castellanos, founder of chickzen','image/png');
const zoanne=await assetFromFile('client-zoanne-clack','/home/eacastel/Avanti/clients/zoanneclack/app/icon.svg','Zoanne Clack','Zoanne Clack’s existing ZC mark','image/svg+xml');
const memorial=await assetFromFile('client-beverly-hills-911-memorial','/home/eacastel/Avanti/clients/BH911/assets/brand/beverly-hills-911-memorial-logo.png','Beverly Hills 9/11 Memorial Garden','Original Beverly Hills 9/11 Memorial Garden logo','image/png');
const links=[];
for(const [key,values] of Object.entries(defaults)) {
 const id=`homepage-${key}`;
 const existing=await api(`/entries?sys.id=${id}`);
 if(!existing.items.length){
  const fields=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{'en-US':v}]));
  if(key==='portrait')fields.image={'en-US':{sys:{type:'Link',linkType:'Asset',id:photo.sys.id}}};
  const e=await api(`/entries/${id}`,'PUT',{fields},undefined,{'X-Contentful-Content-Type':'homepageBlock'});
  await api(`/entries/${id}/published`,'PUT',undefined,e.sys.version);
 }
 links.push({sys:{type:'Link',linkType:'Entry',id}});
}
if(!pageModel.fields.some(f=>f.id==='homepageContent')){
 const newField={id:'homepageContent',name:'Homepage — current design',type:'Array',localized:false,required:false,validations:[],items:{type:'Link',linkType:'Entry',validations:[{linkContentType:['homepageBlock']}]}};
 const fields=[...pageModel.fields];fields.splice(2,0,newField);
 const updated=await api('/content_types/page','PUT',{name:pageModel.name,description:pageModel.description||'',displayField:pageModel.displayField,fields},pageModel.sys.version);
 await api('/content_types/page/published','PUT',undefined,updated.sys.version);
 const ei=await api('/content_types/page/editor_interface');
 const controls=(ei.controls||[]).filter(c=>c.fieldId!=='homepageContent');
 controls.push({fieldId:'homepageContent',widgetNamespace:'builtin',widgetId:'entryLinksEditor',settings:{helpText:'For the Home page: open these blocks to edit the current design. Edit and Publish each changed block. The older Sections field remains for other pages and the original homepage archive.'}});
 await api('/content_types/page/editor_interface','PUT',{controls},ei.sys.version);
}
const currentHome=await api(`/entries/${home.sys.id}`);
if(currentHome.sys.version!==home.sys.version)throw new Error('Home changed during preparation');
const newHome=await api(`/entries/${home.sys.id}`,'PUT',{fields:{...currentHome.fields,homepageContent:{'en-US':links},metaTitle:{'en-US':'Brand strategy & messaging for women | chickzen'},metaSummary:{'en-US':'Work with Jennifer Castellanos to clarify your positioning, shape your message and find a confident direction for your brand.'}}},currentHome.sys.version);
await api(`/entries/${home.sys.id}/published`,'PUT',undefined,newHome.sys.version);
const currentLogos=await api(`/entries/${logos.sys.id}`);
if(currentLogos.sys.version!==logos.sys.version)throw new Error('Logos changed during preparation');
const logoLinks=[...currentLogos.fields.logos['en-US']];
for(const a of [zoanne,memorial])if(!logoLinks.some(l=>l.sys.id===a.sys.id))logoLinks.push({sys:{type:'Link',linkType:'Asset',id:a.sys.id}});
const newLogos=await api(`/entries/${logos.sys.id}`,'PUT',{fields:{...currentLogos.fields,logos:{'en-US':logoLinks}}},currentLogos.sys.version);
await api(`/entries/${logos.sys.id}/published`,'PUT',undefined,newLogos.sys.version);
const result={publishedAt:new Date().toISOString(),space,environment,homeEntry:home.sys.id,homepageBlocks:links.length,logosEntry:logos.sys.id,logos:logoLinks.length,assets:[photo,zoanne,memorial].map(a=>({id:a.sys.id,title:a.fields.title['en-US'],url:a.fields.file['en-US'].url})),oldSectionsPreserved:true,applicationDeployed:false};save('cms-publication.json',result);console.log(JSON.stringify(result));
