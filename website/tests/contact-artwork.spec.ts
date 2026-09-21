import { expect, test } from "@playwright/test";

test("contact reuses the reflection backdrop and places decorative artwork below the form", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("silvia.analyticsConsent", "rejected"),
  );
  await page.goto("/reflectie-ghidata/");
  const reference = await page
    .locator(".reflection-shell")
    .evaluate((element) => {
      const style = getComputedStyle(element, "::before");
      return {
        image: style.backgroundImage,
        mask: style.maskImage,
        position: style.backgroundPosition,
        size: style.backgroundSize,
      };
    });
  await page.goto("/contact/");
  const backdrop = await page
    .locator(".contact-letter-section")
    .evaluate((element) => {
      const style = getComputedStyle(element, "::before");
      return {
        image: style.backgroundImage,
        mask: style.maskImage,
        position: style.backgroundPosition,
        size: style.backgroundSize,
      };
    });
  expect(backdrop).toEqual(reference);
  const graphic = page.locator(".contact-letter__graphic");
  await expect(graphic).toHaveAttribute("aria-hidden", "true");
  await expect(graphic.locator("img")).toHaveAttribute("alt", "");
  await graphic.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      graphic
        .locator("img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  const artBox = await graphic
    .locator(".contact-letter__graphic-crop")
    .boundingBox();
  const buttonBox = await page
    .getByRole("button", { name: "Trimiteți mesajul" })
    .boundingBox();
  expect(artBox!.y).toBeGreaterThan(buttonBox!.y + buttonBox!.height);
  expect(artBox!.width / artBox!.height).toBeCloseTo(923 / 111, 1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
