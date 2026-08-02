import { expect, type Locator, test } from "@playwright/test";

const pages = [
  "/",
  "/competente/",
  "/psihoterapie-si-consiliere/",
  "/reflectie-ghidata/",
  "/blog/",
  "/contact/",
] as const;

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only checks");
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
});

for (const path of pages) {
  test(`${path} has no horizontal overflow on mobile`, async ({ page }) => {
    await page.goto(path);
    if (path === "/reflectie-ghidata/") {
      await expect(page.getByRole("radio").first()).toBeVisible();
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve());
        });
      });
    });

    const dimensions = await page.evaluate(() => ({
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      rootClientWidth: document.documentElement.clientWidth,
      rootScrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.rootScrollWidth).toBeLessThanOrEqual(
      dimensions.rootClientWidth + 1,
    );
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(
      dimensions.bodyClientWidth + 1,
    );
  });
}

async function expectMinimumTouchTargets(locator: Locator): Promise<void> {
  const boxes = await locator.evaluateAll((elements) =>
    elements
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          height: Math.round(rect.height),
          label:
            element.getAttribute("aria-label") ||
            element.textContent?.trim() ||
            element.tagName,
          width: Math.round(rect.width),
        };
      }),
  );

  expect(boxes.length).toBeGreaterThan(0);
  for (const box of boxes) {
    expect
      .soft(box.height, `${box.label} target height`)
      .toBeGreaterThanOrEqual(44);
    expect
      .soft(box.width, `${box.label} target width`)
      .toBeGreaterThanOrEqual(44);
  }
}

test("mobile header and privacy controls provide usable touch targets", async ({
  page,
}) => {
  await page.goto("/");

  const navigationToggle = page.locator("[data-navigation-toggle]");
  await navigationToggle.click();
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-site-navigation]")).toBeVisible();

  await expectMinimumTouchTargets(
    page.locator("header a:visible, header button:visible"),
  );
  await expectMinimumTouchTargets(
    page.locator("[data-analytics-settings]:visible"),
  );

  await page.locator("footer").scrollIntoViewIfNeeded();
  await expectMinimumTouchTargets(
    page.locator("footer a:visible, footer button:visible"),
  );

  await navigationToggle.focus();
  await page.keyboard.press("Escape");
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigationToggle).toBeFocused();
});

test("the mobile homepage hero remains bounded and uses the shadcn button contract", async ({
  page,
}) => {
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroBox = await hero.boundingBox();

  expect(heroBox).not.toBeNull();
  expect(heroBox?.height).toBeLessThanOrEqual(1200);
  const primaryAction = hero.getByRole("link", {
    name: "Solicitați o întâlnire preliminară",
  });
  await expect(primaryAction).toHaveAttribute("data-slot", "button");
  await expect(primaryAction).toHaveAttribute("data-variant", "default");
});

test("the privacy settings control does not cover actionable footer content", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  const settings = page.locator("[data-analytics-settings]");
  await expect(settings).toBeVisible();
  const settingsBox = await settings.boundingBox();
  expect(settingsBox).not.toBeNull();

  const footerTargets = await page
    .locator(
      "footer a:visible, footer button:visible:not([data-analytics-settings])",
    )
    .all();
  for (const target of footerTargets) {
    const targetBox = await target.boundingBox();
    if (!settingsBox || !targetBox) continue;

    const overlaps = !(
      settingsBox.x + settingsBox.width <= targetBox.x ||
      targetBox.x + targetBox.width <= settingsBox.x ||
      settingsBox.y + settingsBox.height <= targetBox.y ||
      targetBox.y + targetBox.height <= settingsBox.y
    );
    expect
      .soft(overlaps, "privacy settings obscures a footer action")
      .toBe(false);
  }
});
