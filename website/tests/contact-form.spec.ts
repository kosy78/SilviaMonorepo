import { expect, type Locator, type Page, test } from "@playwright/test";

async function openContactForm(page: Page): Promise<Locator> {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/contact/");

  const form = page.locator("[data-contact-form]");
  await expect(form).toBeVisible();
  return form;
}

async function openContactFormWithReflection(
  page: Page,
  text: string,
): Promise<Locator> {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/reflectie-ghidata/");
  await page.evaluate((reflectionText) => {
    window.sessionStorage.setItem(
      "despresine.reflectionResult",
      JSON.stringify({ text: reflectionText, version: 1 }),
    );
  }, text);
  await page.goto("/contact/");

  const form = page.locator("[data-contact-form]");
  await expect(form).toBeVisible();
  return form;
}

test("name and email are required contact fields", async ({ page }) => {
  let contactRequests = 0;
  await page.route("**/api/contact", async (route) => {
    contactRequests += 1;
    await route.fulfill({ json: { ok: true }, status: 200 });
  });

  const form = await openContactForm(page);
  const name = form.locator('[name="name"]');
  const email = form.locator('[name="email"]');

  await expect(form.locator("[required]")).toHaveCount(2);
  await expect(name).toHaveAttribute("required", "");
  await expect(email).toHaveAttribute("required", "");
  await expect(email).toHaveAttribute("type", "email");
  await expect(form.locator('[name="meeting_format"]')).toHaveCount(0);
  await expect(form.getByLabel("Mesajul/ Solicitarea dvs")).toBeVisible();
  await expect(form.getByLabel("Mesajul/ Solicitarea dvs")).toHaveAttribute(
    "aria-describedby",
    "contact-privacy-note",
  );
  await expect(form.locator("#contact-privacy-note")).toContainText(
    "informații sensibile",
  );
  await expect(
    form.getByRole("link", { name: "politica de confidențialitate" }),
  ).toHaveAttribute("href", "/politica-de-confidentialitate/");

  await form.locator('[type="submit"]').click();

  await expect(email).toBeFocused();
  expect(await email.evaluate((element) => element.matches(":invalid"))).toBe(
    true,
  );
  expect(contactRequests).toBe(0);

  await email.fill("stefania@example.com");
  await form.locator('[type="submit"]').click();
  await expect(name).toBeFocused();
  expect(contactRequests).toBe(0);
});

test("Romanian input survives loading and resets after success", async ({
  page,
}) => {
  let resolveRequestStarted = () => {};
  const requestStarted = new Promise<void>((resolve) => {
    resolveRequestStarted = resolve;
  });
  let releaseResponse = () => {};
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  let submittedRequestMethod = "";

  await page.route("**/api/contact", async (route) => {
    submittedRequestMethod = route.request().method();
    resolveRequestStarted();
    await responseGate;
    await route.fulfill({ json: { ok: true }, status: 200 });
  });

  const form = await openContactForm(page);
  const name = form.locator('[name="name"]');
  const email = form.locator('[name="email"]');
  const availability = form.locator('[name="availability"]');
  const submit = form.locator('[type="submit"]');
  const longPracticalNote =
    "În zilele de marți și joi îmi este mai ușor după ora 17:00. 🌿 " +
    "Pot adapta intervalul cu puțin timp înainte; ".repeat(7);

  expect(longPracticalNote.length).toBeLessThanOrEqual(400);
  await name.fill("Ștefania-Maria 🌿");
  await email.fill("stefania@example.com");
  await availability.fill(longPracticalNote);

  await submit.click();
  await requestStarted;

  expect(submittedRequestMethod).toBe("POST");
  await expect(submit).toBeDisabled();
  await expect(submit).toHaveAccessibleName(/se trimite/i);
  await expect(name).toHaveValue("Ștefania-Maria 🌿");
  await expect(availability).toHaveValue(longPracticalNote);

  releaseResponse();

  const status = form.locator("[data-contact-status]");
  await expect(status).toBeVisible();
  await expect(status).toBeFocused();
  await expect(status).toContainText(/trimis/i);
  await expect(status).toHaveCSS("animation-name", "contact-status-enter");
  await expect(status).toHaveCSS("animation-duration", "0.16s");
  await expect(submit).toBeEnabled();
  await expect(name).toHaveValue("");
  await expect(email).toHaveValue("");
  await expect(availability).toHaveValue("");
});

test("an opted-in reflection summary is visibly attached and submitted", async ({
  page,
}) => {
  const reflectionText = [
    "Rezultat al reflecției ghidate — DespreSine",
    "",
    "Stările emoționale au apărut mai des.",
    "",
    "Stări emoționale: 4 din 8",
    "Nu este un diagnostic.",
  ].join("\n");
  let submittedBody = "";

  await page.route("**/api/contact", async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ json: { ok: true }, status: 200 });
  });

  const form = await openContactFormWithReflection(page, reflectionText);
  const attachment = form.locator("[data-contact-reflection]");
  const attachmentInput = form.locator("[data-contact-reflection-input]");

  await expect(attachment).toBeVisible();
  await expect(attachment).toContainText("Rezultatul reflecției este inclus");
  await expect(attachmentInput).toBeEnabled();
  await expect(attachmentInput).toHaveValue(reflectionText);
  expect(await page.evaluate(() => window.name)).toBe("");
  expect(
    await page.evaluate(() =>
      window.sessionStorage.getItem("despresine.reflectionResult"),
    ),
  ).toBeNull();
  await form.locator('[name="name"]').fill("Ștefania");
  await form.locator('[name="email"]').fill("stefania@example.com");
  await form.locator('[type="submit"]').click();

  await expect(form.locator("[data-contact-status]")).toContainText(/trimis/i);
  expect(submittedBody).toContain('name="reflection_result"');
  expect(submittedBody).toContain(
    "Rezultat al reflecției ghidate — DespreSine",
  );
  await expect(attachment).toBeHidden();
  await expect(attachmentInput).toBeDisabled();
});

test("a 503 response preserves input and exposes an accessible recovery message", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({ json: { ok: false }, status: 503 });
  });

  const form = await openContactForm(page);
  const name = form.locator('[name="name"]');
  const email = form.locator('[name="email"]');
  const availability = form.locator('[name="availability"]');

  await name.fill("Ioana 🕊️");
  await email.fill("ioana@example.com");
  await availability.fill("Prefer dimineața, dar mă pot adapta.");
  await form.locator('[type="submit"]').click();

  const status = form.getByRole("status");
  await expect(status).toBeVisible();
  await expect(status).toBeFocused();
  await expect(status).toContainText("silvia.drn@gmail.com");
  await expect(name).toHaveValue("Ioana 🕊️");
  await expect(email).toHaveValue("ioana@example.com");
  await expect(availability).toHaveValue(
    "Prefer dimineața, dar mă pot adapta.",
  );
});

test("direct email focus remains visible in forced colors", async ({
  page,
}) => {
  const form = await openContactForm(page);
  await page.emulateMedia({ forcedColors: "active" });

  const directEmailLink = page
    .locator(".contact-letter__opening")
    .getByRole("link", { name: "silvia.drn@gmail.com" });
  await directEmailLink.focus();

  await expect(directEmailLink).toHaveCSS("outline-style", "solid");
  await expect(directEmailLink).toHaveCSS("outline-width", "2px");
  await expect(form).toBeVisible();
});
