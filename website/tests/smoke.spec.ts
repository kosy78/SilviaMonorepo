import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/competente/",
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

test("Avenir is the first-choice family across body and display text", async ({
  page,
}) => {
  await page.goto("/");

  const fontFamilies = await page
    .locator("html, main h1, main p, main a, main button")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).fontFamily),
    );

  expect(fontFamilies.length).toBeGreaterThan(0);
  expect(fontFamilies.every((family) => family.startsWith("Avenir,"))).toBe(
    true,
  );
});

test("service page explains what to expect from the first session", async ({
  page,
}) => {
  await page.goto("/psihoterapie-si-consiliere/");

  const section = page.locator("[data-first-session]");
  await expect(section).toHaveCount(1);
  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Oare cum va fi prima ședință, la ce să mă aștept?",
    }),
  ).toBeVisible();

  for (const heading of [
    "Convorbirea telefonică",
    "Prima întâlnire",
    "Cum lucrăm împreună",
  ]) {
    await expect(
      section.getByRole("heading", { level: 3, name: heading }),
    ).toBeVisible();
  }

  await expect(
    section.getByText(/Eu voi asculta și vă voi ajuta să observăm împreună/),
  ).toBeVisible();
  await expect(
    section.getByText("Pentru adolescenții de 16–17 ani"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "De unde poate începe" }),
  ).toHaveCount(0);
});

test("competencies page presents therapy situations and parental counseling", async ({
  page,
}) => {
  await page.goto("/competente/");

  const therapyHelp = page.locator("[data-therapy-help]");
  await expect(
    therapyHelp.getByRole("heading", {
      level: 2,
      name: "Situații în care psihoterapia este de ajutor",
    }),
  ).toBeVisible();
  await expect(
    therapyHelp.locator("[data-therapy-help-list] > li"),
  ).toHaveCount(8);

  const parentalCounseling = page.locator("[data-parent-counseling]");
  await expect(
    parentalCounseling.getByRole("heading", {
      level: 2,
      name: "Consiliere pentru părinți",
    }),
  ).toBeVisible();
  await expect(
    parentalCounseling.locator("[data-parent-counseling-list] > li"),
  ).toHaveCount(8);
  await expect(
    parentalCounseling.getByText(/nu urmărește să găsească un părinte vinovat/),
  ).toBeVisible();
  await expect(page.locator(".about-studies-list")).toHaveCSS(
    "list-style-type",
    "none",
  );
});

test("contact page presents one form-led contact section", async ({ page }) => {
  await page.goto("/contact/");

  const contactSection = page.locator("[data-contact-section]");
  await expect(contactSection).toHaveCount(1);
  const letter = contactSection.locator("[data-contact-letter]");
  await expect(letter).toHaveCount(1);
  await expect(letter.getByText("Către", { exact: true })).toBeVisible();
  await expect(letter.getByText("Silvia Dinu", { exact: true })).toBeVisible();

  const [contactSectionBox, footerBox] = await Promise.all([
    contactSection.boundingBox(),
    page.locator("[data-site-footer]").boundingBox(),
  ]);
  expect(Math.round(footerBox?.y ?? -1)).toBe(
    Math.round((contactSectionBox?.y ?? 0) + (contactSectionBox?.height ?? 0)),
  );
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

  await expect(form.getByRole("radio")).toHaveCount(0);
  await expect(
    form.getByLabel(/Când v-ar fi mai ușor să stabilim o întâlnire/),
  ).toBeVisible();
  const writingArea = form.locator('[name="availability"]');
  expect(
    await writingArea.evaluate((element) =>
      Math.round(element.getBoundingClientRect().height),
    ),
  ).toBeGreaterThanOrEqual(208);
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

test("homepage preliminary-meeting CTA opens the contact page", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  const preliminaryMeetingLink = page
    .getByRole("link", { name: "Solicitați o întâlnire preliminară" })
    .first();

  await expect(preliminaryMeetingLink).toHaveAttribute("href", "/contact/");
  await preliminaryMeetingLink.click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("homepage Silvia section links to the competencies page", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  const aboutLink = page.locator("[data-homepage-about]");
  await expect(aboutLink).toHaveAttribute("href", "/competente/");
  await expect(
    aboutLink.getByRole("heading", { level: 2, name: "Silvia Dinu" }),
  ).toBeVisible();
  await expect(
    aboutLink.getByRole("img", { name: "Silvia Dinu" }),
  ).toBeVisible();
});

test("homepage follows the approved public reading order", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/");

  expect(await page.locator("main h2").allTextContents()).toEqual([
    "O primă explorare.",
    "Despre Psihoterapia Psihanalitică",
    "Silvia Dinu",
    "Înainte de a începe",
    "Texte pentru reflecție",
    "În cabinet și online",
  ]);

  await expect(
    page.getByText(
      "Alegeți răspunsurile care vi se potrivesc cel mai bine. Astfel, vă puteți face o idee mai clară despre sursa dificultăților.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Nu există răspunsuri corecte sau greșite.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Începeți", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Psihoterapia psihanalitică este o formă contemporană de terapie care își are rădăcinile în psihanaliză, una dintre tradițiile clasice ale psihoterapiei moderne.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Psihoterapie", { exact: true })).toHaveCount(0);
  const orientation = page.locator(".homepage-orientation");
  await expect(orientation.locator('[data-slot="card"]')).toHaveCount(0);
  await expect(orientation.locator("article")).toHaveCount(3);
  await expect(
    orientation.getByRole("link", {
      name: "Citiți despre psihoterapie și consiliere",
    }),
  ).toHaveAttribute("href", "/psihoterapie-si-consiliere/");
  await expect(
    page.getByRole("link", { name: "Începeți explorarea" }),
  ).toHaveAttribute("href", "/reflectie-ghidata/");

  for (const heading of ["Primul mesaj", "Detaliile și prima întâlnire"]) {
    await expect(
      page.getByRole("heading", { exact: true, level: 3, name: heading }),
    ).toHaveCount(1);
  }

  await expect(page.locator("[data-homepage-faq]")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 2,
      name: "Înainte de a începe",
    }),
  ).toBeVisible();
  await expect(
    page.locator("[data-homepage-faq] [data-slot='accordion-item']"),
  ).toHaveCount(4);
  await expect(page.locator(".homepage-blog")).toHaveCount(1);
  await expect(page.getByText("În pregătire")).toHaveCount(3);
});

test("primary navigation uses direct public labels and routes", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.locator("[data-site-navigation] a");
  await expect(links).toHaveCount(6);
  await expect(links).toHaveText([
    "Acasă",
    "O primă explorare",
    "Psihoterapia psihanalitică",
    "Dinspre sine către celălalt",
    "Blog",
    "Contact",
  ]);
  await expect(links.nth(1)).toHaveAttribute("href", "/reflectie-ghidata/");
  await expect(links.nth(3)).toHaveAttribute("href", "/competente/");
});

