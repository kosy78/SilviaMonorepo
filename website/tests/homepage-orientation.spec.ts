import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");
});

test("psychotherapy illustration fits within the card without cropping", async ({
  page,
}) => {
  const card = page.locator(".homepage-orientation__card");
  const artwork = card.locator(".homepage-orientation__image");
  const image = artwork.locator("img");
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork).toHaveAttribute("aria-hidden", "true");
  await expect(image).toHaveAttribute("alt", "");
  await expect(image).toHaveCSS("object-fit", "contain");
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const cardBox = await card.boundingBox();
  const imageBox = await image.boundingBox();
  if (!cardBox || !imageBox)
    throw new Error("Card and illustration must be visible");
  expect(imageBox.x).toBeGreaterThan(cardBox.x);
  expect(imageBox.y).toBeGreaterThan(cardBox.y);
  expect(imageBox.x + imageBox.width).toBeLessThan(cardBox.x + cardBox.width);
  expect(imageBox.y + imageBox.height).toBeLessThan(cardBox.y + cardBox.height);
  await expect(card.locator("video, .homepage-orientation__psi")).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("psychotherapy card keeps visible hover and keyboard feedback", async ({
  page,
  isMobile,
}) => {
  const link = page.locator(".homepage-orientation__link");
  const card = link.locator(".homepage-orientation__card");
  await expect(link).toHaveAccessibleName("Despre Psihoterapia Psihanalitică");
  if (!isMobile) {
    await link.hover();
    await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)");
    await expect(card).not.toHaveCSS("box-shadow", "none");
    await page.mouse.move(0, 0);
    await expect(card).toHaveCSS("transform", "none");
  }
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-width", "2px");
  await link.press("Enter");
  await expect(page).toHaveURL(/\/psihoterapie-si-consiliere\/$/);
});

test("psychotherapy card respects reduced motion and remains a working link", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const link = page.locator(".homepage-orientation__link");
  if (!isMobile) await link.hover();
  else await link.focus();
  await expect(link.locator(".homepage-orientation__card")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(link.locator(".homepage-orientation__card")).toHaveCSS(
    "transition-property",
    "none",
  );
  await link.click();
  await expect(page).toHaveURL(/\/psihoterapie-si-consiliere\/$/);
});
