import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/psihoterapie-si-consiliere/",
  "/competente/",
  "/reflectie-ghidata/",
  "/blog/",
  "/contact/",
  "/politica-de-confidentialitate/",
  "/politica-cookies/",
  "/404/",
  "/design-system/",
];

for (const route of routes) {
  test(`${route} uses regular text with medium header links`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);

    const exceptions = await page.locator("body *").evaluateAll((elements) =>
      elements.flatMap((element) => {
        // Third-party map labels and the development toolbar are not site copy.
        if (
          element.closest(".gm-style, astro-dev-toolbar") ||
          element.matches("script, style, noscript") ||
          !element.getClientRects().length
        ) {
          return [];
        }
        const text = [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent?.trim())
          .filter(Boolean)
          .join(" ");
        if (!text && !element.matches("input, textarea, select")) return [];
        const weight = getComputedStyle(element).fontWeight;
        const expectedWeight = element.closest(".site-header__link")
          ? "500"
          : "400";
        return weight === expectedWeight
          ? []
          : [{ tag: element.tagName, text: text.slice(0, 80), weight }];
      }),
    );

    expect(exceptions).toEqual([]);
  });
}
