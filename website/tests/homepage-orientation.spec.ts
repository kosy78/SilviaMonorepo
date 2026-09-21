import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");
});

test("psychotherapy video meets the card edges like the Silvia portrait", async ({
  page,
}) => {
  const geometry = await page.evaluate(() => {
    const card = document.querySelector(".homepage-orientation__card")!;
    const link = document.querySelector(".homepage-orientation__link")!;
    const image = document.querySelector(".homepage-orientation__image")!;
    const reference = document.querySelector(".homepage-about__card")!;
    const styles = getComputedStyle(card);
    const cardRect = card.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    return {
      outer: parseFloat(styles.borderTopRightRadius),
      reference: parseFloat(getComputedStyle(reference).borderTopRightRadius),
      link: parseFloat(getComputedStyle(link).borderTopRightRadius),
      inner: parseFloat(getComputedStyle(image).borderTopRightRadius),
      inset: parseFloat(styles.paddingRight),
      topInset: imageRect.top - cardRect.top,
      rightInset: cardRect.right - imageRect.right,
      bottomInset: cardRect.bottom - imageRect.bottom,
      stacked: getComputedStyle(image).gridColumnStart === "1",
      clipping: styles.overflow,
      border: styles.borderTopWidth,
    };
  });
  expect(geometry.outer).toBe(geometry.reference);
  expect(geometry.link).toBe(geometry.outer);
  expect(geometry.inner).toBe(0);
  expect(geometry.inset).toBe(0);
  expect(geometry.clipping).toBe("hidden");
  expect(geometry.border).toBe("0px");
  expect(geometry.topInset).toBeCloseTo(0, 1);
  expect(geometry.rightInset).toBeCloseTo(0, 1);
  if (!geometry.stacked) expect(geometry.bottomInset).toBeCloseTo(0, 1);
});

test("only the psi graphic starts monochrome and motion starts on interaction", async ({
  page,
  isMobile,
}) => {
  const link = page.locator(".homepage-orientation__link");
  const card = link.locator(".homepage-orientation__card");
  const psi = link.locator(".homepage-orientation__psi");
  const letter = link.locator(".psi-graphic__letter");
  const overlay = link.locator(".psi-graphic__overlay");
  const video = link.locator("video");

  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("controls", false);
  await expect(video).toHaveAttribute(
    "poster",
    "/videos/psychotherapy-clouds-poster.jpg",
  );

  await expect(card).toHaveCSS("filter", "none");
  await expect(video).toHaveCSS("filter", "none");
  await expect(psi).toHaveCSS("filter", "grayscale(1)");
  await expect(psi).toHaveCSS("opacity", "0.85");
  const psiSize = await psi.boundingBox();
  expect(psiSize?.width).toBeCloseTo(63 * 0.85, 1);
  expect(psiSize?.height).toBeCloseTo(63 * 0.85, 1);
  const artSize = await psi.locator(".psi-graphic__art").boundingBox();
  expect(artSize?.width).toBeCloseTo(63 * 0.85, 1);
  await expect(letter).toHaveCSS("animation-name", "none");
  await expect(overlay).toHaveCSS("opacity", "0");
  await expect(link).toHaveAccessibleName("Despre Psihoterapia Psihanalitică");

  if (!isMobile) {
    await link.hover();
    await expect(video).toHaveJSProperty("paused", false);
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => element.currentTime),
      )
      .toBeGreaterThan(0);
    await expect(card).toHaveCSS("filter", "none");
    await expect(psi).toHaveCSS("filter", "grayscale(0)");
    await expect(psi).toHaveCSS("opacity", "1");
    await expect(letter).toHaveCSS("animation-duration", "3.05s");
    await expect(letter).toHaveCSS("animation-iteration-count", "infinite");
    await expect(overlay).toHaveCSS("opacity", "1");
    await expect(letter).toHaveCSS("scale", "0.9");
    // Observe a full authored loop without changing the animation clock.
    await expect
      .poll(() =>
        letter.evaluate(
          (element) =>
            element.getAnimations()[0]?.effect?.getComputedTiming()
              .currentIteration,
        ),
      )
      .toBeGreaterThanOrEqual(1);
    await page.mouse.move(0, 0);
    await expect(video).toHaveJSProperty("paused", true);
    await expect(video).toHaveJSProperty("currentTime", 0);
    await expect(letter).toHaveCSS("animation-name", "none");
    await expect(letter).toHaveCSS("scale", "none");
    await expect(overlay).toHaveCSS("opacity", "0");
    await expect(card).toHaveCSS("filter", "none");
    await expect(psi).toHaveCSS("filter", "grayscale(1)");
    await expect(psi).toHaveCSS("opacity", "0.85");
    await link.hover();
    await expect
      .poll(() =>
        letter.evaluate(
          (element) =>
            element.getAnimations()[0]?.effect?.getComputedTiming()
              .currentIteration,
        ),
      )
      .toBe(0);
    await page.mouse.move(0, 0);
  }

  await link.focus();
  await expect(video).toHaveJSProperty("paused", false);
  await expect(card).toHaveCSS("filter", "none");
  await expect(psi).toHaveCSS("filter", "grayscale(0)");
  await expect(psi).toHaveCSS("opacity", "1");
  await expect(letter).toHaveCSS("animation-duration", "3.05s");
  await expect(link).toHaveCSS("outline-width", "2px");
  await page.keyboard.press("Tab");
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
  await expect(letter).toHaveCSS("animation-name", "none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("psychotherapy card respects reduced motion and remains a working link", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const link = page.locator(".homepage-orientation__link");
  if (!isMobile) await link.hover();
  else await link.focus();

  await expect(link.locator("video")).toHaveJSProperty("paused", true);
  await expect(link.locator("video")).toHaveJSProperty("currentTime", 0);

  await expect(link.locator(".homepage-orientation__card")).toHaveCSS(
    "filter",
    "none",
  );
  await expect(link.locator(".homepage-orientation__psi")).toHaveCSS(
    "filter",
    "grayscale(0)",
  );
  await expect(link.locator(".homepage-orientation__card")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(link.locator(".psi-graphic__letter")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(link.locator(".psi-graphic__overlay")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(link.locator(".psi-graphic__overlay")).toHaveCSS("opacity", "1");
  await link.click();
  await expect(page).toHaveURL(/\/psihoterapie-si-consiliere\/$/);
});

test("video stops when reduced motion is enabled during playback", async ({
  page,
}) => {
  const link = page.locator(".homepage-orientation__link");
  const video = link.locator("video");
  await link.focus();
  await expect(video).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
});
