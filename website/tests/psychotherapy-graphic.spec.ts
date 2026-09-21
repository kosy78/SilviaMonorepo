import { expect, test } from "@playwright/test";

test("service heading graphic activates on intro hover and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/psihoterapie-si-consiliere/");
  const intro = page.locator(".page-intro");
  const heading = page.locator(".page-intro__heading");
  const graphic = heading.locator(".psi-graphic");
  const letter = graphic.locator(".psi-graphic__letter");
  const overlay = graphic.locator(".psi-graphic__overlay");
  await expect(graphic).toBeVisible();
  await expect(graphic).toHaveAttribute("aria-hidden", "true");
  await expect(intro).toHaveAttribute("data-psi-trigger", "true");
  await expect(letter).toHaveCSS("animation-name", "none");
  await expect(overlay).toHaveCSS("animation-name", "none");

  const canHover = await page.evaluate(
    () => matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  if (canHover) {
    await intro.hover();
    await expect(letter).toHaveCSS("animation-duration", "3.05s");
    await expect(overlay).toHaveCSS("animation-duration", "3.05s");
  }
  const titleBox = await heading.locator("h1").boundingBox();
  const graphicBox = await graphic.boundingBox();
  expect(graphicBox!.y + graphicBox!.height).toBeLessThan(titleBox!.y);
  expect(Math.abs(graphicBox!.x - titleBox!.x)).toBeLessThan(1);

  if (canHover) {
    await page.mouse.move(8, 8);
    await expect(letter).toHaveCSS("animation-name", "none");
    await expect(overlay).toHaveCSS("animation-name", "none");
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(letter).toHaveCSS("animation-name", "none");
  await expect(overlay).toHaveCSS("animation-name", "none");
  if (canHover) {
    await intro.hover();
    await expect(overlay).toHaveCSS("opacity", "1");
  } else {
    await expect(overlay).toHaveCSS("opacity", "0");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
