const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const html = fs.readFileSync('vw-source.html', 'utf8');
const names = {hero:'Jetta-header-desktop',interior:'Jetta-GLI-20',design:'Jetta-design-01',cockpit:'Jetta-GLI-15',detail:'Jetta-GLI-11',rear:'Jetta-galeria-01'};
const sources = [];
for (const [file,name] of Object.entries(names)) {
 const urls = [...new Set(html.match(new RegExp('https://assets.volkswagen.com/is/image/volkswagenag/'+name+'\\?[A-Za-z0-9+/=]+','g')))];
 const candidates = urls.map(url => ({url,query:Buffer.from(url.split('?')[1],'base64').toString()})).filter(x=>x.query.includes('webp'));
 const chosen = candidates.filter(x=>/hei=/.test(x.query)).sort((a,b)=>Math.abs(Number(a.query.match(/wid=(\d+)/)[1])-1600)-Math.abs(Number(b.query.match(/wid=(\d+)/)[1])-1600))[0];
 if(!chosen) throw Error(name);
 execFileSync('curl.exe',['-f','-sS','-L',chosen.url,'-o',`dist/assets/${file}.webp`]);
 const bytes=fs.readFileSync(`dist/assets/${file}.webp`);
 if(bytes.toString('ascii',0,4)!=='RIFF') throw Error('Invalid image '+name);
 sources.push({file:`assets/${file}.webp`,asset:name,url:chosen.url,bytes:bytes.length});
}
fs.writeFileSync('dist/assets/sources.json',JSON.stringify(sources,null,2));
console.log(sources);
