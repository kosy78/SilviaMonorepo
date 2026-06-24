import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: "Un spațiu pentru a înțelege ce se întâmplă." },
  { path: "/despre-silvia/", heading: "Despre Silvia" },
  {
    path: "/psihoterapie-si-consiliere/",
    heading: "Psihoterapie și consiliere",
  },
  { path: "/blog/", heading: "Blog" },
] as const;

for (const page of pages) {
  test(`${page.path} renders and has no detectable accessibility violations`, async ({
    page: browserPage,
  }) => {
    const response = await browserPage.goto(page.path);

    expect(response?.ok()).toBe(true);
    await expect(
      browserPage.getByRole("heading", { level: 1, name: page.heading }),
    ).toBeVisible();

    const accessibility = await new AxeBuilder({ page: browserPage }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
}
