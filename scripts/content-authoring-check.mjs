import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/content');
const files = fs.readdirSync(root).filter(f => f.endsWith('.ts'));
const text = files.map(f => fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const forbidden = [/namunaviy gap/gi,/use word/gi,/common word/gi,/sample sentence/gi,/\bplaceholder\s+content\b/gi];
const hits = forbidden.flatMap(re => [...text.matchAll(re)].map(m => m[0]));
const ids = [...text.matchAll(/id:\s*["'`]([^"'`]+)["'`]/g)].map(m=>m[1]);
const dup = ids.filter((id,i)=>ids.indexOf(id)!==i);
if (hits.length) throw new Error(`Forbidden placeholder text found: ${[...new Set(hits)].join(', ')}`);
if (dup.length) throw new Error(`Duplicate IDs found: ${[...new Set(dup)].join(', ')}`);
console.log(JSON.stringify({files:files.length, ids:ids.length, duplicates:[...new Set(dup)], placeholders:[]}, null, 2));
