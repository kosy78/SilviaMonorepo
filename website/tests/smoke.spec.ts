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
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Psihoterapie sau consiliere?",
    }),
  ).toHaveCount(0);
  const bibliography = page.locator(".page-intro [data-bibliography]");
  const bibliographyTrigger = bibliography.getByRole("button", {
    name: "Bibliografie",
  });
  const firstReference = bibliography.getByText(
    /American Psychoanalytic Association/,
  );
  await expect(bibliography).toHaveCount(1);
  await expect(
    bibliography.getByRole("heading", { level: 2, name: "Bibliografie" }),
  ).toBeVisible();
  await expect(bibliographyTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(firstReference).not.toBeVisible();
  await bibliographyTrigger.click();
  await expect(bibliographyTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(firstReference).toBeVisible();
  await bibliographyTrigger.click();
  await expect(bibliographyTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(firstReference).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "De unde poate începe" }),
  ).toHaveCount(0);
});

test("competencies page presents scannable therapy situations and parental counseling", async ({
  page,
}, testInfo) => {
  await page.goto("/competente/");

  const therapyHelp = page.locator("[data-therapy-help]");
  await expect(
    therapyHelp.getByRole("heading", {
      level: 2,
      name: "Situațiile în care psihoterapia poate deveni un sprijin.",
    }),
  ).toBeVisible();
  await expect(
    therapyHelp.getByText(
      "În practica mea, lucrez cu persoane care se confruntă cu astfel de dificultăți, fiecare în felul și ritmul său.",
    ),
  ).toBeVisible();
  await expect(
    therapyHelp.locator("[data-therapy-help-list] > li"),
  ).toHaveCount(8);
  await expect(
    page.locator('astro-island[component-url*="SupportAreasAccordion."]'),
  ).not.toHaveAttribute("ssr", "");
  const anxietyTrigger = therapyHelp.getByRole("button", {
    name: "Anxietate și atacuri de panică",
  });
  const anxietyDescription = therapyHelp.getByText(
    /Stări de neliniște, griji greu de oprit/,
  );
  const anxietyContent = therapyHelp
    .locator('[data-slot="accordion-content"]')
    .first();
  const anxietyIcon = anxietyTrigger.locator(
    '[data-slot="accordion-trigger-icon"]',
  );
  const anxietyLines = anxietyContent.locator("[data-support-area-copy-line]");
  await expect(
    therapyHelp.getByRole("button", { name: "Manifestări ale corpului" }),
  ).toBeVisible();
  await expect(
    therapyHelp.getByRole("button", {
      name: "Pierderi și schimbări importante",
    }),
  ).toBeVisible();
  await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(anxietyDescription).not.toBeVisible();

  if (testInfo.project.name === "desktop-chromium") {
    await expect(anxietyIcon).toHaveCount(1);
    await expect.poll(() => anxietyLines.count()).toBeGreaterThan(1);
    await expect(anxietyContent).toHaveCSS("grid-template-rows", "0px");
    await expect(anxietyContent).toHaveCSS("visibility", "hidden");
    await expect(anxietyLines.first()).toHaveCSS("filter", "blur(2px)");
    await anxietyTrigger.hover();
    await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(anxietyDescription).toBeVisible();
    await expect(anxietyContent).toHaveCSS("opacity", "1");
    await expect(anxietyContent).not.toHaveCSS("grid-template-rows", "0px");
    await expect(anxietyContent).toHaveCSS(
      "transition-property",
      "grid-template-rows, opacity, visibility",
    );
    await expect(anxietyContent).toHaveCSS(
      "transition-duration",
      "0.22s, 0.22s, 0s",
    );
    await expect(anxietyIcon).toHaveCSS("rotate", "180deg");
    await expect(anxietyLines.first()).toHaveCSS("filter", "blur(0px)");
    const lineDelays = await anxietyLines.evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).transitionDelay),
    );
    expect(new Set(lineDelays).size).toBeGreaterThan(1);

    const depressionTrigger = therapyHelp.getByRole("button", {
      name: "Stări depresive",
    });
    await depressionTrigger.hover();
    await anxietyTrigger.hover();
    await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(depressionTrigger).toHaveAttribute("aria-expanded", "false");

    await therapyHelp.getByRole("heading", { level: 2 }).hover();
    await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(anxietyDescription).not.toBeVisible();
    await expect(anxietyContent).toHaveCSS("grid-template-rows", "0px");
    await expect(anxietyIcon).toHaveCSS("rotate", "none");

    const lastRowCases = [
      { index: 6, name: "Tipare care se repetă" },
      { index: 7, name: "Pierderi și schimbări importante" },
    ] as const;

    for (const { index, name } of lastRowCases) {
      const trigger = therapyHelp.getByRole("button", { name, exact: true });
      const content = therapyHelp
        .locator('[data-slot="accordion-content"]')
        .nth(index);

      await therapyHelp.getByRole("heading", { level: 2 }).hover();
      await trigger.evaluate((element) =>
        element.scrollIntoView({ block: "end" }),
      );

      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const initialScrollY = await page.evaluate(() => window.scrollY);
      const triggerBox = await trigger.boundingBox();

      expect(triggerBox).not.toBeNull();
      const triggerBottom = (triggerBox?.y ?? 0) + (triggerBox?.height ?? 0);
      expect(Math.abs(triggerBottom - viewportHeight)).toBeLessThan(2);

      await trigger.hover();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(content).toBeVisible();
      await expect
        .poll(async () => {
          const box = await content.boundingBox();
          return box ? box.y + box.height : Infinity;
        })
        .toBeLessThanOrEqual(viewportHeight + 1);
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(initialScrollY);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const reducedContent = therapyHelp
      .locator('[data-slot="accordion-content"]')
      .first();
    const reducedInner = reducedContent.locator(".support-area-content-inner");
    const reducedIcon = anxietyTrigger.locator(
      '[data-slot="accordion-trigger-icon"]',
    );
    const reducedLines = reducedContent.locator(
      "[data-support-area-copy-line]",
    );
    await anxietyTrigger.hover();
    await expect(reducedContent).toHaveCSS(
      "transition-property",
      "opacity, visibility",
    );
    await expect(reducedInner).toHaveCSS("transform", "none");
    await expect(reducedIcon).toHaveCSS("transition-property", "none");
    await expect(reducedLines.first()).toHaveCSS("filter", "none");
    await expect(reducedLines.first()).toHaveCSS(
      "transition-property",
      "opacity",
    );

    const reducedLastTrigger = therapyHelp.getByRole("button", {
      name: "Tipare care se repetă",
      exact: true,
    });
    const reducedLastContent = therapyHelp
      .locator('[data-slot="accordion-content"]')
      .nth(6);

    await therapyHelp.getByRole("heading", { level: 2 }).hover();
    await reducedLastTrigger.evaluate((element) =>
      element.scrollIntoView({ block: "end" }),
    );
    const reducedViewportHeight = await page.evaluate(() => window.innerHeight);
    const reducedInitialScrollY = await page.evaluate(() => window.scrollY);

    await reducedLastTrigger.hover();
    await expect(reducedLastTrigger).toHaveAttribute("aria-expanded", "true");
    await expect
      .poll(async () => {
        const box = await reducedLastContent.boundingBox();
        return box ? box.y + box.height : Infinity;
      })
      .toBeLessThanOrEqual(reducedViewportHeight + 1);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(reducedInitialScrollY);
  } else {
    await expect.poll(() => anxietyLines.count()).toBeGreaterThan(1);
    await expect(anxietyLines.first()).toHaveCSS("filter", "none");
    await expect(anxietyLines.first()).toHaveCSS("transform", "none");
  }

  await anxietyTrigger.focus();
  await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(anxietyDescription).toBeVisible();
  const expandedAccessibility = await new AxeBuilder({ page })
    .include("[data-therapy-help]")
    .analyze();
  expect(expandedAccessibility.violations).toEqual([]);
  await anxietyTrigger.press("Enter");
  await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "true");
  await anxietyTrigger.click();
  await expect(anxietyTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(anxietyDescription).not.toBeVisible();

  const parentalCounseling = page.locator("[data-parent-counseling]");
  await expect(
    parentalCounseling.getByRole("heading", {
      level: 2,
      name: "Consiliere parentală",
    }),
  ).toBeVisible();
  await expect(
    parentalCounseling.locator("[data-parent-counseling-list] > li"),
  ).toHaveCount(8);
  await expect(
    parentalCounseling.getByText(
      /nu caută un vinovat și nici o formulă perfectă/,
    ),
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
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
  await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Mergeți la pagina principală" }),
  ).toBeVisible();
  await expect(
    page.locator("#continut").getByRole("link", { name: "Contact" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

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
  await expect(aboutLink).toHaveAccessibleName("Silvia Dinu");
  await expect(page.locator(".site-header__brand")).toHaveAccessibleName(
    /Despre Sine\s+Psihoterapeut Silvia Dinu/,
  );
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
    "O primă explorare",
    "Despre Psihoterapia Psihanalitică",
    "Silvia Dinu",
    "Înainte de a începe",
    "Texte pentru reflecție",
    "În cabinet și online",
  ]);

  await expect(
    page.getByText("Alegeți răspunsurile care vi se potrivesc cel mai bine.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Răspunsurile pot oferi un punct de pornire pentru reflecție.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Nu există răspunsuri corecte sau greșite.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Cele opt întrebări sunt anonime. Răspunsurile nu sunt stocate. Rezultatul este orientativ și nu reprezintă un diagnostic.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(page.getByText("Începeți", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText(
      "Psihoterapia psihanalitică este o formă contemporană de terapie care își are rădăcinile în psihanaliză, una dintre tradițiile clasice ale psihoterapiei moderne.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Psihoterapie", { exact: true })).toHaveCount(0);
  const orientation = page.locator(".homepage-orientation");
  await expect(
    orientation.locator(".homepage-orientation__atmosphere img"),
  ).toHaveAttribute("src", /psychotherapy-orientation-background/);
  await expect(orientation.locator('[data-slot="card"]')).toHaveCount(0);
  await expect(
    orientation.locator(".homepage-orientation__summary > p"),
  ).toHaveCount(1);
  await expect(
    orientation.getByRole("link", {
      name: "Citiți despre psihoterapie și consiliere",
    }),
  ).toHaveAttribute("href", "/psihoterapie-si-consiliere/");
  await expect(
    page.getByRole("link", { name: "Începeți explorarea" }),
  ).toHaveAttribute("href", "/reflectie-ghidata/");
  await expect(
    page.getByRole("link", {
      name: "Soluționarea Alternativă a Litigiilor prin ANPC",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 2,
      name: "Soluționarea litigiilor",
    }),
  ).toHaveCount(0);
  const footer = page.locator("[data-site-footer]");
  await expect(
    footer.getByRole("heading", {
      exact: true,
      level: 2,
      name: "Practica profesională",
    }),
  ).toHaveCount(0);
  await expect(
    footer.getByText("Psiholog cu drept de liberă practică", { exact: true }),
  ).toHaveCount(0);

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
  ).toHaveCount(3);
  await expect(page.locator(".homepage-blog")).toHaveCount(1);
  await expect(page.getByText("În pregătire")).toHaveCount(3);
});

