import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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
  await expect(page.getByRole('link', { name: 'Open ORVO' })).toBeVisible();
  await expect(page.getByText(/stickman knockout/i)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Animate the Jesaias signature' })).toBeVisible();

  await page.goto('/audio/orvo');
  await expect(page.getByRole('heading', { level: 1, name: 'ORVO' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Stretch sound until it becomes something else/i })).toBeVisible();

  await page.goto('/projects/kvizy');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Quiz night');
});

test('public catalogue pins ORVO and excludes retired projects', async ({ request }) => {
  const response = await request.get('/api/projects');
  expect(response.ok()).toBeTruthy();
  const projects = await response.json();

  expect(projects[0]).toMatchObject({ title: 'ORVO', image: '/projects/orvo.png' });
  expect(projects.some((project: { title: string }) => /stickman|stick fighting/i.test(project.title))).toBe(false);
});

test('hero mark has a responsive tap target and visible click response', async ({ page }) => {
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
  test.skip(testInfo.project.name.includes('mobile'), 'API behavior is viewport-independent.');

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

test('core pages have no serious automated accessibility violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'Desktop scan covers the shared semantic structure.');

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

test('mobile navigation moves focus and closes with Escape', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'Mobile-navigation behavior only.');

  await page.goto('/');
  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  await menuButton.click();
  await expect(page.getByRole('link', { name: 'services', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();
});
