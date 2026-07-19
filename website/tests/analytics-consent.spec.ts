import { expect, type Page, test } from "@playwright/test";

const consentKey = "silvia.analyticsConsent";
const googleAnalyticsUrl =
  /https:\/\/(?:www\.)?googletagmanager\.com\/gtag|https:\/\/(?:[^/]+\.)?google-analytics\.com\//;

async function isAnalyticsDisabled(page: Page): Promise<unknown> {
  const measurementId = await page
    .locator('script[src="/analytics-consent.js"]')
    .getAttribute("data-ga-measurement-id");

  expect(measurementId).toBeTruthy();
  return page.evaluate(
    (id) => (window as unknown as Record<string, unknown>)[`ga-disable-${id}`],
    measurementId,
  );
}

test.beforeEach(async ({ page }) => {
  // Keep third-party analytics deterministic and offline during browser tests.
  await page.route(googleAnalyticsUrl, async (route) => {
    await route.fulfill({
      body: "",
      contentType: "application/javascript",
      status: 200,
    });
  });
});

test("analytics stays off before a visitor makes a choice and rejection persists", async ({
  page,
}) => {
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (googleAnalyticsUrl.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/");

  const panel = page.locator("[data-analytics-consent]");
  const settings = page.locator("[data-analytics-settings]");

  await expect(panel).toBeVisible();
  await expect(panel).toBeFocused();
  await expect(settings).toBeHidden();
  await expect(
    page.locator('script[src^="https://www.googletagmanager.com/gtag/"]'),
  ).toHaveCount(0);
  expect(analyticsRequests).toEqual([]);
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), consentKey),
  ).toBeNull();
  expect(await isAnalyticsDisabled(page)).toBe(true);

  await panel.locator("[data-analytics-reject]").click();

  await expect(panel).toBeHidden();
  await expect(settings).toBeVisible();
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), consentKey),
  ).toBe("rejected");
  expect(analyticsRequests).toEqual([]);

  await page.reload();

  await expect(panel).toBeHidden();
  await expect(settings).toBeVisible();
  expect(analyticsRequests).toEqual([]);
});

test("acceptance loads analytics and settings allow the choice to be changed", async ({
  page,
}) => {
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (googleAnalyticsUrl.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/");

  const panel = page.locator("[data-analytics-consent]");
  const settings = page.locator("[data-analytics-settings]");
  await expect(panel).toBeFocused();
  await panel.locator("[data-analytics-accept]").click();

  await expect(panel).toBeHidden();
  await expect(settings).toBeVisible();
  await expect
    .poll(() => analyticsRequests.length, {
      message: "Google Analytics should load only after explicit acceptance",
    })
    .toBeGreaterThan(0);
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), consentKey),
  ).toBe("accepted");
  expect(await isAnalyticsDisabled(page)).toBe(false);

  await settings.click();
  await expect(panel).toBeVisible();
  await expect(panel).toBeFocused();
  await expect(settings).toBeHidden();

  await panel.locator("[data-analytics-reject]").click();

  await expect(panel).toBeHidden();
  await expect(settings).toBeVisible();
  await expect(settings).toBeFocused();
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), consentKey),
  ).toBe("rejected");
  expect(await isAnalyticsDisabled(page)).toBe(true);
});
