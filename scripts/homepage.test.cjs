const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { homeBlock, homeLogos } = require('../src/lib/homepage-content.ts');
const block = (id, fields, type='homepageBlock') => ({ sys: { id, contentType: { sys: { id: type } } }, fields });
test('published home blocks override copy without changing other sections; explicit empty emphasis stays empty', () => {
  const page = { fields: { homepageContent: [block('homepage-hero', { heading: 'Jen’s edited headline', emphasis: '', body: 'First paragraph.\n\nSecond paragraph.' })] } };
  assert.equal(homeBlock(page, 'hero').heading, 'Jen’s edited headline');
  assert.equal(homeBlock(page, 'hero').emphasis, '');
  assert.equal(homeBlock(page, 'hero').primaryLink, '#begin');
  assert.equal(homeBlock(page, 'about').heading, 'A thoughtful partner.');
});
test('unpublished references and malformed fields preserve usable content', () => {
  for (const entry of [{ sys: { id: 'homepage-hero', type: 'Link' } }, block('homepage-hero', { heading: 42 }), block('homepage-hero', { heading: 'wrong model' }, 'section')]) {
    assert.equal(homeBlock({ fields: { homepageContent: [entry] } }, 'hero').heading, homeBlock(null, 'hero').heading);
  }
});
const image = (id, url, contentType='image/png') => ({ sys: { id }, fields: { title: id, file: { url, contentType, details: { image: { width: 300, height: 200 } } } } });
test('homepage accepts only supported CMS images and drops unresolved or duplicate logo references', () => {
  const safe = image('logo', '//images.ctfassets.net/space/logo.png');
  const page = { fields: { section: [block('clients', { title: 'Jen’s clients', logos: [safe, safe, {sys:{id:'draft'}}, image('bad', 'https://example.com/logo.png'), image('pdf', '//images.ctfassets.net/file', 'application/pdf')] }, 'logoCarousel')], homepageContent: [block('homepage-portrait', { image: safe })] } };
  assert.equal(homeLogos(page).title, 'Jen’s clients');
  assert.equal(homeLogos(page).logos.length, 1);
  assert.equal(homeBlock(page, 'portrait').image.url, 'https://images.ctfassets.net/space/logo.png');
  page.fields.homepageContent[0].fields.image = image('bad', 'javascript:alert(1)');
  assert.equal(homeBlock(page, 'portrait').image, undefined);
});
