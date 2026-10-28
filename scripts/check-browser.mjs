import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
async function revealWholePage() {
  await page.evaluate(async () => {
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight * .65) {
      window.scrollTo({ top, behavior: 'instant' });
      await frame();
      await frame();
    }
  });
  await page.waitForFunction(() => !document.querySelector('[data-reveal-state="pending"]'), null, { timeout: 10000 });
  await page.evaluate(async () => {
    const reveals = document.getAnimations().filter(animation => animation.effect?.target instanceof Element && animation.effect.target.matches('[data-reveal]'));
    await Promise.all(reveals.map(animation => animation.finished.catch(() => {})));
  });
}
try {
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await page.getByRole('heading', { name: /Excellence. Growth. A brighter future./ }).waitFor();
  assert.ok(await page.locator('[data-reveal-state="pending"]').count() > 0, 'Off-screen reveals are initialized');
  await revealWholePage();
  for (const id of ['why-dgs', 'life-at-dgs', 'boarding', 'programmes', 'faqs']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(img => img.complete || img.getClientRects().length > 0).map(img => img.decode().catch(() => {}))); });
  await page.locator('#life-at-dgs').scrollIntoViewIfNeeded();
  await page.locator('#life-at-dgs').screenshot({ path: 'artifacts/school-life-desktop.png' });
  await page.locator('#boarding').scrollIntoViewIfNeeded();
  await page.locator('#boarding').screenshot({ path: 'artifacts/north-east-benefits-desktop.png', style: 'header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.locator('#faqs').scrollIntoViewIfNeeded();
  await page.locator('#faqs').screenshot({ path: 'artifacts/faq-desktop.png', style: 'header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.locator('footer').screenshot({ path: 'artifacts/footer-desktop.png', style: 'header, .scroll-progress, .skip-link { visibility: hidden; }' });
  await page.locator('#programmes').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => document.querySelector('.dgs-partners-section-partners').getAnimations().some(animation => animation.playState === 'running'));
  const orbit = await page.evaluate(() => {
    const track = document.querySelector('.dgs-partners-section-partners');
    const counters = [...document.querySelectorAll('[data-orbit-counter]')];
    const animations = [track, ...counters].flatMap(element => element.getAnimations());
    const center = element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    };
    const sample = time => {
      animations.forEach(animation => { animation.currentTime = time; });
      const school = center(document.querySelector('.dgs-partners-section-schoolBadge'));
      const badges = [...track.querySelectorAll('[role="tab"]')].map(center);
      const orientation = new DOMMatrix(getComputedStyle(track).transform).multiply(new DOMMatrix(getComputedStyle(counters[0]).transform));
      return { school, badges, orientation: [orientation.a, orientation.b, orientation.c, orientation.d] };
    };
    const start = sample(0);
    const moved = sample(5000);
    sample(0);
    return { start, moved, durations: animations.map(animation => animation.effect.getTiming().duration), count: animations.length };
  });
  assert.equal(orbit.count, 6, 'Only the outer track and five logo wrappers rotate');
  assert.ok(orbit.durations.every(duration => duration === 40000), 'A full orbit takes 40 seconds');
  assert.deepEqual(orbit.start.school, orbit.moved.school, 'Doon Global remains fixed at the centre');
  for (let index = 0; index < 5; index++) {
    const before = orbit.start.badges[index];
    const after = orbit.moved.badges[index];
    assert.ok(Math.hypot(after.x - before.x, after.y - before.y) > 70, 'Partner moves around the circle');
    const radiusBefore = Math.hypot(before.x - orbit.start.school.x, before.y - orbit.start.school.y);
    const radiusAfter = Math.hypot(after.x - orbit.moved.school.x, after.y - orbit.moved.school.y);
    assert.ok(Math.abs(radiusBefore - radiusAfter) < 1, 'Partner stays on its circular orbit');
  }
  assert.ok(orbit.moved.orientation.every((value, index) => Math.abs(value - [1, 0, 0, 1][index]) < .001), 'Counter-rotation keeps logos upright');
  await page.getByRole('button', { name: 'Pause programme rotation', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.dgs-partners-section-partners').getAnimations().every(animation => animation.playState === 'paused'));
  await page.getByRole('button', { name: 'Resume programme rotation', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.dgs-partners-section-partners').getAnimations().some(animation => animation.playState === 'running'));
  await page.locator('.group\\/orbit').hover({ position: { x: 5, y: 5 } });
  await page.waitForFunction(() => document.querySelector('.dgs-partners-section-partners').getAnimations().every(animation => animation.playState === 'paused'));
  await page.locator('#programmes').screenshot({ path: 'artifacts/partners-desktop.png' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await mkdir('artifacts', { recursive: true });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('header'), '::before').opacity === '0');
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/desktop-hero.png' });
  await page.evaluate(() => window.scrollTo({ top: 320, behavior: 'instant' }));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('header'), '::before').opacity === '1');
  await page.screenshot({ path: 'artifacts/desktop-scrolled.png' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('header'), '::before').opacity === '0');

  await page.getByRole('button', { name: 'Enquire for 2027–28', exact: true }).click();
  await page.locator('.admissions-dialog img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.locator('.admissions-dialog').screenshot({ path: 'artifacts/enquiry-desktop.png' });
  await page.locator('#enquire').getByRole('button', { name: 'Privacy details', exact: true }).click();
  await page.locator('.privacy-dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.locator('.privacy-dialog').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('[name="consent"]').isChecked(), false);
  await page.getByRole('button', { name: 'Request a callback' }).click();
  await page.getByText('Enter a parent or guardian’s name (2–80 characters).', { exact: true }).waitFor();
  await page.locator('.admissions-dialog').screenshot({ path: 'artifacts/enquiry-errors.png' });
  await page.locator('#parent-name').fill('Preview Test Parent');
  await page.locator('#mobile').fill('9876543210');
  await page.locator('#grade').selectOption('6');
  await page.locator('#region').selectOption('Other');
  await page.locator('#city').fill('Guwahati');
  await page.locator('[name="consent"]').check();
  await page.getByRole('button', { name: 'Request a callback' }).click();
  await page.getByRole('heading', { name: 'Your enquiry is ready.' }).waitFor();
  await page.locator('.admissions-dialog').screenshot({ path: 'artifacts/enquiry-ready.png' });
  const email = await page.getByRole('link', { name: 'Open email & send' }).getAttribute('href');
  assert.ok(email.startsWith('mailto:admissions@doonglobalschool.edu.in?'));
  await page.getByRole('button', { name: 'Back to enquiry form' }).click();
  assert.equal(await page.locator('#parent-name').inputValue(), 'Preview Test Parent');
  await page.getByRole('button', { name: 'Close admissions enquiry' }).click();
  await page.getByRole('button', { name: 'Plan your child’s next step', exact: true }).click();
  await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'hidden' });
  for (const name of ['Request an admissions callback', 'Plan a campus visit']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'hidden' });
  }

  await page.getByRole('button', { name: 'Explore Academics', exact: true }).click();
  await page.getByRole('heading', { name: 'Curiosity today. Confidence tomorrow.' }).waitFor();
  await page.getByRole('button', { name: 'Explore Academics', exact: true }).press('Space');
  assert.equal(await page.locator('#school-life-details').isVisible(), false);
  await page.getByRole('button', { name: 'Explore Boarding Life', exact: true }).click();
  await page.getByRole('heading', { name: 'New friendships. A sense of belonging.' }).waitFor();
  await page.getByRole('button', { name: 'Explore Boarding Life', exact: true }).click();
  await page.getByRole('link', { name: 'Explore Life at DGS', exact: true }).click();
  await page.waitForURL('**/#programmes');

  await page.locator('.group\\/orbit').hover({ position: { x: 5, y: 5 } });
  await page.getByRole('tab', { name: 'Bengaluru FC' }).click();
  await page.getByRole('heading', { name: 'Find your footballing feet' }).waitFor();
  await page.getByRole('tab', { name: 'Bengaluru FC' }).press('ArrowRight');
  await page.getByRole('heading', { name: 'Clarity before the boards' }).waitFor();
  await page.mouse.move(0, 0);
  assert.equal(await page.locator('.dgs-partners-section-partners').evaluate(element => element.getAnimations().every(animation => animation.playState === 'paused')), true, 'Keyboard focus pauses the orbit');
  await page.getByRole('button', { name: /Which classes are eligible for boarding/ }).click();
  await page.locator('#answer-1').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#question-1').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#answer-0').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.locator('#answer-0').evaluate(element => element.inert), true);
  await page.locator('#question-1').press('ArrowDown');
  assert.equal(await page.locator('#question-2').evaluate(element => element === document.activeElement), true);
  await page.locator('#question-2').press('Enter');
  assert.equal(await page.locator('#question-2').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#faqs [aria-expanded="true"]').count(), 1);
  await page.locator('#question-2').press('Space');
  await page.locator('#answer-2').waitFor({ state: 'hidden' });
  await page.locator('#question-2').press('Home');
  assert.equal(await page.locator('#question-0').evaluate(element => element === document.activeElement), true);
  await page.locator('#question-0').press('Space');
  await page.getByRole('button', { name: 'Ask our admissions team', exact: true }).click();
  await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Enquire for admissions', exact: true }).waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Privacy details', exact: true }).last().click();
  await page.locator('.privacy-dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.locator('.privacy-dialog').waitFor({ state: 'hidden' });

  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert.ok(dimensions.page <= dimensions.viewport, `Horizontal overflow at ${width}px: ${dimensions.page}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await revealWholePage();
  for (const id of ['why-dgs', 'life-at-dgs', 'boarding', 'programmes', 'faqs']) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(img => img.complete || img.getClientRects().length > 0).map(img => img.decode().catch(() => {}))); });
  await page.locator('#life-at-dgs').scrollIntoViewIfNeeded();
  await page.locator('#life-at-dgs').screenshot({ path: 'artifacts/school-life-mobile.png', style: '.mobile-cta, header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.locator('#boarding').scrollIntoViewIfNeeded();
  await page.locator('#boarding').screenshot({ path: 'artifacts/north-east-benefits-mobile.png', style: '.mobile-cta, header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.locator('#faqs').scrollIntoViewIfNeeded();
  await page.locator('#faqs').screenshot({ path: 'artifacts/faq-mobile.png', style: '.mobile-cta, header, .skip-link, .scroll-progress { visibility: hidden; }' });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.locator('footer').screenshot({ path: 'artifacts/footer-mobile.png', style: '.mobile-cta, header, .scroll-progress, .skip-link { visibility: hidden; }' });
  await page.locator('#programmes').scrollIntoViewIfNeeded();
  await page.locator('#programmes').screenshot({ path: 'artifacts/partners-mobile.png', style: '.mobile-cta { visibility: hidden; }' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.locator('#mobile-menu').isVisible(), true);
  await page.screenshot({ path: 'artifacts/mobile-navigation.png' });
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Boarding life' }).click();
  assert.equal(await page.locator('#mobile-menu').count(), 0);
  await page.waitForFunction(() => Math.abs(document.getElementById('boarding').getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 3);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('header'), '::before').opacity === '0');
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/mobile-hero.png' });
  await page.getByRole('button', { name: 'Enquire now', exact: true }).click();
  await page.locator('.admissions-dialog').evaluate(async dialog => { await Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {}))); });
  await page.locator('.admissions-dialog').evaluate(dialog => { dialog.scrollTop = 0; });
  await page.screenshot({ path: 'artifacts/mobile-form.png' });
  for (const width of [390, 360]) {
    await page.setViewportSize({ width, height: 844 });
    const fits = await page.locator('.admissions-dialog').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth);
    assert.equal(fits, true, `Enquiry form fits ${width}px`);
  }
  const broken = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
  assert.deepEqual(broken, []);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-reveal-state="pending"]').count(), 0);
  assert.equal(await page.locator('[data-reveal]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '1')), true);
  assert.equal(await page.locator('.scroll-progress').evaluate(element => getComputedStyle(element).display), 'none');
  assert.equal(await page.locator('.dgs-partners-section-partners').evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.getByRole('button', { name: 'Pause programme rotation', exact: true }).isVisible(), false);
  const staticPage = await browser.newPage({ javaScriptEnabled: false });
  try {
    await staticPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    assert.equal(await staticPage.locator('[data-reveal]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '1')), true);
    assert.equal(await staticPage.locator('.dgs-partners-section-partners').evaluate(element => getComputedStyle(element).animationName), 'none');
  } finally { await staticPage.close(); }
  assert.deepEqual(errors, []);
  console.log('PASS: desktop/mobile layouts, no overflow (360–1440px), images, form validation + email fallback, tabs, keyboard navigation, FAQs, privacy, mobile anchors, footer CTAs, scroll reveals, reduced motion and no-JS content.');
} finally { await browser.close(); }
