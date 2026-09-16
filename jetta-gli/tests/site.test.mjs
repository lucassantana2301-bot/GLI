import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const html=await readFile('dist/index.html','utf8');
test('Todos os destinos internos existem e os IDs são únicos',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),id);
 for(const id of ['design','interior','performance','galeria'])assert.ok(ids.includes(id));
});
test('Arquivos referenciados existem e imagens têm descrições',async()=>{
 for(const [,url] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g))if(!url.startsWith('http'))assert.ok((await stat(resolve('dist',url))).size>0,url);
 for(const [tag] of html.matchAll(/<img\b[^>]*>/g))if(!tag.includes('lightbox-image'))assert.match(tag,/alt="[^"]+"/);
});
test('Fotografias são WebP válidos com fontes oficiais registradas',async()=>{
 const sources=JSON.parse(await readFile('dist/assets/sources.json','utf8'));
 assert.equal(sources.length,6);
 for(const source of sources){assert.equal(new URL(source.url).hostname,'assets.volkswagen.com');const bytes=await readFile('dist/'+source.file);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length<300000)}
});
test('Prévia HTTP entrega página, módulo e fotografias com MIME correto',async()=>{
 for(const [url,type] of [['/','text/html'],['/main.js','text/javascript'],['/assets/hero.webp','image/webp'],['/fontes.html','text/html']]){const response=await fetch('http://127.0.0.1:4174'+url);assert.equal(response.status,200);assert.ok(response.headers.get('content-type').startsWith(type))}
 assert.equal((await fetch('http://127.0.0.1:4174/inexistente')).status,404);
});
