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

test("contact page presents one form-led contact section", async ({ page }) => {
  await page.goto("/contact/");

  const contactSection = page.locator("[data-contact-section]");
  await expect(contactSection).toHaveCount(1);
  await expect(
    contactSection.getByRole("heading", {
      level: 1,
      name: "Îmi puteți scrie.",
    }),
  ).toBeVisible();
  await expect(contactSection.getByText("Un prim mesaj")).toHaveCount(0);
  await expect(contactSection.getByText("Ce urmează")).toHaveCount(0);
  await expect(
    contactSection.getByRole("heading", {
      level: 2,
      name: "Formular de contact",
    }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "După primul mesaj" }),
  ).toHaveCount(0);

  const form = contactSection.locator("[data-contact-form]");
  await expect(form).toHaveAccessibleName("Formular de contact");
  await expect(form.getByLabel("Adresă de email")).toBeVisible();
  await expect(form.getByLabel(/Nume.*opțional/)).toBeVisible();
  await expect(
    contactSection.getByText("Adresa de email este singurul câmp obligatoriu."),
  ).toHaveCount(0);

  const textInputs = form.locator('input[name="email"], input[name="name"]');
  await expect(textInputs).toHaveCount(2);
  const textInputHeights = await textInputs.evaluateAll((elements) =>
    elements.map((element) =>
      Math.round(element.getBoundingClientRect().height),
    ),
  );
  expect(textInputHeights.every((height) => height >= 44)).toBe(true);

  await expect(form.getByRole("radio")).toHaveCount(3);
  await expect(form.getByLabel("Nu știu încă")).toBeVisible();
  await expect(form.getByLabel(/Ce intervale vi se potrivesc/)).toBeVisible();
  await expect(
    contactSection.getByText("Detalii practice, dacă doriți"),
  ).toHaveCount(0);
  await expect(
    contactSection.getByText("Toate câmpurile de mai jos sunt opționale."),
  ).toHaveCount(0);
  await expect(
    contactSection.getByText(
      "Includeți doar detalii practice, fără informații sensibile.",
    ),
  ).toHaveCount(0);
  await expect(
    contactSection.getByText(/Vă răspund pe email cu disponibilitatea/),
  ).toHaveCount(0);
  await expect(
    contactSection.locator("[data-contact-direct-email]"),
  ).toContainText("silvia.drn@gmail.com");
});

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
      .getByRole("link", { name: "Solicitați o întâlnire preliminară" })
      .first(),
  ).toHaveAttribute(
    "href",
    "mailto:silvia.drn@gmail.com?subject=Solicitare%20pentru%20o%20%C3%AEnt%C3%A2lnire%20preliminar%C4%83",
  );
});

test("homepage Silvia section links to the formation and orientation page", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  const aboutLink = page.locator("[data-homepage-about]");
  await expect(aboutLink).toHaveAttribute("href", "/despre-silvia/");
  await expect(
    aboutLink.getByRole("heading", { level: 2, name: "Silvia Dinu" }),
  ).toBeVisible();
  await expect(
    aboutLink.getByRole("img", { name: "Silvia Dinu" }),
  ).toBeVisible();
});

test("homepage follows the approved trust-first reading order", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  expect(await page.locator("main h2").allTextContents()).toEqual([
    "Psihoterapie psihanalitică și consiliere",
    "Silvia Dinu",
    "Ce pare să ceară atenție acum?",
    "Înainte de a începe",
    "În cabinet și online",
  ]);

  for (const heading of ["Primul mesaj", "Detaliile și prima întâlnire"]) {
    await expect(
      page.getByRole("heading", { exact: true, level: 3, name: heading }),
    ).toHaveCount(1);
  }

  await expect(page.locator(".homepage-blog")).toHaveCount(0);
});

test("primary navigation uses direct public labels and routes", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.locator("[data-site-navigation] a");
  await expect(links).toHaveCount(6);
  await expect(links).toHaveText([
    "Acasă",
    "Psihoterapia psihanalitică",
    "Despre",
    "O primă explorare",
    "Blog",
    "Contact",
  ]);
  await expect(links.nth(2)).toHaveAttribute("href", "/despre-silvia/");
});

test("homepage respects reduced-motion preferences", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroBackground = hero.locator(".homepage-hero__background");
  const initialTransform = await heroBackground.evaluate(
    (element) => window.getComputedStyle(element).transform,
  );

  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(hero).toHaveCSS("animation-name", "none");

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(100);

  await expect(heroBackground).toHaveCSS("will-change", "auto");
  expect(
    await heroBackground.evaluate(
      (element) => window.getComputedStyle(element).transform,
    ),
  ).toBe(initialTransform);
});

test("initial analytics consent choices meet the 44px target standard", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("silvia.analyticsConsent");
  });
  await page.goto("/");

  const choices = page.locator(
    "[data-analytics-consent] [data-analytics-accept], [data-analytics-consent] [data-analytics-reject]",
  );
  await expect(choices).toHaveCount(2);
  await expect(choices.first()).toBeVisible();

  const targetSizes = await choices.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      };
    }),
  );

  for (const target of targetSizes) {
    expect(target.height).toBeGreaterThanOrEqual(44);
    expect(target.width).toBeGreaterThanOrEqual(44);
  }
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
      name: "Despre sine: O primă explorare",
    }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Rezultatele sunt orientative, iar răspunsurile nu sunt trimise sau stocate.",
    ),
  ).toBeVisible();
  await expect(page.locator("[data-reflection-intro-visual]")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("radio")).toHaveCount(0);

  await page.getByRole("button", { name: "Începeți reflecția" }).click();

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
