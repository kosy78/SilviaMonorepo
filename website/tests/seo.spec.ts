import { expect, test } from "@playwright/test";
import sharp from "sharp";

const canonicalOrigin = "https://despresine.ro";
const socialImageUrl = `${canonicalOrigin}/images/despresine-social.jpg`;
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

    const documentTitle = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      socialImageUrl,
    );
    await expect(
      page.locator('meta[property="og:image:secure_url"]'),
    ).toHaveAttribute("content", socialImageUrl);
    await expect(
      page.locator('meta[property="og:image:type"]'),
    ).toHaveAttribute("content", "image/jpeg");
    await expect(
      page.locator('meta[property="og:image:width"]'),
    ).toHaveAttribute("content", "1200");
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute("content", "630");
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      "DespreSine",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      documentTitle,
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute("content", description ?? "");
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      socialImageUrl,
    );
    await expect(
      page.locator('meta[name="twitter:image:alt"]'),
    ).toHaveAttribute("content", "DespreSine");
  });
}

test("social preview and favicon assets have production dimensions", async ({
  request,
}) => {
  const socialImageResponse = await request.get(
    "/images/despresine-social.jpg",
  );
  expect(socialImageResponse.ok()).toBe(true);
  expect(socialImageResponse.headers()["content-type"]).toContain("image/jpeg");

  const socialImageMetadata = await sharp(
    await socialImageResponse.body(),
  ).metadata();
  expect(socialImageMetadata.width).toBe(1200);
  expect(socialImageMetadata.height).toBe(630);
  expect(socialImageMetadata.format).toBe("jpeg");

  const faviconResponse = await request.get("/favicon.svg");
  expect(faviconResponse.ok()).toBe(true);
  expect(faviconResponse.headers()["content-type"]).toContain("image/svg+xml");

  const touchIconResponse = await request.get("/apple-touch-icon.png");
  expect(touchIconResponse.ok()).toBe(true);
  const touchIconMetadata = await sharp(
    await touchIconResponse.body(),
  ).metadata();
  expect(touchIconMetadata.width).toBe(180);
  expect(touchIconMetadata.height).toBe(180);

  const verificationResponse = await request.get(
    "/google21b3f224fa7179c8.html",
  );
  expect(verificationResponse.ok()).toBe(true);
  expect(await verificationResponse.text()).toBe(
    "google-site-verification: google21b3f224fa7179c8.html",
  );

  const bingVerificationResponse = await request.get("/BingSiteAuth.xml");
  expect(bingVerificationResponse.ok()).toBe(true);
  expect(await bingVerificationResponse.text()).toBe(
    '<?xml version="1.0"?>\n<users>\n\t<user>2E12625D141C06FB1B0DE8D7C1D2F8C5</user>\n</users>',
  );
});

test("robots allows public search and ChatGPT discovery", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBe(true);
  const robots = await response.text();
  expect(robots).toMatch(/User-agent:\s*\*/i);
  expect(robots).toMatch(/Allow:\s*\/(?:\s|$)/i);
  for (const agent of ["*", "OAI-SearchBot"]) {
    const group = robots
      .split(/\n\s*\n/)
      .find((block) => block.includes(`User-agent: ${agent}\n`));
    expect(group).toBeDefined();
    expect(group).not.toMatch(/Disallow:\s*\/(?:\s|$)/i);
  }
  expect(robots).toContain("User-agent: GPTBot\nDisallow: /");
  expect(robots).toContain("User-agent: OAI-SearchBot");
  expect(robots).toContain("Disallow: /api/");
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
  expect(sitemap).not.toContain("/design-system/");
  expect(sitemap).not.toContain("/reflectie-ghidata/rezultat/");
});

test("server-rendered structured data identifies the site, profile, and article", async ({
  request,
}) => {
  for (const [path, type] of [
    ["/", "WebPage"],
    ["/competente/", "ProfilePage"],
    ["/contact/", "ContactPage"],
    ["/blog/mituri-despre-psihoterapia-psihanalitica/", "BlogPosting"],
  ] as const) {
    const response = await request.get(path);
    const html = await response.text();
    const scripts = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    expect(scripts).toHaveLength(1);
    const data = JSON.parse(scripts[0]?.[1] ?? "");
    expect(data["@context"]).toBe("https://schema.org");
    const graph = data["@graph"];
    expect(graph).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebSite",
          name: "DespreSine",
          url: `${canonicalOrigin}/`,
        }),
        expect.objectContaining({
          "@type": "Person",
          name: "Silvia Dinu",
          url: `${canonicalOrigin}/competente/`,
        }),
      ]),
    );
    const page = graph.find(
      (node: { "@type": string }) => node["@type"] === type,
    );
    expect(page.url).toBe(`${canonicalOrigin}${path}`);
    expect(page.inLanguage).toBe("ro-RO");
    if (type === "BlogPosting") {
      expect(html).toContain(
        `<meta property="article:author" content="${canonicalOrigin}/competente/">`,
      );
      expect(page.headline).toBe("Mituri despre psihoterapia psihanalitică");
      expect(page.author["@id"]).toBe(
        `${canonicalOrigin}/competente/#silvia-dinu`,
      );
      expect(page.datePublished).toBe("2026-10-05T00:00:00.000Z");
      expect(page.image).toMatch(/^https:\/\/despresine\.ro\/images\/blog\//);
      expect(html).toMatch(/href="\/competente\/"[^>]*>Silvia Dinu<\/a>/);
    }
  }
});

test("internal and reflection-result pages remain excluded from indexing", async ({
  page,
}) => {
  for (const path of ["/design-system/", "/reflectie-ghidata/rezultat/"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
  }
});