test("the legacy competencies route forwards to the canonical page", async ({
  page,
}) => {
  await page.goto("/despre-silvia/");
  await expect(page).toHaveURL(/\/competente\/$/);
});

test("homepage opening reveal stages the words, CTA, and visible sections", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroWords = hero.locator("[data-homepage-hero-word]");
  const heroActions = hero.locator("[data-homepage-hero-actions]");

  await expect(heroWords).toHaveCount(16);
  await expect(heroActions).toHaveCSS(
    "animation-name",
    "homepage-hero-cta-reveal",
  );

  const wordDelays = await heroWords.evaluateAll((elements) =>
    elements.map((element) =>
      Number.parseFloat(window.getComputedStyle(element).animationDelay),
    ),
  );
  expect(
    wordDelays.every(
      (delay, index) => index === 0 || delay > wordDelays[index - 1]!,
    ),
  ).toBe(true);

  await expect
    .poll(() => page.locator("html").getAttribute("data-home-hero-reveal"))
    .toBe("complete");

  const firstHomepageSection = page
    .locator("#continut > section:not([data-homepage-hero])")
    .first();
  await firstHomepageSection.scrollIntoViewIfNeeded();
  await expect
    .poll(() => firstHomepageSection.getAttribute("data-home-reveal"))
    .toBe("visible");
});

test("homepage respects reduced-motion preferences", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroBackground = hero.locator(".homepage-hero__background");
  const heroWords = hero.locator("[data-homepage-hero-word]");
  const heroActions = hero.locator("[data-homepage-hero-actions]");
  const initialTransform = await heroBackground.evaluate(
    (element) => window.getComputedStyle(element).transform,
  );

  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(hero).toHaveCSS("animation-name", "none");
  await expect(heroWords).toHaveCount(16);
  await expect(heroWords.first()).toHaveCSS("animation-name", "none");
  await expect(heroActions).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).not.toHaveAttribute("data-home-reveal");

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(100);

  await expect(heroBackground).toHaveCSS("will-change", "auto");
  expect(
    await heroBackground.evaluate(
      (element) => window.getComputedStyle(element).transform,
    ),
  ).toBe(initialTransform);
});

test("homepage carousel settles immediately with reduced motion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const blog = page.locator(".homepage-blog");
  await blog.scrollIntoViewIfNeeded();
  await expect
    .poll(() => blog.locator("astro-island").getAttribute("ssr"))
    .toBeNull();

  const track = blog.locator(".homepage-blog__track");
  const next = blog.getByRole("button", { name: "Articolul următor" });
  await expect(next).toBeEnabled();
  await next.click();

  const transformAfterClick = await track.evaluate(
    (element) => element.style.transform,
  );
  await page.waitForTimeout(120);

  expect(await track.evaluate((element) => element.style.transform)).toBe(
    transformAfterClick,
  );
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

test("guided reflection opens directly on the first question", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/reflectie-ghidata/");

  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Începeți reflecția" }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("group", {
      name: "Prin ce observați cel mai repede că ceva cere atenție?",
    }),
  ).toBeVisible();

  const steps = page.locator("[data-reflection-steps]");
  const questionCard = page.locator(
    '[data-slot="card"][data-reflection-question]',
  );
  await expect(steps).toBeVisible();
  await expect(questionCard).toBeVisible();

  const [stepsBox, cardBox] = await Promise.all([
    steps.boundingBox(),
    questionCard.boundingBox(),
  ]);
  expect(stepsBox?.y).toBeLessThan(cardBox?.y ?? 0);
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
