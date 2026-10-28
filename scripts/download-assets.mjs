import { mkdir, writeFile } from 'node:fs/promises';

const assets = {
  'logo.webp': 'images/brand/dgs-logo-256.webp',
  'logo-white.webp': 'images/brand/dgs-logo-white-256.webp',
  'campus.webp': 'images/about/dgs-image-8-1200.webp',
  'classroom.webp': 'images/gallery/IMG_6694-min.webp',
  'academics.webp': 'images/gallery/IMG_6698-min.webp',
  'sports.webp': 'images/events/sportsteam.webp',
  'creativity.webp': 'images/events/annual-day-2023-10.webp',
  'boarding.webp': 'images/campus/brd4.webp',
  'leadership.webp': 'images/investiture/Faith-House.webp',
  'campus-life.webp': 'images/campus/dgs-photo-dsc09401.webp',
  'goalkeepers.webp': 'images/associates/goalkeepers-logo.webp',
  'bengaluru.webp': 'images/associates/bengaluru-fc-soccer-schools-logo.webp',
  'prayaas.webp': 'images/associates/prayaas-assessments-logo.webp',
  'centurion.webp': 'images/associates/centurion-defence-academy-logo.webp',
  'kidnasium.webp': 'images/associates/kidnasium-logo.webp',
};
await mkdir('public/images', { recursive: true });
const queue = Object.entries(assets);
async function worker() {
  for (let entry; (entry = queue.shift());) {
    const [filename, source] = entry;
    const response = await fetch(`https://www.doonglobalschool.edu.in/${source}`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
    await writeFile(`public/images/${filename}`, Buffer.from(await response.arrayBuffer()));
    console.log(`Saved ${filename}`);
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
