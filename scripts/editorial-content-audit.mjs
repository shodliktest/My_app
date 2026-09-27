import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/content/pre-a1.ts','src/content/pre-a1-more.ts','src/content/a1.ts','src/content/a2.ts','src/content/a2-more.ts',
  'src/content/b1.ts','src/content/b1plus.ts','src/content/b2.ts','src/content/b2plus.ts','src/content/c1.ts','src/content/advanced.ts'
];
const text = files.map(f => fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const checks = [
  ['placeholder token', /\[(?:word|topic|insert|example|... )\]/i],
  ['generic advanced word example', /We need to discuss \$\{word\} in context/i],
  ['fake key-word collocation', /key \$\{word\}/i],
  ['fake word-policy collocation', /\$\{word\} policy/i],
  ['template meta language', /This is a (?:sample|template|placeholder)/i],
];
let failed = false;
for (const [name, re] of checks) {
  const ok = !re.test(text);
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) failed = true;
}
const ids = [...text.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
const dup = ids.filter((id,i) => ids.indexOf(id) !== i);
console.log(`✓ duplicate literal IDs: ${new Set(dup).size}`);
const advanced = fs.readFileSync(path.join(root,'src/content/advanced.ts'),'utf8');
const counts = {};
for (const m of advanced.matchAll(/makeLesson\("([^"]+)",\s*\d+,\s*"([^"]+)"/g)) counts[m[2]]=(counts[m[2]]||0)+1;
console.log('✓ advanced counts:', JSON.stringify(counts));
if (failed) process.exit(1);
