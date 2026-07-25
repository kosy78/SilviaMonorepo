import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/despre-silvia/",
  "/psihoterapie-si-consiliere/",
  "/reflectie-ghidata/",
  "/blog/",
  "/contact/",
  "/politica-de-confidentialitate/",
  "/politica-cookies/",
] as const;

for (const path of pages) {
  test(`${path} renders and has no detectable accessibility violations`, async ({
    page,
  }) => {
    const response = await page.goto(path);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-site-header]")).toHaveClass(/site-header/);
    await expect(page.locator("[data-site-header]")).toHaveCSS(
      "position",
      "fixed",
    );
    await expect(
      page.locator('nav[aria-label="Navigație principală"]'),
    ).toHaveCount(1);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("an unknown path shows the 404 page without accessibility violations", async ({
  page,
}) => {
  const response = await page.goto("/pagina-inexistenta/");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("homepage preliminary-meeting CTA opens an email to Silvia", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  await expect(
    page
      .getByRole("link", { name: "Solicită o întâlnire preliminară" })
      .first(),
  ).toHaveAttribute(
    "href",
    "mailto:silvia.drn@gmail.com?subject=Solicitare%20pentru%20o%20%C3%AEnt%C3%A2lnire%20preliminar%C4%83",
  );
});

test("homepage Silvia section links to the psychodynamic psychotherapy page", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  const aboutLink = page.locator("[data-homepage-about]");
  await expect(aboutLink).toHaveAttribute(
    "href",
    "/psihoterapie-si-consiliere/",
  );
  await expect(
    aboutLink.getByRole("img", { name: "Silvia Dinu" }),
  ).toBeVisible();
});

test("guided reflection presents the revised starting point", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/reflectie-ghidata/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Descoperă de unde am putea începe",
    }),
  ).toBeVisible();

  for (const removedText of [
    "Câteva întrebări te pot ajuta să privești mai atent ceea ce te preocupă",
    "7 întrebări, câte una pe ecran",
    "Răspunsurile nu sunt trimise sau stocate",
    "Puteți reveni la întrebările anterioare",
    "Părăsirea sau reîncărcarea paginii șterge răspunsurile",
  ]) {
    await expect(page.getByText(removedText, { exact: false })).toHaveCount(0);
  }

  await expect(
    page.getByRole("group", {
      name: "Prin ce observați cel mai repede că ceva cere atenție?",
    }),
  ).toBeVisible();
});

test("privacy copy preserves spaces around inline links", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/politica-de-confidentialitate/");

  await expect(page.locator(".prose-editorial p").first()).toContainText(
    "website-ul despresine.ro",
  );
  await expect(page.locator(".prose-editorial p").first()).toContainText(
    "scrie la silvia.drn@gmail.com",
  );
});
