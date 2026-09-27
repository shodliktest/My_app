import { readFileSync } from 'node:fs';
const speech = readFileSync(new URL('../src/lib/speech.ts', import.meta.url), 'utf8');
const listening = readFileSync(new URL('../src/lib/listening-intelligence.ts', import.meta.url), 'utf8');
const lesson = readFileSync(new URL('../src/components/lesson-player.tsx', import.meta.url), 'utf8');
const checks = [
  ['central speech abstraction', speech.includes('export async function speak')],
  ['optional ResponsiveVoice', speech.includes('VITE_RESPONSIVEVOICE_KEY')],
  ['native fallback', speech.includes('nativeSpeak')],
  ['dictation generator', listening.includes('makeDictation')],
  ['dictation scoring', listening.includes('scoreDictation')],
  ['lesson dictation mode', lesson.includes('Dictation')],
  ['natural voice button', lesson.includes('Play natural voice')],
];
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`);
if (checks.some(([, ok]) => !ok)) process.exit(1);
console.log('Listening intelligence audit: PASS');
