import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'src/content');
const files = [
  'pre-a1.ts','pre-a1-more.ts','a1.ts','a2.ts','a2-more.ts','b1.ts','b1plus.ts','b2.ts','b2plus.ts','c1.ts','advanced.ts'
];
const source = files.map(f => fs.readFileSync(path.join(contentDir, f), 'utf8')).join('\n');

const expected = [
  ['pre-a1', 10], ['a1', 16], ['a2', 8], ['b1', 12],
  ['b1-plus', 10], ['b2', 15], ['b2-plus', 10], ['c1', 19],
];

const ids = [...source.matchAll(/(?:id:\s*|makeLesson\(\s*)["']([^"']+)["']/g)].map(m => m[1]);
const unique = new Set(ids);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);

const advancedIds = [...source.matchAll(/makeLesson\(\s*["']([^"']+)["']/g)].map(m => m[1]);
const advancedCount = advancedIds.length;

const checks = [];
checks.push([duplicates.length === 0, `unique lesson IDs: ${unique.size} (${duplicates.length} duplicates)`]);
checks.push([advancedCount === 54, `advanced lessons: ${advancedCount}/54`]);

for (const [level, count] of expected) {
  const actual = ids.filter(id => new RegExp(`^${level.replace('+','\\+')}-\\d+$`).test(id)).length;
  checks.push([actual === count, `${level}: ${actual}/${count} lessons`]);
}

const curriculumSource = fs.readFileSync(path.join(contentDir, 'curriculum.ts'), 'utf8');
checks.push([curriculumSource.includes('applyCurriculum'), 'curriculum metadata layer exists']);
checks.push([curriculumSource.includes('prerequisiteIds'), 'explicit prerequisite chain exists']);
checks.push([curriculumSource.includes('spacedReviewIds'), 'spaced retrieval targets exist']);
checks.push([curriculumSource.includes('phaseFor'), 'CEFR phase progression exists']);

const cefr = fs.readFileSync(path.join(root, 'src/lib/cefr.ts'), 'utf8');
checks.push([/"b1-plus"[\s\S]*?days:\s*"10 lessons"/.test(cefr), 'B1+ count label matches 10']);
checks.push([/b2:[\s\S]*?days:\s*"15 lessons"/.test(cefr), 'B2 count label matches 15']);
checks.push([/"b2-plus"[\s\S]*?days:\s*"10 lessons"/.test(cefr), 'B2+ count label matches 10']);

// Known editorial regression class: shifted Uzbek translations in the C1 block.
const badShiftPhrases = [
  'Bu yondashuv… shunday natija…',
  'Unga xabar berilishi juda muhim.',
  'Hech qanday holatda bunga e’tibor berilmasligi kerak.',
  'Xarajatlar barqaror bo‘lib qolsa, reja amalga oshirishga yaroqli.',
  'ma’lumotlar yig‘iladigan jarayon',
  'Qanchalik qiyin bo‘lmasin, biz davom etamiz.',
];
// These phrases are valid in their corrected lesson; only fail if they are still attached to the wrong lesson by checking the old shift sequence.
const c1Lines = source.split('\n').filter(l => /makeLesson\("c1-(88|89|90|91|92|93|94|95|96|97|98|99|100|101|102)"/.test(l));
const c1Order = c1Lines.map(l => {
  const id = l.match(/makeLesson\("(c1-\d+)"/)?.[1];
  const quoted = [...l.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1]);
  return { id, exUz: quoted[7] };
});
const expectedC1 = new Map([
  ['c1-88','O‘sha paytga kelib, u u yerda yillar davomida ishlab kelayotgan edi.'],
  ['c1-89','Unga xabar berilishi juda muhim.'],
  ['c1-90','Hech qanday holatda bunga e’tibor berilmasligi kerak.'],
  ['c1-91','Xarajatlar barqaror bo‘lib qolsa, reja amalga oshirishga yaroqli.'],
  ['c1-92','Ma’lumotlar yig‘iladigan jarayon.'],
  ['c1-93','Qanchalik qiyin bo‘lmasin, biz davom etamiz.'],
  ['c1-94','Dalillar ta’sir cheklanganini ko‘rsatmoqda.'],
  ['c1-95','Buni qilishingiz shart emas edi.'],
  ['c1-96','Darajani ko‘tarish; noaniq/aniq chegarasi bo‘lmagan masala.'],
  ['c1-97','Birgalikda ko‘rib chiqilganda, bu topilmalar shuni ko‘rsatadiki…'],
  ['c1-98','Tadqiqot aniqladi… → Topilmalar shuni ko‘rsatadiki…'],
  ['c1-99','Buni amalga oshirish imkoniyatingiz bormi?'],
  ['c1-100','Dalillar bu da’voni qo‘llab-quvvatlaydi, garchi…'],
  ['c1-101','Bu masala ayniqsa muhim, chunki…'],
  ['c1-102','Eng aniq strukturani kommunikativ maqsadga mos tanlang.'],
]);
let translationOk = c1Order.length === expectedC1.size && c1Order.every(x => expectedC1.get(x.id) === x.exUz);
checks.push([translationOk, 'C1 88–102 Uzbek example alignment']);

for (const [ok, msg] of checks) console.log(`${ok ? '✓' : '✗'} ${msg}`);
if (checks.some(([ok]) => !ok)) process.exit(1);
