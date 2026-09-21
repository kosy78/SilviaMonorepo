import { expect, test } from "@playwright/test";

for (const route of ["/", "/psihoterapie-si-consiliere/"]) {
  test.describe(`exploration card on ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem("silvia.analyticsConsent", "rejected");
      });
      await page.goto(route);
    });

    test("answer rows play on hover, hold, and reverse from their current position", async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "Hover requires a fine pointer.");
      const card = page.locator(".homepage-reflection");
      const row = card.locator("[data-reflection-answer-row]").first();
      const selected = card.locator("[data-selected]");
      await expect(row).toHaveCSS("padding-left", "0px");
      await card.hover();
      await expect(row).toHaveCSS("padding-left", "10px");
      await expect(selected).toHaveCSS("padding-left", "0px");
      await page.waitForTimeout(650);
      await expect(row).toHaveCSS("padding-left", "10px");
      await page.mouse.move(0, 0);
      await expect(row).toHaveCSS("padding-left", "0px");

      await card.hover();
      await expect
        .poll(() =>
          row.evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft)),
        )
        .toBeGreaterThan(1);
      const beforeExit = await row.evaluate((el) =>
        Number(el.getAnimations()[0]?.currentTime),
      );
      expect(beforeExit).toBeLessThan(587.92);
      await page.mouse.move(0, 0);
      const afterExit = await row.evaluate((el) => ({
        time: Number(el.getAnimations()[0]?.currentTime),
        rate: el.getAnimations()[0]?.playbackRate,
      }));
      expect(afterExit.rate).toBe(-1);
      expect(afterExit.time).toBeLessThan(beforeExit + 70);
      await expect(row).toHaveCSS("padding-left", "0px");
    });

    test("keyboard focus activates the graphic and leaving focus reverses it", async ({
      page,
    }) => {
      const action = page.locator(".homepage-reflection a");
      const row = page.locator("[data-reflection-answer-row]").first();
      await action.focus();
      await expect(row).toHaveCSS("padding-left", "10px");
      await action.press("Tab");
      await expect(row).toHaveCSS("padding-left", "0px");
    });

    test("reduced motion keeps answer rows still and preserves navigation", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const card = page.locator(".homepage-reflection");
      const action = card.getByRole("link", { name: "Începeți explorarea" });
      await action.focus();
      await expect(
        card.locator("[data-reflection-answer-row]").first(),
      ).toHaveCSS("padding-left", "0px");
      const running = await card.evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length,
      );
      expect(running).toBe(0);
      await action.click();
      await expect(page).toHaveURL(/\/reflectie-ghidata\/$/);
    });

    test("touch layout stays static without overflowing the page", async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, "Touch-only behavior.");
      await page.locator(".homepage-reflection").scrollIntoViewIfNeeded();
      await expect(
        page.locator("[data-reflection-answer-row]").first(),
      ).toHaveCSS("padding-left", "0px");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  });
}
