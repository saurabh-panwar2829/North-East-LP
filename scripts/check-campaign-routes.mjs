import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
context.setDefaultTimeout(15000);
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('artifacts/campaigns', { recursive: true });
const path = name => `artifacts/campaigns/${name}.png`;

async function checkLayout() {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of ['admission-drive', 'why-dgs', 'life-at-dgs', 'boarding', 'programmes', 'faqs', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${page.url()} at ${width}px: ${id}`);
    }
    assert.ok(await page.locator('.dgs-admission-drive-content').evaluate(el => parseFloat(getComputedStyle(el).paddingTop) <= 80), 'Reduced motion skips the pre-roll space');
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].filter(img => img.getClientRects().length > 0).every(img => img.complete && img.naturalWidth > 0));
}

try {
  const redirect = await context.request.get(`${base}/?utm_source=route-check`, { maxRedirects: 0 });
  assert.equal(redirect.status(), 307);
  assert.equal(redirect.headers().location, '/north-east?utm_source=route-check');
  for (const campaign of ['north-east', 'uttar-pradesh', 'uttarakhand']) {
    const response = await page.goto(`${base}/${campaign}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith(`/${campaign}`));
    assert.ok((await page.locator('meta[property="og:url"]').getAttribute('content')).endsWith(`/${campaign}`));
    await checkLayout();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('header[data-scrolled="false"]').waitFor();
    await page.screenshot({ path: path(`${campaign}-desktop`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path(`${campaign}-mobile`) });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }

  assert.match(await page.title(), /Garhwal & Kumaun/);
  assert.doesNotMatch(await page.locator('main').innerText(), /North East|Siliguri|Guwahati/);
  await page.getByRole('button', { name: 'Kumaun 04', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Kumaun 04', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.dgs-admission-drive-stops li').count(), 4);
  await page.locator('.dgs-admission-drive-content').screenshot({ path: path('uttarakhand-drive'), style: 'header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.getByRole('button', { name: 'Register for the Haldwani admission drive', exact: true }).click();
  assert.equal(await page.locator('#region').inputValue(), 'Haldwani');
  assert.equal(await page.locator('#drive').inputValue(), 'Haldwani');
  assert.doesNotMatch(await page.locator('#drive').innerText(), /Siliguri|Guwahati/);
  await page.getByRole('button', { name: 'Register for Haldwani', exact: true }).click();
  assert.equal(await page.locator('#parent-name').evaluate(el => el === document.activeElement), true);
  await page.locator('#parent-name').fill('Preview Test Parent');
  await page.locator('#mobile').fill('9876543210');
  await page.locator('#grade').selectOption('6');
  await page.locator('#enquiry-consent').check();
  const submitted = page.waitForRequest(request => request.url().endsWith('/api/enquiry') && request.method() === 'POST');
  await page.getByRole('button', { name: 'Register for Haldwani', exact: true }).click();
  assert.equal((await submitted).postDataJSON().campaign, 'uttarakhand');
  await page.getByText('Your enquiry is ready.', { exact: true }).waitFor();
  assert.match(await page.locator('#enquire').innerText(), /has not been sent yet/);
  const email = new URL(await page.getByRole('link', { name: 'Open email & send' }).getAttribute('href'));
  assert.match(email.searchParams.get('body'), /Haldwani \(Kumaun\)/);
  assert.match(email.searchParams.get('subject'), /Uttarakhand/);
  // Inspect prepared links only; no WhatsApp or email message is sent.
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Garhwal 04', exact: true }).click();
  await page.getByRole('button', { name: 'Register for the New Tehri admission drive', exact: true }).click();
  assert.equal(await page.locator('#drive').inputValue(), 'New Tehri');
  assert.equal(await page.locator('#parent-name').inputValue(), 'Preview Test Parent');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Enquire for 2027–28', exact: true }).click();
  assert.equal(await page.locator('#drive').inputValue(), '');
  await page.locator('#region').selectOption('Other town in Uttarakhand');
  await page.getByRole('button', { name: 'Request a callback', exact: true }).click();
  await page.locator('#city-error').waitFor();
  await page.locator('#other-town').fill('Lansdowne');
  await page.getByRole('button', { name: 'Request a callback', exact: true }).click();
  await page.getByText('Your enquiry is ready.', { exact: true }).waitFor();
  const custom = new URL(await page.getByRole('link', { name: 'Open email & send' }).getAttribute('href'));
  assert.match(custom.searchParams.get('body'), /Lansdowne, Uttarakhand/);
  await page.keyboard.press('Escape');

  // Client-side navigation must remount campaign state and form choices.
  await page.getByRole('navigation', { name: 'Regional admission pages' }).getByRole('link', { name: 'North East', exact: true }).click();
  await page.waitForURL('**/north-east');
  await page.getByRole('heading', { name: /Excellence. Growth./ }).waitFor();
  await page.getByRole('button', { name: 'Register for the Guwahati admission drive', exact: true }).click();
  assert.equal(await page.locator('#region').inputValue(), 'Guwahati');
  assert.equal(await page.locator('#parent-name').inputValue(), '');
  assert.doesNotMatch(await page.locator('#drive').innerText(), /Haldwani|Almora/);
  await page.keyboard.press('Escape');
  await page.getByRole('navigation', { name: 'Regional admission pages' }).getByRole('link', { name: 'Uttarakhand · Garhwal & Kumaun', exact: true }).click();
  await page.waitForURL('**/uttarakhand');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Close navigation' }).waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.mobile-cta').getByRole('button', { name: 'Enquire now' }).click();
  assert.equal(await page.locator('#region').inputValue(), '');
  await page.locator('.admissions-dialog').screenshot({ path: path('uttarakhand-form-mobile') });
  await page.keyboard.press('Escape');

  const valid = { campaign: 'uttarakhand', name: 'Local Test Parent', phone: '9876543210', grade: '6', region: 'Haldwani', drive: 'Haldwani', interest: 'Boarding admissions', consent: true, website: '' };
  for (const invalid of [{ ...valid, campaign: 'north-east' }, { ...valid, drive: 'Guwahati' }, { ...valid, campaign: '__proto__' }, { ...valid, consent: false }]) {
    assert.equal((await context.request.post(`${base}/api/enquiry`, { data: invalid })).status(), 400);
  }
  assert.equal((await context.request.post(`${base}/api/enquiry`, { headers: { Origin: 'https://example.invalid' }, data: valid })).status(), 403);
  assert.equal((await context.request.post(`${base}/api/enquiry`, { data: { name: 'x'.repeat(9000) } })).status(), 413);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Kumaun 04', exact: true }).click();
  await page.getByRole('button', { name: 'Register for the Almora admission drive', exact: true }).click();
  assert.equal(await page.locator('#drive').inputValue(), 'Almora');
  await page.keyboard.press('Escape');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('navigation', { name: 'Regional admission pages' }).getByRole('link', { name: 'Uttar Pradesh', exact: true }).click();
  await page.waitForURL('**/uttar-pradesh');
  await page.locator('#hero-heading [lang="hi"]').waitFor();
  await page.waitForFunction(() => document.title.includes('Uttar Pradesh'));
  assert.match(await page.title(), /Uttar Pradesh/);
  assert.equal(await page.locator('[lang="gbm"]').count(), 0);
  assert.equal(await page.locator('#hero-heading [lang="hi"]').innerText(), 'बड़े सपनों की नई शुरुआत।');
  assert.doesNotMatch(await page.locator('main').innerText(), /Garhwal|Kumaun|Guwahati|Siliguri|own state|गढ़वाल|कुमाऊँ/);
  assert.equal(await page.locator('#faqs button[id^="question-"] span[lang="hi"]').count(), 6);
  assert.equal(await page.locator('#life-at-dgs article h3[lang="hi"]').count(), 0);
  assert.equal(await page.locator('#life-at-dgs .dgs-school-life-section-text > p[lang="hi"]').count(), 6);
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.locator('#hero-heading [lang="hi"]').evaluate(el => el.getBoundingClientRect().right <= el.parentElement.getBoundingClientRect().right + 1), `UP hero at ${width}px`);
  }
  for (const [region, cities] of [['West UP 06', ['Meerut', 'Muzaffarnagar', 'Saharanpur', 'Ghaziabad', 'Noida', 'Bareilly']], ['Central UP 02', ['Lucknow', 'Kanpur']]]) {
    await page.getByRole('button', { name: region, exact: true }).click();
    assert.equal(await page.locator('.dgs-admission-drive-stops li').count(), cities.length);
    assert.equal(await page.locator('.dgs-admission-drive-stops [data-pending="true"]').count(), cities.length);
    for (const city of cities) {
      await page.getByRole('button', { name: `Register for the ${city} admission drive`, exact: true }).click();
      assert.equal(await page.locator('#region').inputValue(), city);
      assert.equal(await page.locator('#drive').inputValue(), city);
      assert.equal(await page.locator('#parent-name').inputValue(), '');
      assert.doesNotMatch(await page.locator('#drive').innerText(), /Guwahati|Haldwani/);
      await page.keyboard.press('Escape');
    }
  }
  await page.getByRole('button', { name: 'West UP 06', exact: true }).click();
  await page.locator('.dgs-admission-drive-content').screenshot({ path: path('uttar-pradesh-drive'), style: 'header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.getByRole('button', { name: 'Register for the Meerut admission drive', exact: true }).click();
  await page.locator('#parent-name').fill('UP Preview Parent');
  await page.locator('#mobile').fill('9876543210');
  await page.locator('#grade').selectOption('6');
  await page.locator('#enquiry-consent').check();
  await page.locator('.admissions-dialog').screenshot({ path: path('uttar-pradesh-form-desktop') });
  const upSubmitted = page.waitForRequest(request => request.url().endsWith('/api/enquiry') && request.method() === 'POST');
  await page.getByRole('button', { name: 'Register for Meerut', exact: true }).click();
  assert.equal((await upSubmitted).postDataJSON().campaign, 'uttar-pradesh');
  await page.getByText('Your enquiry is ready.', { exact: true }).waitFor();
  const upEmail = new URL(await page.getByRole('link', { name: 'Open email & send' }).getAttribute('href'));
  assert.match(upEmail.searchParams.get('subject'), /Uttar Pradesh admission drive · Meerut/);
  assert.doesNotMatch(upEmail.searchParams.get('body'), /Garhwal|Kumaun|Uttarakhand|North East/);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Close navigation' }).waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.mobile-cta').getByRole('button', { name: 'Enquire now' }).click();
  assert.equal(await page.locator('#drive').inputValue(), '');
  await page.locator('#region').selectOption('Other town in Uttar Pradesh');
  assert.match(await page.locator('#other-town').getAttribute('placeholder'), /Uttar Pradesh/);
  await page.getByRole('button', { name: 'Request a callback', exact: true }).click();
  await page.locator('#city-error').waitFor();
  await page.locator('#other-town').fill('Bijnor');
  await page.locator('.admissions-dialog').screenshot({ path: path('uttar-pradesh-form-mobile') });
  await page.getByRole('button', { name: 'Request a callback', exact: true }).click();
  await page.getByText('Your enquiry is ready.', { exact: true }).waitFor();
  const upCustom = new URL(await page.getByRole('link', { name: 'Open email & send' }).getAttribute('href'));
  assert.match(upCustom.searchParams.get('body'), /Bijnor, Uttar Pradesh/);
  await page.keyboard.press('Escape');
  for (const invalid of [{ ...valid, campaign: 'uttar-pradesh' }, { ...valid, region: 'Meerut', drive: 'Lucknow' }, { ...valid, campaign: 'north-east', region: 'Meerut', drive: 'Lucknow' }]) {
    assert.equal((await context.request.post(`${base}/api/enquiry`, { data: invalid })).status(), 400);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Central UP 02', exact: true }).click();
  await page.getByRole('button', { name: 'Register for the Lucknow admission drive', exact: true }).click();
  assert.equal(await page.locator('#drive').inputValue(), 'Lucknow');
  await page.keyboard.press('Escape');
  await page.getByRole('navigation', { name: 'Regional admission pages' }).getByRole('link', { name: 'Uttarakhand · Garhwal & Kumaun', exact: true }).click();
  await page.waitForURL('**/uttarakhand');
  await page.getByRole('button', { name: 'Register for the Srinagar admission drive', exact: true }).click();
  assert.equal(await page.locator('#parent-name').inputValue(), '');
  assert.equal(await page.locator('#region').inputValue(), 'Srinagar');
  assert.equal(await page.locator('#hero-heading [lang="gbm"]').innerText(), 'नौन्याळौं कु भलु भोल।');
  assert.deepEqual(errors, []);
  console.log('Passed: three campaigns, metadata, redirect/query preservation, eight UP cities, regional isolation, forms, API validation, responsive layouts, images, mobile navigation and motion.');
} finally {
  await browser.close();
}
