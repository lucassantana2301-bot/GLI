import {readFile,writeFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
await writeFile('dist/main.js',stripTypeScriptTypes(await readFile('src/main.ts','utf8'),{mode:'strip'}));
console.log('TypeScript transpilado para dist/main.js, sem dependências.');
