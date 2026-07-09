import { expect, type Locator, type Page, test } from "@playwright/test";

function reflectionRegion(page: Page): Locator {
  return page.locator("section").filter({
    has: page.getByRole("progressbar"),
  });
}

async function openReflection(page: Page): Promise<Locator> {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/reflectie-ghidata/");

  const reflection = reflectionRegion(page);
  await expect(reflection.getByRole("radio").first()).toBeVisible();
  return reflection;
}

async function answerCurrentQuestion(
  reflection: Locator,
  answerIndex: number,
): Promise<void> {
  const fieldset = reflection.locator("fieldset");
  const radios = fieldset.getByRole("radio");

  expect(await radios.count()).toBeGreaterThan(answerIndex);
  await radios.nth(answerIndex).check();
  await expect(radios.nth(answerIndex)).toBeChecked();
  await reflection.getByRole("button").last().click();
}

async function completeReflection(
  reflection: Locator,
  answerIndexes: readonly number[],
): Promise<void> {
  for (const answerIndex of answerIndexes) {
    await answerCurrentQuestion(reflection, answerIndex);
  }

  await expect(reflection.locator("fieldset")).toHaveCount(0);
  await expect(reflection.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
}

test("keyboard users can select an answer, advance, go back, and keep their choice", async ({
  page,
}) => {
  const reflection = await openReflection(page);
  const progress = reflection.getByRole("progressbar");
  const initialProgress = Number(await progress.getAttribute("aria-valuenow"));
  const radios = reflection.getByRole("radio");

  await radios.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toBeChecked();

  const advance = reflection.getByRole("button").last();
  await advance.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(async () => Number(await progress.getAttribute("aria-valuenow")))
    .toBeGreaterThan(initialProgress);
  await expect(reflection.locator("fieldset legend")).toBeFocused();

  await answerCurrentQuestion(reflection, 2);
  const progressBeforeBack = Number(
    await progress.getAttribute("aria-valuenow"),
  );
  await reflection.getByRole("button").first().click();

  await expect(progress).toHaveAttribute(
    "aria-valuenow",
    String(progressBeforeBack),
  );
  await expect(reflection.getByRole("radio").nth(2)).toBeChecked();
  await expect(reflection.locator("fieldset legend")).toBeFocused();
});

test("a mixed answer pattern produces a non-diagnostic result and can be reset", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  // The first three options represent the descriptive dimensions; the fourth
  // is the neutral option. The 3/3/0 split ties the strongest dimensions while
  // preserving one explicitly uncertain answer.
  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 3]);

  await expect(
    reflection.locator('[data-reflection-result="mixed"]'),
  ).toBeVisible();
  await expect(reflection).toContainText(
    /nu (?:este|reprezintă) un diagnostic/i,
  );

  const tally = reflection.locator("figure");
  await expect(tally).toBeVisible();
  await expect(tally.locator("dt")).toHaveCount(4);
  const tallyCounts = (await tally.locator("dd").allTextContents()).map(
    (value) => Number.parseInt(value, 10),
  );
  expect(tallyCounts).toEqual([3, 3, 0, 1]);
  await expect(tally.locator('svg[role="img"]')).toHaveCount(0);

  await expect(
    reflection.locator('input[type="email"], input[type="tel"], textarea'),
  ).toHaveCount(0);

  await reflection.locator("[data-reflection-reset]").click();

  await expect(reflection.locator("fieldset")).toBeVisible();
  await expect(reflection.getByRole("radio").first()).not.toBeChecked();
  await expect(reflection.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await expect(reflection.locator("fieldset legend")).toBeFocused();
});

test("answers stay in the browser component and are not submitted or persisted", async ({
  page,
}) => {
  const dataRequests: string[] = [];
  page.on("request", (request) => {
    if (["fetch", "xhr"].includes(request.resourceType())) {
      dataRequests.push(`${request.method()} ${request.url()}`);
    }
  });

  const reflection = await openReflection(page);
  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0]);

  expect(dataRequests).toEqual([]);
  expect(
    await page.evaluate(() => {
      const storageKeys = [
        ...Object.keys(window.localStorage),
        ...Object.keys(window.sessionStorage),
      ];

      return storageKeys.filter((key) =>
        /reflect|reflec|answer|rasp|răsp/i.test(key),
      );
    }),
  ).toEqual([]);
  await expect(
    reflection.locator("input[type=email], input[type=tel], textarea"),
  ).toHaveCount(0);
});
