import { mkdir, writeFile } from 'node:fs/promises';

const response = await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=DM+Serif+Display:ital@0;1&display=swap', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' }, signal: AbortSignal.timeout(20000) });
if (!response.ok) throw new Error(`Font stylesheet: ${response.status}`);
const css = await response.text();
const latin = [...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(match => match[0]).filter(block => block.includes('U+0000-00FF'));
if (latin.length !== 3) throw new Error(`Expected 3 Latin font faces, found ${latin.length}`);
await mkdir('public/fonts', { recursive: true });
await Promise.all(latin.map(async block => {
  const family = block.match(/font-family:\s*'([^']+)'/)[1];
  const italic = /font-style:\s*italic/.test(block);
  const index = family === 'DM Sans' ? 0 : italic ? 1 : 2;
  const url = block.match(/url\(([^)]+)\)/)[1];
  const font = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!font.ok) throw new Error(`Font: ${font.status}`);
  const name = `dgs-font-${index}.woff2`;
  await writeFile(`public/fonts/${name}`, Buffer.from(await font.arrayBuffer()));
}));
console.log('Saved 3 local font files for next/font/local in src/app/layout.tsx.');
