import { readFile, readdir } from "node:fs/promises";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { extractDesignTokens } from "../src/lib/design-system";

const tokenSources = [
  {
    file: new URL("../src/styles/tokens.css", import.meta.url),
    scope: "@theme",
    source: "tokens.css:@theme",
  },
  {
    file: new URL("../src/styles/tokens.css", import.meta.url),
    scope: ":root",
    source: "tokens.css::root",
  },
  {
    file: new URL("../src/styles/global.css", import.meta.url),
    scope: ":root",
    source: "global.css::root",
  },
  {
    file: new URL("../src/styles/global.css", import.meta.url),
    scope: ".dark",
    source: "global.css:.dark",
  },
] as const;

test("design-system route mirrors canonical tokens and the UI directory", async ({
  page,
}) => {
  const response = await page.goto("/design-system/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sistemul de design DespreSine",
    }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator("[data-site-header]")).toHaveCount(0);
  await expect(page.locator("[data-site-footer]")).toHaveCount(0);
  await expect(page.locator("[data-analytics-consent]")).toHaveCount(0);

  const expectedTokens = (
    await Promise.all(
      tokenSources.map(async ({ file, scope, source }) => {
        const css = await readFile(file, "utf8");
        return extractDesignTokens(css, scope, source).map(
          (token) => `${token.source}|${token.name}`,
        );
      }),
    )
  )
    .flat()
    .sort();
  const renderedTokens = await page
    .locator("[data-token-source][data-token-name]")
    .evaluateAll((elements) =>
      elements
        .map(
          (element) =>
            `${(element as HTMLElement).dataset.tokenSource}|${(element as HTMLElement).dataset.tokenName}`,
        )
        .sort(),
    );

  expect(renderedTokens).toEqual(expectedTokens);

  const uiDirectory = new URL("../src/components/ui/", import.meta.url);
  const expectedComponents = (await readdir(uiDirectory))
    .filter((fileName) => /\.(astro|tsx)$/.test(fileName))
    .sort();
  const renderedComponents = await page
    .locator("[data-component-file]")
    .evaluateAll((elements) =>
      elements
        .map((element) => (element as HTMLElement).dataset.componentFile ?? "")
        .sort(),
    );

  expect(renderedComponents).toEqual(expectedComponents);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("design-system interactive specimens work with the keyboard", async ({
  page,
}) => {
  await page.goto("/design-system/");

  const trigger = page.getByRole("button", {
    name: "Ce păstrează sistemul consecvent?",
  });
  await expect(
    page.locator('astro-island[component-url*="InteractiveShowcase"]'),
  ).not.toHaveAttribute("ssr", "");
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText(/Tokenurile comune, variantele explicite/),
  ).toBeVisible();

  const cabinet = page.getByRole("radio", { name: "În cabinet" });
  await cabinet.focus();
  await page.keyboard.press("Space");
  await expect(cabinet).toBeChecked();
  await expect(
    page.getByRole("progressbar", { name: "Progres demonstrativ: 34%" }),
  ).toBeVisible();
});

test("design-system page reflows at 320px without document overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/design-system/");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});