test("homepage groups the direct email and contact form actions", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  const actions = page.locator("[data-homepage-practice-actions]");
  const emailAction = actions.getByRole("link", {
    name: "Scrieți-mi pe email",
  });
  const formAction = actions.getByRole("link", {
    name: "Trimiteți un prim mesaj",
  });

  await expect(
    page.getByText("Puteți folosi formularul sau adresa de email.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(emailAction).toHaveAttribute(
    "href",
    "mailto:silvia.drn@gmail.com?subject=Solicitare%20pentru%20o%20prim%C4%83%20%C3%AEnt%C3%A2lnire",
  );
  await expect(emailAction).toHaveAttribute("data-variant", "outline");
  await expect(formAction).toHaveAttribute("href", "/contact/");
  await expect(formAction).toHaveAttribute("data-variant", "default");

  const [emailBox, formBox] = await Promise.all([
    emailAction.boundingBox(),
    formAction.boundingBox(),
  ]);
  expect(emailBox).not.toBeNull();
  expect(formBox).not.toBeNull();

  if (testInfo.project.name === "desktop-chromium") {
    expect(
      Math.abs((emailBox?.y ?? 0) - (formBox?.y ?? 0)),
    ).toBeLessThanOrEqual(1);
    expect((emailBox?.x ?? 0) + (emailBox?.width ?? 0)).toBeLessThanOrEqual(
      formBox?.x ?? 0,
    );
  } else {
    expect(
      Math.abs((emailBox?.x ?? 0) - (formBox?.x ?? 0)),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs((emailBox?.width ?? 0) - (formBox?.width ?? 0)),
    ).toBeLessThanOrEqual(1);
    expect((emailBox?.y ?? 0) + (emailBox?.height ?? 0)).toBeLessThanOrEqual(
      formBox?.y ?? 0,
    );
  }
});

