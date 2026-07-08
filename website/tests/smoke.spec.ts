import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  {
    path: "/",
    heading: "Psihoterapie psihanalitică în București și online.",
  },
  { path: "/despre-silvia/", heading: "Despre Silvia" },
  {
    path: "/psihoterapie-si-consiliere/",
    heading: "Psihoterapie și consiliere",
  },
  {
    path: "/reflectie-ghidata/",
    heading: "Ce pare să ceară atenție acum?",
  },
  { path: "/blog/", heading: "Blog" },
  { path: "/contact/", heading: "Să începem cu un mesaj." },
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

test("an unknown path shows the 404 page without accessibility violations", async ({
  page,
}) => {
  const response = await page.goto("/pagina-inexistenta/");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Pagina căutată nu există." }),
  ).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("the guided reflection shows a non-diagnostic result without requiring contact details", async ({
  page,
}) => {
  await page.goto("/reflectie-ghidata/");
  await page.waitForFunction(
    () => !document.querySelector("astro-island[ssr]"),
  );

  const answers = [
    "În corp, prin tensiune, oboseală, somn schimbat sau alte semnale",
    "Un corp care cere pauză, atenție sau verificare",
    "Ce încearcă să spună corpul meu în acest moment?",
    "Senzațiile, ritmul corpului sau o neliniște simțită fizic",
    "În legătură cu semnalele corpului și cu momentele în care apar",
    "O limită resimțită în corp, în energie sau în somn",
    "Ceva se exprimă prin corp înainte să poată fi înțeles",
  ];

  for (const [index, answer] of answers.entries()) {
    await page.getByText(answer, { exact: true }).click();
    await page
      .getByRole("button", {
        name: index === answers.length - 1 ? "Vedeți reflecția" : "Continuați",
      })
      .click();
  }

  await expect(
    page.getByRole("heading", {
      name: "Dificultatea pare să se facă vizibilă mai ales prin corp.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Această reflecție nu este un diagnostic"),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Hartă radar a răspunsurilor selectate",
    }),
  ).toBeVisible();
  await expect(page.getByText("Corp și semnale fizice")).toBeVisible();
  await expect(page.getByText("7 din 7")).toBeVisible();
  await expect(page.getByText("Notă de fundamentare")).toBeVisible();
  await expect(
    page.getByText("Surse consultate pentru formulare"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Mergeți la contact" }),
  ).toHaveAttribute("href", "/contact/");
});
