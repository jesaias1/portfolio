import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { isSafeMediaReference } from '../../src/lib/media-reference';

const isCompactProject = (projectName: string) =>
  projectName.includes('mobile') || projectName.includes('tablet');
const isMobileProject = (projectName: string) => projectName.includes('mobile');
const isTabletProject = (projectName: string) => projectName.includes('tablet');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  page.on('pageerror', (error) => console.error(`Browser error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`Browser console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    console.error(`Browser request failed: ${request.url()} (${request.failure()?.errorText})`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) console.error(`Browser response: ${response.status()} ${response.url()}`);
  });
  await page.addInitScript(() => window.localStorage.setItem('jesaias-visited', 'true'));
});

test('public portfolio and project routes remain available', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jesaias');
  await expect(page.getByRole('heading', { name: /Tools, games and systems/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Results' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open ORVO' })).toBeVisible();
  await expect(page.getByText(/stickman knockout/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Animate the Jesaias signature' })).toBeVisible();

  await page.goto('/audio/orvo');
  await expect(page.getByRole('heading', { level: 1, name: 'ORVO' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Stretch sound until it becomes something else/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Browse portfolio projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Next project: MIDIUM' })).toBeVisible();

  await page.goto('/projects/kvizy');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Quiz night');
});

test('compact layouts keep the 3D hero while avoiding the heavy background video', async ({ page }, testInfo) => {
  test.skip(!isCompactProject(testInfo.project.name), 'Compact rendering behavior only.');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  await expect(page.locator('#home canvas')).toBeVisible();
  await expect(page.locator('video[src*="website"]')).toHaveCount(0);
});

test('public pages expose canonical and social metadata', async ({ page }, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'Metadata is viewport-independent.');

  await page.goto('/audio/orvo');
  await expect(page).toHaveTitle(/ORVO.*Jesaias/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://jesaias.dk/audio/orvo');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /projects\/orvo\.png/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
});

test('public catalogue pins ORVO and excludes retired projects', async ({ request }) => {
  const response = await request.get('/api/projects');
  expect(response.ok()).toBeTruthy();
  const projects = await response.json();

  expect(projects[0]).toMatchObject({ title: 'ORVO', image: '/projects/orvo.png' });
  expect(projects.some((project: { title: string }) => /stickman|stick fighting/i.test(project.title))).toBe(false);
});

test('project media paths reject unsafe protocols', async ({}, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'Pure validation only needs one project.');

  expect(isSafeMediaReference('/projects/videos/orvo.mp4', true)).toBe(true);
  expect(isSafeMediaReference('https://cdn.example.com/orvo.webm', true)).toBe(true);
  expect(isSafeMediaReference('javascript:alert(1)', true)).toBe(false);
  expect(isSafeMediaReference('//untrusted.example/video.mp4', true)).toBe(false);
});

test('optimized background replaces the oversized originals', async ({ request }, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'Asset response is viewport-independent.');

  const optimized = await request.get('/video/website-bg-optimized.mp4');
  expect(optimized.ok()).toBeTruthy();
  expect(Number(optimized.headers()['content-length'])).toBeLessThan(2 * 1024 * 1024);

  const removedOriginal = await request.get('/video/website%20bg.mp4');
  expect(removedOriginal.status()).toBe(404);
});

test('hero mark has a responsive tap target and visible click response', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const mark = page.getByRole('button', { name: 'Animate the Jesaias signature' });
  const bounds = await mark.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThanOrEqual(220);
  expect(bounds!.height).toBeGreaterThanOrEqual(220);
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);

  if (!isCompactProject(testInfo.project.name)) {
    await mark.hover();
    await expect(page.locator('.cursor-ring')).toHaveClass(/cursor-ring-hidden/);
  }

  await mark.click();
  await expect(page.getByTestId('hero-logo-burst')).toBeVisible();
});

test('private project preview does not reveal hidden work when logged out', async ({ page }) => {
  const catalogue = await page.request.get('/api/projects?preview=1');
  expect(catalogue.headers()['x-portfolio-preview']).toBe('false');
  await page.goto('/?portfolioPreview=1');
  await expect(page.getByText(/Private preview \/ hidden projects visible/i)).toHaveCount(0);
});

test('contact bot trap and security headers are active', async ({ request }, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'API behavior is viewport-independent.');

  const homepage = await request.get('/');
  expect(homepage.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(homepage.headers()['x-content-type-options']).toBe('nosniff');
  expect(homepage.headers()['x-frame-options']).toBe('DENY');

  const botSubmission = await request.post('/api/contact', {
    headers: {
      Origin: 'http://localhost:3000',
      'x-forwarded-for': `e2e-${testInfo.workerIndex}-${Date.now()}`,
    },
    data: {
      name: 'Bot',
      email: 'bot@example.com',
      message: 'spam',
      website: 'https://spam.invalid',
      startedAt: 1,
    },
  });
  expect(botSubmission.status()).toBe(400);
});

test('core pages have no serious automated accessibility violations', async ({ page }) => {
  for (const path of ['/', '/audio/orvo', '/projects/kvizy']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical'
    );
    expect(blockingViolations, `${path} accessibility violations`).toEqual([]);
  }
});

test('compact navigation moves focus and closes with Escape', async ({ page }, testInfo) => {
  test.skip(!isMobileProject(testInfo.project.name), 'Mobile-navigation behavior only.');

  await page.goto('/');
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  await menuButton.click();
  await expect(page.getByRole('link', { name: 'services', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();
});

test('tablet breakpoint exposes the desktop navigation without loading desktop media', async ({ page }, testInfo) => {
  test.skip(!isTabletProject(testInfo.project.name), 'Tablet breakpoint behavior only.');

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'projects', exact: true })).toBeVisible();
  await expect(page.locator('video[src*="website"]')).toHaveCount(0);
});

test('core routes fit every tested viewport without horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/audio/orvo', '/projects/kvizy']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test('same-page links point to real sections', async ({ page }, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'Fragment integrity is viewport-independent.');

  for (const path of ['/', '/audio', '/audio/orvo', '/projects/kvizy']) {
    await page.goto(path);
    const missingTargets = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string => Boolean(href && href.length > 1))
        .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1))))
    );
    expect(missingTargets, `${path} missing fragment targets`).toEqual([]);
  }
});

test('reduced-motion mode disables decorative background motion', async ({ page }, testInfo) => {
  test.skip(isCompactProject(testInfo.project.name), 'Reduced-motion behavior is viewport-independent.');

  await page.goto('/');
  await expect(page.locator('video[src*="website"]')).toHaveCount(0);
  const scrollBehavior = await page.evaluate(
    () => window.getComputedStyle(document.documentElement).scrollBehavior
  );
  expect(scrollBehavior).toBe('auto');
});
