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

test("email is the only required contact field", async ({ page }) => {
  let contactRequests = 0;
  await page.route("**/api/contact", async (route) => {
    contactRequests += 1;
    await route.fulfill({ json: { ok: true }, status: 200 });
  });

  const form = await openContactForm(page);
  const requiredFields = form.locator("[required]");

  await expect(requiredFields).toHaveCount(1);
  await expect(requiredFields).toHaveAttribute("name", "email");
  await expect(requiredFields).toHaveAttribute("type", "email");

  await form.locator('[type="submit"]').click();

  await expect(requiredFields).toBeFocused();
  expect(
    await requiredFields.evaluate((element) => element.matches(":invalid")),
  ).toBe(true);
  expect(contactRequests).toBe(0);
});

test("meeting format selection gives immediate card-level feedback", async ({
  page,
}) => {
  const form = await openContactForm(page);
  const format = form.locator('[name="meeting_format"]').first();
  const choice = format.locator("..");

  await format.check();

  await expect(format).toBeChecked();
  await expect(choice).toHaveClass(/contact-choice/);
  await expect(choice).toHaveCSS("border-color", "rgb(17, 17, 17)");
  await expect(choice).toHaveCSS("background-color", "rgb(245, 245, 243)");
});

test("optional Romanian input survives loading and resets after success", async ({
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
  const format = form.locator('[name="meeting_format"]').nth(1);
  const submit = form.locator('[type="submit"]');
  const longPracticalNote =
    "În zilele de marți și joi îmi este mai ușor după ora 17:00. 🌿 " +
    "Pot adapta intervalul cu puțin timp înainte; ".repeat(7);

  expect(longPracticalNote.length).toBeLessThanOrEqual(400);
  await name.fill("Ștefania-Maria 🌿");
  await email.fill("stefania@example.com");
  await availability.fill(longPracticalNote);
  await format.check();

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
  await expect(submit).toBeEnabled();
  await expect(name).toHaveValue("");
  await expect(email).toHaveValue("");
  await expect(availability).toHaveValue("");
  await expect(form.locator('[name="meeting_format"]:checked')).toHaveCount(0);
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
  const format = form.locator('[name="meeting_format"]').first();

  await name.fill("Ioana 🕊️");
  await email.fill("ioana@example.com");
  await availability.fill("Prefer dimineața, dar mă pot adapta.");
  await format.check();
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
  await expect(format).toBeChecked();
});
