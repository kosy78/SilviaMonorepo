import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
});

test("both homepage cards animate when already visible on a tall screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 2000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    document.addEventListener("transitionrun", (event) => {
      if (
        event.propertyName === "opacity" &&
        event.target instanceof HTMLElement &&
        event.target.matches(".homepage-orientation, .homepage-areas")
      ) {
        event.target.dataset.testEntrancePlayed = "true";
      }
    });
  });
  await page.goto("/");
  for (const selector of [".homepage-orientation", ".homepage-areas"]) {
    const section = page.locator(selector);
    expect(
      await section.evaluate(
        (element) => element.getBoundingClientRect().top < innerHeight,
      ),
    ).toBe(true);
    await expect(section).toHaveAttribute("data-test-entrance-played", "true");
    await expect(section).toHaveAttribute("data-scroll-reveal", "visible");
    await expect(section).toHaveCSS("filter", "none");
  }
});

test("sections resolve from blur once, without changing their layout", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(".homepage-about");
  await expect(section).toHaveAttribute("data-scroll-reveal", "pending");
  await expect(section).toHaveCSS("filter", "blur(6px)");
  await page.evaluate(() => document.fonts.ready);
  const height = await section.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-scroll-reveal", "visible");
  await expect(section).toHaveCSS("filter", "none");
  expect(
    Math.abs(
      (await section.evaluate(
        (element) => element.getBoundingClientRect().height,
      )) - height,
    ),
  ).toBeLessThan(1);
  await page.locator("[data-homepage-hero]").scrollIntoViewIfNeeded();
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-scroll-reveal", "visible");
  await expect(page.locator("[data-homepage-hero]")).not.toHaveAttribute(
    "data-scroll-reveal",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("nested content sections and footer share the reveal", async ({
  page,
}) => {
  await page.goto("/competente/");
  const section = page.locator("[data-parent-counseling]");
  await expect(section).toHaveAttribute("data-scroll-reveal", "pending");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-scroll-reveal", "visible");
  const footer = page.locator(
    '[data-site-footer] > div:not([aria-hidden="true"])',
  );
  await expect(footer).toHaveAttribute("data-scroll-reveal", "pending");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toHaveAttribute("data-scroll-reveal", "visible");
});

test("keyboard focus and direct anchor navigation expose content immediately", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(".homepage-about");
  await expect(section).toHaveAttribute("data-scroll-reveal", "pending");
  await section.locator("[data-homepage-about]").focus();
  await expect(section).toHaveAttribute("data-scroll-reveal", "visible");
  await expect(section).toHaveCSS("opacity", "1");
  await page.goto("/#cum-lucrez");
  await expect(section).toHaveCSS("opacity", "1");
  await expect(section).toHaveCSS("filter", "none");
});

test("reduced motion, including a live preference change, keeps every section readable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".homepage-about")).toHaveAttribute(
    "data-scroll-reveal",
    "pending",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-scroll-reveal="pending"]')).toHaveCount(0);
  await expect(page.locator(".homepage-about")).toHaveCSS("filter", "none");
  await page.reload();
  await expect(page.locator(".homepage-about")).toHaveCSS("opacity", "1");
  await expect(page.locator(".homepage-about")).toHaveCSS("translate", "none");
});

test("printing includes sections that have not been scrolled into view", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".homepage-about")).toHaveAttribute(
    "data-scroll-reveal",
    "pending",
  );
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".homepage-about")).toHaveCSS("opacity", "1");
  await expect(page.locator(".homepage-about")).toHaveCSS("filter", "none");
});

test("content stays visible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".homepage-about")).toHaveCSS("opacity", "1");
  await expect(page.locator(".homepage-about")).toHaveCSS("filter", "none");
  await context.close();
});
