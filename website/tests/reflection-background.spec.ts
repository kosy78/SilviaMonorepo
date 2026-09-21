import { expect, test } from "@playwright/test";

test("reflection background extends behind the transparent header and softens the image", async ({
  page,
}) => {
  await page.goto("/reflectie-ghidata/");
  const header = page.locator("[data-site-header]");
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await expect
    .poll(() =>
      header.evaluate((el) => getComputedStyle(el, "::before").opacity),
    )
    .toBe("0");
  const background = await page.locator(".reflection-shell").evaluate((el) => {
    const style = getComputedStyle(el, "::before");
    return {
      top: el.getBoundingClientRect().top + parseFloat(style.top),
      opacity: style.opacity,
      border: getComputedStyle(el).borderTopWidth,
    };
  });
  expect(background.top).toBeCloseTo(0, 0);
  expect(background.opacity).toBe("0.7");
  expect(background.border).toBe("0px");
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await expect
    .poll(() =>
      header.evaluate((el) => getComputedStyle(el, "::before").opacity),
    )
    .toBe("1");
});
