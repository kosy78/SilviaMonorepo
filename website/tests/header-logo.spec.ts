import { expect, test } from "@playwright/test";

for (const placement of ["header", "footer"] as const) {
  test(`${placement} logo shows Variant4 on hover and keyboard focus without shifting`, async ({
    page,
    isMobile,
  }) => {
    await page.goto(
      placement === "footer" ? "/competente/" : "/psihoterapie-si-consiliere/",
    );
    const brand = page.locator(`.site-${placement}__brand`);
    const mark = brand.locator(`.site-${placement}__mark`);
    const monochrome = mark.locator(`.site-${placement}__logo-default`);
    const color = mark.locator(`.site-${placement}__logo-color`);
    await expect(brand).toHaveAccessibleName(
      placement === "header"
        ? "Despre Sine Psihoterapeut Silvia Dinu"
        : "DespreSine Psihoterapeut Silvia Dinu",
    );
    await expect(brand).toHaveAttribute("href", "/");
    await brand.scrollIntoViewIfNeeded();
    for (const image of [monochrome, color]) {
      await expect
        .poll(() =>
          image.evaluate((element) => {
            const img = element as HTMLImageElement;
            return img.complete && img.naturalWidth > 0;
          }),
        )
        .toBe(true);
    }
    await expect(monochrome).toHaveCSS("opacity", "1");
    await expect(color).toHaveCSS("opacity", "0");
    await expect(color).toHaveAttribute("src", /logo-variant-4/);
    const initialBox = await mark.boundingBox();
    if (!isMobile) {
      await mark.hover();
      await expect(color).toHaveCSS("opacity", "1");
      await expect(monochrome).toHaveCSS("opacity", "0");
      expect(await mark.boundingBox()).toEqual(initialBox);
      await page.mouse.move(0, 500);
      await expect(color).toHaveCSS("opacity", "0");
      await expect(monochrome).toHaveCSS("opacity", "1");
      await brand
        .locator(
          placement === "header"
            ? ".site-header__wordmark"
            : ".site-footer__name",
        )
        .hover();
      await expect(color).toHaveCSS("opacity", "1");
      await expect(monochrome).toHaveCSS("opacity", "0");
      expect(await mark.boundingBox()).toEqual(initialBox);
      await page.mouse.move(0, 500);
      await expect(color).toHaveCSS("opacity", "0");
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await brand.focus();
    await expect(color).toHaveCSS("opacity", "1");
    await expect(color).toHaveCSS("transition-duration", "0s");
    await expect(monochrome).toHaveCSS("opacity", "0");
    await page.keyboard.press("Tab");
    await expect(monochrome).toHaveCSS("opacity", "1");
    await expect(color).toHaveCSS("opacity", "0");
    await brand.click();
    await expect(page).toHaveURL(/\/$/);
  });
}