test("homepage reflection promo uses the supplied static image", async ({
  page,
}) => {
  await page.goto("/");

  const reflectionImage = page.locator(
    "[data-guided-reflection-promo] [data-reflection-promo-image]",
  );

  await expect(reflectionImage).toHaveAttribute("alt", "");
  await expect(reflectionImage).toHaveAttribute("loading", "lazy");
  await expect(reflectionImage).toHaveAttribute(
    "src",
    /reflection-promo-door.*\.(?:jpe?g|webp|avif)/,
  );
  await expect(
    page.locator(
      "[data-guided-reflection-promo] [data-reflection-promo-video]",
    ),
  ).toHaveCount(0);
});

test("homepage reflection card matches the neighboring whole-card interaction", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The spatial treatment is limited to precise hover-capable pointers.",
  );

  await page.goto("/");

  const card = page.locator("[data-guided-reflection-promo]");
  const aboutCard = page.locator(".homepage-about__card");
  const aboutImage = page.locator(".homepage-about__portrait img");
  const image = page.locator("[data-reflection-promo-image]");

  await expect(card).toHaveCSS("border-top-width", "0px");
  await expect(card).toHaveCSS("box-shadow", "none");

  await card.hover();
  await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)");
  await expect(card).not.toHaveCSS("box-shadow", "none");
  const reflectionHoverBoxShadow = await card.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await expect(image).toHaveCSS("opacity", "0.9");
  await expect
    .poll(() =>
      image.evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe("matrix(1.015, 0, 0, 1.015, 0, 0)");

  await aboutCard.hover();
  await expect(aboutCard).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -2)");
  await expect(aboutCard).not.toHaveCSS("box-shadow", "none");
  await expect
    .poll(() =>
      aboutCard.evaluate((element) => getComputedStyle(element).boxShadow),
    )
    .toBe(reflectionHoverBoxShadow);
  await expect
    .poll(() =>
      aboutImage.evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe("matrix(1.015, 0, 0, 1.015, 0, 0)");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await card.hover();

  await expect(card).toHaveCSS("transform", "none");
  await expect(image).toHaveCSS("transform", "none");
});

