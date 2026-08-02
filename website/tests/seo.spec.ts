import { expect, test } from "@playwright/test";

const canonicalOrigin = "https://despresine.ro";
const publicPages = [
  "/",
  "/competente/",
  "/psihoterapie-si-consiliere/",
  "/reflectie-ghidata/",
  "/blog/",
  "/contact/",
  "/politica-de-confidentialitate/",
  "/politica-cookies/",
] as const;

for (const path of publicPages) {
  test(`${path} declares canonical Romanian metadata`, async ({ page }) => {
    await page.goto(`${path}?test-query=not-canonical`);

    const canonicalUrl = new URL(path, canonicalOrigin).toString();
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonicalUrl,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonicalUrl,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S+/,
    );
  });
}

test("pre-launch robots rules keep the site out of search indexes", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBe(true);
  const robots = await response.text();
  expect(robots).toMatch(/User-agent:\s*\*/i);
  expect(robots).toMatch(/Disallow:\s*\/(?:\s|$)/i);
  expect(robots).toContain("Sitemap: https://despresine.ro/sitemap-index.xml");
});

test("the sitemap uses only the canonical domain and includes core public pages", async ({
  request,
}) => {
  const indexResponse = await request.get("/sitemap-index.xml");
  expect(indexResponse.ok()).toBe(true);

  const sitemapIndex = await indexResponse.text();
  expect(sitemapIndex).toContain("https://despresine.ro/sitemap-0.xml");

  const sitemapResponse = await request.get("/sitemap-0.xml");
  expect(sitemapResponse.ok()).toBe(true);

  const sitemap = await sitemapResponse.text();
  for (const path of publicPages) {
    expect(sitemap).toContain(
      `<loc>${new URL(path, canonicalOrigin).toString()}</loc>`,
    );
  }
  expect(sitemap).not.toContain("pages.dev");
  expect(sitemap).not.toContain("/despre-silvia/");
  expect(sitemap).not.toMatch(/<loc>[^<]*\/admin\/?<\/loc>/);
});
