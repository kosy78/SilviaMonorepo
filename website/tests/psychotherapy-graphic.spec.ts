import { expect, test } from "@playwright/test";

test("service heading and reflection illustration stay readable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/psihoterapie-si-consiliere/");
  const intro = page.locator(".page-intro");
  await expect(
    intro.getByRole("heading", {
      level: 1,
      name: "Despre Psihoterapia Psihanalitică",
    }),
  ).toBeVisible();
  await expect(intro.locator(".psi-graphic")).toHaveCount(0);
  await expect(intro).not.toHaveAttribute("data-psi-trigger", "true");

  const card = page.locator("[data-guided-reflection-promo]");
  const artwork = card.locator(".homepage-reflection__image");
  const image = artwork.locator("img");
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork).toHaveAttribute("aria-hidden", "true");
  await expect(image).toHaveAttribute("alt", "");
  await expect(image).toHaveCSS("object-fit", "cover");
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const action = card.getByRole("link", { name: "Începeți explorarea" });
  await action.focus();
  await expect(action).toBeFocused();
  await expect(card).toHaveCSS("transform", "none");
  await expect(artwork).toHaveCSS("transform", "none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await action.press("Enter");
  await expect(page).toHaveURL(/\/reflectie-ghidata\/$/);
});

test("Psi design-system specimen retains its loop and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/design-system/");
  const graphic = page.locator(".psi-graphic--auto");
  const letter = graphic.locator(".psi-graphic__letter");
  const overlay = graphic.locator(".psi-graphic__overlay");
  await expect(graphic).toHaveAttribute("aria-hidden", "true");
  for (const track of [letter, overlay]) {
    await expect(track).toHaveCSS("animation-duration", "3.05s");
    await expect(track).toHaveCSS("animation-iteration-count", "infinite");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(letter).toHaveCSS("animation-name", "none");
  await expect(overlay).toHaveCSS("animation-name", "none");
  await expect(overlay).toHaveCSS("opacity", "1");
});