test("primary navigation uses direct public labels and routes", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.locator("[data-site-navigation] a");
  await expect(links).toHaveCount(5);
  await expect(links).toHaveText([
    "Acasă",
    "Psihoterapia psihanalitică",
    "Competențe",
    "Blog",
    "Contact",
  ]);
  await expect(links.nth(2)).toHaveAttribute("href", "/competente/");
  const footerReflectionLink = page.locator(
    '[data-site-footer] nav[aria-label="Explorare"] a',
  );
  await expect(footerReflectionLink).toHaveText("O primă explorare");
  await expect(footerReflectionLink).toHaveAttribute(
    "href",
    "/reflectie-ghidata/",
  );
});

test("shared footer presents the Instagram profile as an accessible external link", async ({
  page,
}, testInfo) => {
  await page.goto("/competente/");

  const footer = page.locator("[data-site-footer]");
  const masthead = footer.locator(".site-footer__masthead");
  const brand = footer.locator(".site-footer__brand");
  const actions = footer.locator(".site-footer__masthead-actions");
  const action = footer.locator(".site-footer__masthead-action");
  const instagramLink = footer.getByRole("link", {
    name: "DespreSine pe Instagram (se deschide într-o filă nouă)",
    exact: true,
  });

  await expect(instagramLink).toBeVisible();
  await expect(instagramLink).toHaveAttribute(
    "href",
    "https://www.instagram.com/despre.sine?igsi=cWJwdWN1Z3dkNDcw",
  );
  await expect(instagramLink).toHaveAttribute("target", "_blank");
  await expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
  await expect(instagramLink.locator("svg")).toBeVisible();

  const [mastheadBox, brandBox, actionsBox, linkBox, actionBox] =
    await Promise.all([
      masthead.boundingBox(),
      brand.boundingBox(),
      actions.boundingBox(),
      instagramLink.boundingBox(),
      action.boundingBox(),
    ]);

  expect(mastheadBox).not.toBeNull();
  expect(brandBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(linkBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  expect(linkBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(linkBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  const linkCenterY = (linkBox?.y ?? 0) + (linkBox?.height ?? 0) / 2;
  const actionCenterY = (actionBox?.y ?? 0) + (actionBox?.height ?? 0) / 2;
  const linkRight = (linkBox?.x ?? 0) + (linkBox?.width ?? 0);
  const actionsRight = (actionsBox?.x ?? 0) + (actionsBox?.width ?? 0);
  const mastheadRight = (mastheadBox?.x ?? 0) + (mastheadBox?.width ?? 0);

  expect(Math.abs(linkCenterY - actionCenterY)).toBeLessThanOrEqual(1);
  expect(actionBox?.x ?? 0).toBeGreaterThanOrEqual(linkRight);
  expect((actionBox?.x ?? 0) - linkRight).toBeGreaterThanOrEqual(11);
  expect((actionBox?.x ?? 0) - linkRight).toBeLessThanOrEqual(13);
  expect(Math.abs(actionsRight - mastheadRight)).toBeLessThanOrEqual(1);

  if (testInfo.project.name === "mobile-chromium") {
    expect(
      Math.abs((brandBox?.x ?? 0) - (actionsBox?.x ?? 0)),
    ).toBeLessThanOrEqual(1);
    expect((brandBox?.y ?? 0) + (brandBox?.height ?? 0)).toBeLessThanOrEqual(
      actionsBox?.y ?? 0,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }

  await instagramLink.focus();
  await expect(instagramLink).toBeFocused();
  await expect(instagramLink).not.toHaveCSS("box-shadow", "none");
});

test("shared footer ends with the clipped Silvia Dinu signature", async ({
  page,
}) => {
  await page.goto("/competente/");

  const footer = page.locator("[data-site-footer]");
  const signature = footer.locator("[data-footer-signature]");
  const lockup = signature.locator(".site-footer__signature-lockup");
  const role = signature.locator(".site-footer__signature-role");
  const name = signature.locator(".site-footer__signature-name");

  await expect(signature).toHaveCount(1);
  await expect(signature).toHaveAttribute("aria-hidden", "true");
  await expect(signature).toHaveCSS("overflow", "hidden");
  await expect(lockup).toHaveCSS("opacity", "0.85");
  await expect(role).toHaveText("Psihoterapeut");
  await expect(name).toHaveText("Silvia Dinu");

  const [footerBox, signatureBox, roleBox, nameBox] = await Promise.all([
    footer.boundingBox(),
    signature.boundingBox(),
    role.boundingBox(),
    name.boundingBox(),
  ]);

  expect(footerBox).not.toBeNull();
  expect(signatureBox).not.toBeNull();
  expect(roleBox).not.toBeNull();
  expect(nameBox).not.toBeNull();

  const footerBottom = (footerBox?.y ?? 0) + (footerBox?.height ?? 0);
  const signatureBottom = (signatureBox?.y ?? 0) + (signatureBox?.height ?? 0);
  const nameBottom = (nameBox?.y ?? 0) + (nameBox?.height ?? 0);

  expect(Math.abs(footerBottom - signatureBottom)).toBeLessThanOrEqual(1);
  expect(nameBox?.y ?? 0).toBeGreaterThan(roleBox?.y ?? 0);
  expect(nameBottom).toBeGreaterThan(signatureBottom + 1);
  const roleInset = (roleBox?.x ?? 0) - (nameBox?.x ?? 0);
  expect(roleInset).toBeGreaterThanOrEqual(12);
  expect(roleInset).toBeLessThanOrEqual(20);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("the legacy competencies route forwards to the canonical page", async ({
  page,
}) => {
  await page.goto("/despre-silvia/");
  await expect(page).toHaveURL(/\/competente\/$/);
});

test("desktop navigation remains accessible without client JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  await page.goto("/");

  const navigation = page.locator("[data-site-navigation]");
  await expect(navigation).toBeVisible();
  await expect(navigation).not.toHaveAttribute("aria-hidden", "true");
  await expect(navigation).not.toHaveAttribute("inert", "");
  await expect(
    navigation.getByRole("link", { name: "Competențe" }),
  ).toBeVisible();

  await context.close();
});

test("homepage opening reveal stages the heading and CTA without hiding sections", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroFallbackImage = hero.locator(".homepage-hero__background img");
  const heroVideo = hero.locator("[data-homepage-hero-video]");
  const heroMotionControl = hero.locator("[data-homepage-hero-motion-control]");
  const heroHeading = hero.locator("[data-homepage-hero-heading]");
  const heroActions = hero.locator("[data-homepage-hero-actions]");

  await expect(heroFallbackImage).toHaveCount(1);
  await expect(heroVideo).toHaveAttribute("autoplay", "");
  await expect(heroVideo).toHaveAttribute("loop", "");
  await expect(heroVideo).toHaveAttribute("muted", "");
  await expect(heroVideo).toHaveAttribute("playsinline", "");
  await expect(heroVideo).toHaveAttribute("preload", "metadata");
  await expect(heroVideo.locator("source")).toHaveAttribute(
    "src",
    "/videos/homepage-hero-leaf-shadows.mp4",
  );
  await expect(heroMotionControl).toBeVisible();
  const motionControlBox = await heroMotionControl.boundingBox();
  expect(Math.round(motionControlBox?.width ?? 0)).toBeGreaterThanOrEqual(44);
  expect(Math.round(motionControlBox?.height ?? 0)).toBeGreaterThanOrEqual(44);
  await expect(heroMotionControl).toHaveAttribute(
    "aria-label",
    "Puneți animația pe pauză",
  );
  await heroMotionControl.click();
  await expect
    .poll(() =>
      heroVideo.evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(true);
  await expect(heroMotionControl).toHaveAttribute(
    "aria-label",
    "Reluați animația",
  );
  await heroMotionControl.click();
  await expect
    .poll(() =>
      heroVideo.evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(false);
  await expect(heroHeading).toHaveCount(1);
  await expect(heroHeading).toHaveCSS(
    "animation-name",
    "homepage-hero-heading-reveal",
  );
  await expect(heroHeading).toHaveCSS("animation-delay", "0.1s");
  await expect(heroActions).toHaveCSS(
    "animation-name",
    "homepage-hero-cta-reveal",
  );
  await expect(heroActions).toHaveCSS("animation-delay", "0.74s");

  await expect
    .poll(() => page.locator("html").getAttribute("data-home-hero-reveal"))
    .toBe("complete");

  const firstHomepageSection = page
    .locator("#continut > section:not([data-homepage-hero])")
    .first();
  await expect(firstHomepageSection).toBeVisible();
  await expect(firstHomepageSection).toHaveCSS("opacity", "1");
  await expect(page.locator("html")).not.toHaveAttribute("data-home-reveal");
});

test("homepage respects reduced-motion preferences", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.locator("[data-homepage-hero]");
  const heroBackground = hero.locator(".homepage-hero__background");
  const heroVideo = hero.locator("[data-homepage-hero-video]");
  const heroMotionControl = hero.locator("[data-homepage-hero-motion-control]");
  const reflectionImage = page.locator("[data-reflection-promo-image]");
  const heroHeading = hero.locator("[data-homepage-hero-heading]");
  const heroActions = hero.locator("[data-homepage-hero-actions]");
  const initialTransform = await heroBackground.evaluate(
    (element) => window.getComputedStyle(element).transform,
  );

  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(hero).toHaveCSS("animation-name", "none");
  await expect(heroHeading).toHaveCount(1);
  await expect(heroHeading).toHaveCSS("animation-name", "none");
  await expect(heroActions).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).not.toHaveAttribute("data-home-reveal");

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(100);

  await expect(heroBackground).toHaveCSS("will-change", "auto");
  await expect(heroVideo).toHaveCSS("display", "none");
  await expect(heroMotionControl).toHaveCSS("display", "none");
  await expect
    .poll(() =>
      heroVideo.evaluate((video) => (video as HTMLVideoElement).paused),
    )
    .toBe(true);
  await expect(reflectionImage).toBeVisible();
  await expect(reflectionImage).toHaveCSS("transform", "none");
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

  const next = blog.getByRole("button", { name: "Articolul următor" });
  const previous = blog.getByRole("button", { name: "Articolul anterior" });
  await expect(next).toBeEnabled();
  await next.click();
  await expect(previous).toBeEnabled();
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
      name: "Ce v-a făcut să vă gândiți că ați vrea să începeți o psihoterapie?",
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
