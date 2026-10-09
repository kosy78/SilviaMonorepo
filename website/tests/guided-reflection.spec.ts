import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

function reflectionRegion(page: Page): Locator {
  return page.locator("[data-guided-reflection]");
}

async function openReflection(page: Page): Promise<Locator> {
  await page.addInitScript(() => {
    window.localStorage.setItem("silvia.analyticsConsent", "rejected");
  });
  await page.goto("/reflectie-ghidata/");

  const reflection = reflectionRegion(page);
  await expect(reflection.getByRole("radio").first()).toBeEnabled();
  return reflection;
}

async function answerCurrentQuestion(
  reflection: Locator,
  answerIndex: number,
): Promise<void> {
  const fieldset = reflection.locator("fieldset");
  const radios = fieldset.getByRole("radio");
  const stepLabel = reflection.locator("[data-reflection-step-label]");
  const stepText = await stepLabel.innerText();
  const stepMatch = stepText.match(/Întrebarea (\d+) din (\d+)/);

  expect(stepMatch).not.toBeNull();
  const currentStep = Number(stepMatch?.[1]);
  const totalSteps = Number(stepMatch?.[2]);

  expect(await radios.count()).toBeGreaterThan(answerIndex);
  await radios.nth(answerIndex).check();
  await expect(radios.nth(answerIndex)).toBeChecked();
  await reflection
    .getByRole("button", {
      name: currentStep === totalSteps ? "Vedeți rezultatul" : "Continuați",
    })
    .click();

  if (currentStep === totalSteps) {
    await expect(reflection.locator("[data-reflection-result]")).toBeVisible();
  } else {
    await expect(stepLabel).toHaveText(
      `Întrebarea ${currentStep + 1} din ${totalSteps}`,
    );
  }
}

async function completeReflection(
  reflection: Locator,
  answerIndexes: readonly number[],
): Promise<void> {
  for (const answerIndex of answerIndexes) {
    await answerCurrentQuestion(reflection, answerIndex);
  }

  await expect(reflection.locator("fieldset")).toHaveCount(0);
  await expect(reflection.locator("[data-reflection-result]")).toBeVisible();
}

test("keyboard users can select an answer, advance, go back, and keep their choice", async ({
  page,
}) => {
  const reflection = await openReflection(page);
  await expect(
    reflection.getByText(
      "Rezultatul este orientativ și nu reprezintă un diagnostic.",
      { exact: true },
    ),
  ).toHaveCount(0);
  const progress = reflection.getByRole("progressbar");
  const progressFill = progress.locator("div");
  const stepStatus = reflection.locator("[data-reflection-step-label]");
  expect(
    await reflection
      .locator("[data-reflection-steps]")
      .getAttribute("aria-live"),
  ).toBeNull();
  await expect(stepStatus).toHaveAttribute("role", "status");
  await expect(stepStatus).toHaveAttribute("aria-live", "polite");
  await expect(stepStatus).toHaveAttribute("aria-atomic", "true");
  const initialProgress = Number(await progress.getAttribute("aria-valuenow"));
  const radios = reflection.getByRole("radio");
  const questionHeading = reflection.locator("fieldset legend");
  const questionTypography = await questionHeading.evaluate((element) => {
    const styles = window.getComputedStyle(element);

    return {
      fontSize: Number.parseFloat(styles.fontSize),
      lineHeight: Number.parseFloat(styles.lineHeight),
    };
  });
  const radioCenterOffsets = await radios.evaluateAll((elements) =>
    elements.map((element) => {
      const row = element.closest("label");
      if (!row) return Number.POSITIVE_INFINITY;

      const rowRect = row.getBoundingClientRect();
      const radioRect = element.getBoundingClientRect();

      return Math.abs(
        rowRect.top +
          rowRect.height / 2 -
          (radioRect.top + radioRect.height / 2),
      );
    }),
  );

  await expect(reflection.getByRole("button", { name: "Înapoi" })).toHaveCount(
    0,
  );
  await expect(progress).toBeInViewport();
  await expect(progressFill).toHaveClass(/transition-transform/);
  await expect(progressFill).toHaveCSS(
    "transition-timing-function",
    "cubic-bezier(0.65, 0, 0.35, 1)",
  );
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(progress).toHaveAttribute("data-state", "loading");
  await expect(progress).toHaveAttribute(
    "aria-valuetext",
    "Întrebarea 1 din 8",
  );
  expect(initialProgress).toBe(13);
  await expect(progressFill).toHaveAttribute("style", /translateX\(-87%\)/);
  for (const offset of radioCenterOffsets) {
    expect(offset).toBeLessThanOrEqual(0.5);
  }
  if ((page.viewportSize()?.width ?? 0) < 768) {
    expect(questionTypography.fontSize).toBe(30);
    expect(questionTypography.lineHeight / questionTypography.fontSize).toBe(
      1.4,
    );
  } else {
    expect((await progress.boundingBox())?.width).toBe(384);
    expect(questionTypography.fontSize).toBe(36);
    expect(
      questionTypography.lineHeight / questionTypography.fontSize,
    ).toBeCloseTo(1.2, 5);
  }

  await radios.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toBeChecked();
  const selectedLabel = radios.nth(1).locator("xpath=ancestor::label");
  const unselectedLabel = radios.nth(2).locator("xpath=ancestor::label");
  const [selectedBackground, unselectedBackground] = await Promise.all([
    selectedLabel.evaluate(
      (element) => window.getComputedStyle(element).backgroundColor,
    ),
    unselectedLabel.evaluate(
      (element) => window.getComputedStyle(element).backgroundColor,
    ),
  ]);
  expect(selectedBackground).not.toBe(unselectedBackground);

  const advance = reflection.getByRole("button").last();
  await expect(advance).not.toHaveClass(/translate-y-px/);
  await advance.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(async () => Number(await progress.getAttribute("aria-valuenow")))
    .toBeGreaterThan(initialProgress);
  await expect(
    reflection.getByRole("button", { name: "Înapoi" }),
  ).toBeVisible();
  await expect(progress).toBeInViewport();
  await expect(progressFill).toHaveAttribute("style", /translateX\(-\d+%\)/);
  const nextQuestionHeading = reflection.locator("fieldset legend");
  const nextQuestion = reflection.locator("[data-reflection-question-body]");
  await expect(nextQuestion).toHaveCSS(
    "animation-name",
    "reflection-question-enter",
  );
  await expect(nextQuestion).toHaveCSS("animation-duration", "0.22s");
  await expect(nextQuestionHeading).toBeFocused();
  await expect(nextQuestionHeading).toHaveClass(/focus-visible:shadow-none/);
  expect(
    await nextQuestionHeading.evaluate(
      (element) => window.getComputedStyle(element).boxShadow,
    ),
  ).not.toContain("rgb(17, 17, 17)");
  await expect
    .poll(() =>
      nextQuestionHeading.evaluate((element) => {
        const header = document.querySelector("header");
        return (
          element.getBoundingClientRect().top -
          (header?.getBoundingClientRect().bottom ?? 0)
        );
      }),
    )
    .toBeGreaterThanOrEqual(8);

  const accessibility = await new AxeBuilder({ page })
    .include("[data-reflection-question]")
    .analyze();
  expect(accessibility.violations).toEqual([]);

  await answerCurrentQuestion(reflection, 2);
  const progressBeforeBack = Number(
    await progress.getAttribute("aria-valuenow"),
  );
  await reflection.getByRole("button").first().click();

  expect(Number(await progress.getAttribute("aria-valuenow"))).toBeLessThan(
    progressBeforeBack,
  );
  await expect(reflection.getByRole("radio").nth(2)).toBeChecked();
  await expect(reflection.locator("fieldset legend")).toBeFocused();
});

test("continuing without an answer explains the requirement and keeps focus in the question", async ({
  page,
}) => {
  const reflection = await openReflection(page);
  const radios = reflection.getByRole("radio");
  const radioGroup = reflection.getByRole("radiogroup");
  const advance = reflection.getByRole("button", { name: "Continuați" });

  await expect(advance).toBeEnabled();
  await advance.click();

  const error = reflection.getByRole("alert");
  await expect(error).toHaveText("Selectați un răspuns pentru a continua.");
  await expect(radios.first()).toBeFocused();
  await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  await expect(radioGroup).toHaveAttribute(
    "aria-describedby",
    "reflection-answer-error",
  );

  await radios.first().check();
  await expect(error).toHaveCount(0);
  await expect(radioGroup).toHaveAttribute("aria-invalid", "false");
  await advance.click();
  await expect(
    reflection.locator("[data-reflection-step-label]"),
  ).toContainText("Întrebarea 2 din 8");
});

test("a tied pattern produces the distributed mixed result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  // The first two directions each appear four times, producing a clear tie.
  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 0, 1]);

  const mixedResult = reflection.locator('[data-reflection-result="mixed"]');
  await expect(mixedResult).toBeVisible();
  await expect(mixedResult).toHaveAttribute(
    "data-reflection-variant",
    "distributed",
  );
  const completion = reflection.locator("[data-reflection-complete]");
  await expect(completion).toBeVisible();
  await expect(completion).toBeInViewport();
  await expect(completion).toHaveAttribute("role", "status");
  await expect(completion).toHaveAttribute("data-tone", "success");
  await expect(completion).toContainText("Reflecție finalizată");
  await expect(completion).toHaveCSS(
    "background-color",
    "oklch(0.94 0.035 145)",
  );
  await expect(completion).toHaveCSS("color", "oklch(0.36 0.07 145)");
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-name",
    "reflection-complete-mark",
  );
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-duration",
    "0.22s",
  );
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-delay",
    "0.06s",
  );
  await expect(reflection.locator("[data-reflection-result]")).toHaveClass(
    /ui-panel-enter/,
  );
  await expect(completion.getByRole("progressbar")).toHaveCount(0);
  await expect(reflection.getByRole("heading", { level: 1 })).toHaveText(
    "Direcții de explorare",
  );
  expect(
    await reflection
      .locator("[data-reflection-result-content]")
      .evaluate((resultContent) => {
        const completionStatus = resultContent.querySelector(
          "[data-reflection-complete]",
        );
        const resultHeading = resultContent.querySelector("h1");

        return (
          completionStatus?.parentElement?.matches(
            '[data-slot="card-header"]',
          ) === true &&
          resultHeading?.parentElement === completionStatus.parentElement &&
          completionStatus.nextElementSibling === resultHeading
        );
      }),
  ).toBe(true);

  const tally = reflection.locator("[data-reflection-distribution]");
  await expect(tally).toBeVisible();
  await expect(tally).toHaveAccessibleName("Cum s-au împărțit răspunsurile");
  await expect(reflection.locator("h1")).toHaveCount(1);
  expect(
    await reflection
      .locator("h1")
      .evaluate((heading) =>
        Number.parseFloat(getComputedStyle(heading).fontSize),
      ),
  ).toBeGreaterThanOrEqual(32);
  await expect(reflection.locator("h1 + p")).toHaveText(
    "Fiecare segment reprezintă un răspuns. Distribuția arată ce tip de variantă a fost ales mai des, nu cât de gravă este o dificultate.",
  );
  await expect(tally.locator("h3, figcaption")).toHaveCount(0);
  await expect(tally.locator("dt")).toHaveCount(3);
  await expect(tally.locator("[data-reflection-frequency]")).toHaveCount(3);
  const tallyCounts = (
    await tally.locator("[data-reflection-count]").allTextContents()
  ).map((value) => Number.parseInt(value, 10));
  expect(tallyCounts).toEqual([4, 4, 0]);
  const frequencyFills = await tally
    .locator('[data-reflection-dimension] [data-slot="progress-indicator"]')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).backgroundImage),
    );
  expect(frequencyFills.slice(0, 3).every((fill) => fill !== "none")).toBe(
    true,
  );
  expect(new Set(frequencyFills.slice(0, 3)).size).toBe(3);
  await expect(tally.locator("svg")).toHaveCount(0);
  await expect(reflection.locator("[data-first-session]")).toHaveCount(0);
  await expect(
    reflection.getByRole("heading", {
      name: "Oare cum va fi prima ședință, la ce să mă aștept?",
    }),
  ).toHaveCount(0);
  const tallyBox = await tally.boundingBox();
  const contentBox = await reflection
    .locator('[data-slot="card-content"]')
    .boundingBox();
  expect(tallyBox!.width / contentBox!.width).toBeGreaterThan(0.85);
  await expect(reflection).not.toContainText("O direcție apropiată");

  const resultContent = reflection.locator("[data-reflection-result-content]");
  const hasExpectedContentOrder = await resultContent.evaluate((content) => {
    const selectors = [
      "h1",
      "[data-reflection-distribution]",
      "[data-reflection-actions]",
    ];
    const elements = selectors.map((selector) =>
      content.querySelector(selector),
    );

    return elements.every((element, index) => {
      if (index === elements.length - 1) return Boolean(element);

      const nextElement = elements[index + 1];
      return Boolean(
        element &&
        nextElement &&
        element.compareDocumentPosition(nextElement) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });
  expect(hasExpectedContentOrder).toBe(true);
  const sources = reflection.getByRole("button", {
    name: "Surse",
    exact: true,
  });
  await expect(sources).toHaveCount(1);
  await expect(sources).toHaveAttribute("data-variant", "link");
  await expect(sources).toHaveAttribute("data-size", "inline");
  await expect(
    resultContent.locator('[data-slot="card-header"]'),
  ).toContainText("Surse");
  expect(
    await sources.evaluate(
      (element) => element.previousElementSibling?.tagName,
    ),
  ).toBe("P");
  await sources.click();
  const sourcesDialog = page.getByRole("dialog", {
    name: "Surse",
    exact: true,
  });
  await expect(sourcesDialog).toBeVisible();
  await expect(
    sourcesDialog.locator("[data-reflection-disclaimer]"),
  ).toContainText(
    "Răspunsurile din această explorare nu reprezintă un diagnostic",
  );
  await expect(sourcesDialog.getByRole("link")).toHaveCount(3);
  await expect(
    sourcesDialog.getByRole("link", { name: /^Diagnostic Psihodinamic/ }),
  ).toHaveAttribute(
    "href",
    "https://www.edituratrei.ro/carte/diagnostic-psihodinamic-operationalizat-opd-2-manual-de-diagnostic-si-planificarea-terapiei/11085/",
  );
  await expect(
    sourcesDialog.getByRole("link", { name: /^WHODAS 2.0/ }),
  ).toHaveAttribute(
    "href",
    "https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule",
  );
  const closeSources = sourcesDialog.getByRole("button", {
    name: "Închideți",
    exact: true,
  });
  await closeSources.focus();
  await page.keyboard.press("Tab");
  await expect(sourcesDialog.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(closeSources).toBeFocused();
  const sourcesAccessibility = await new AxeBuilder({ page })
    .include("[data-reflection-sources-dialog]")
    .analyze();
  expect(sourcesAccessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(sourcesDialog).toBeHidden();
  await expect(sources).toBeFocused();
  await sources.click();
  await closeSources.click();
  await expect(sourcesDialog).toBeHidden();
  await expect(sources).toBeFocused();

  const visibleResultElements = await reflection
    .locator(
      "[data-reflection-complete], [data-slot=card-header] h1, [data-reflection-distribution]",
    )
    .all();
  const visibleResultWords = await Promise.all(
    visibleResultElements.map((element) => element.innerText()),
  );
  expect(visibleResultWords.join(" ").trim().split(/\s+/).length).toBeLessThan(
    300,
  );

  await expect(reflection.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(tally).toBeInViewport();

  const reflectionBox = await reflection.boundingBox();
  const resultBox = await reflection
    .locator("[data-reflection-result]")
    .boundingBox();
  expect(reflectionBox).not.toBeNull();
  expect(resultBox).not.toBeNull();
  expect((resultBox?.width ?? 0) / (reflectionBox?.width ?? 1)).toBeGreaterThan(
    0.85,
  );
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect((resultBox?.height ?? 0) / (viewport?.height ?? 1)).toBeLessThan(3.5);

  const accessibility = await new AxeBuilder({ page })
    .include("[data-reflection-result]")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);

  await expect(
    reflection.locator('input[type="email"], input[type="tel"], textarea'),
  ).toHaveCount(0);

  await reflection.locator("[data-reflection-reset]").click();

  const resetDialog = reflection.locator("[data-reflection-reset-dialog]");
  await expect(resetDialog).toBeVisible();
  await expect(resetDialog).toContainText(
    "Sigur doriți să reluați explorarea?",
  );
  await expect(resetDialog).toContainText("Rezultatul actual va fi pierdut.");
  await resetDialog.getByRole("button", { name: "Nu" }).click();
  await expect(resetDialog).toBeHidden();
  await expect(mixedResult).toBeVisible();

  await reflection.locator("[data-reflection-reset]").click();
  await resetDialog.getByRole("button", { name: "Da, reluați" }).click();

  await expect(reflection.locator("fieldset")).toBeVisible();
  await expect(reflection.getByRole("radio").first()).not.toBeChecked();
  await expect(reflection.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "13",
  );
  await expect(reflection.locator("fieldset legend")).toBeFocused();
});

test("reduced motion removes movement from the completed reflection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reflection = await openReflection(page);

  await expect(reflection.locator("[data-reflection-question-body]")).toHaveCSS(
    "animation-name",
    "none",
  );

  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 0, 1]);

  const result = reflection.locator("[data-reflection-result]");
  const completionIcon = reflection.locator("[data-reflection-complete] > svg");
  const sources = reflection.getByRole("button", {
    name: "Surse",
    exact: true,
  });

  await expect(result).toHaveCSS("animation-name", "none");
  await expect(completionIcon).toHaveCSS("animation-name", "none");
  await sources.click();
  await expect(
    page.getByRole("dialog", { name: "Surse", exact: true }),
  ).toHaveCSS("animation-name", "none");
  await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("all uncertain answers produce the unclear mixed result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [3, 3, 3, 3, 3, 3, 3, 3]);

  const mixedResult = reflection.locator('[data-reflection-result="mixed"]');
  await expect(mixedResult).toBeVisible();
  await expect(mixedResult).toHaveAttribute(
    "data-reflection-variant",
    "unclear",
  );
  await expect(reflection.getByRole("heading", { level: 1 })).toHaveText(
    "Direcții de explorare",
  );
  await expect(reflection.locator("[data-reflection-count]")).toHaveText([
    "0 din 8",
    "0 din 8",
    "0 din 8",
    "8 din 8",
  ]);
  await expect(reflection.locator("[data-first-session]")).toHaveCount(0);
  await reflection.getByRole("button", { name: "Surse", exact: true }).click();
  await expect(
    page
      .getByRole("dialog", { name: "Surse", exact: true })
      .locator("[data-reflection-disclaimer]"),
  ).toContainText(
    "nu înlocuiesc o evaluare psihologică realizată de un specialist",
  );
});

test("four uncertain answers force the unclear mixed result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 0, 0, 1, 3, 3, 3, 3]);

  const mixedResult = reflection.locator('[data-reflection-result="mixed"]');
  await expect(mixedResult).toBeVisible();
  await expect(mixedResult).toHaveAttribute(
    "data-reflection-variant",
    "unclear",
  );
  await expect(reflection.getByRole("heading", { level: 1 })).toHaveText(
    "Direcții de explorare",
  );
  await expect(reflection.locator("[data-reflection-count]")).toHaveText([
    "3 din 8",
    "1 din 8",
    "0 din 8",
    "4 din 8",
  ]);
});

test("a unique winner omits the nearby secondary subsection", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 0, 0, 0, 1, 1, 1, 3]);

  await expect(
    reflection.locator('[data-reflection-result="body"]'),
  ).toBeVisible();
  await expect(reflection.getByRole("heading", { level: 1 })).toHaveText(
    "Direcții de explorare",
  );
  await expect(reflection).not.toContainText("O direcție apropiată");
  await expect(reflection.locator("[data-reflection-secondary]")).toHaveCount(
    0,
  );
  await expect(
    reflection.locator('[data-reflection-dimension="uncertain"]'),
  ).toHaveCount(1);
  await expect(
    reflection.locator('[data-reflection-dimension="uncertain"]'),
  ).toContainText("1 din 8");
  await reflection.getByRole("button", { name: "Surse", exact: true }).click();
  await expect(
    page
      .getByRole("dialog", { name: "Surse", exact: true })
      .locator("[data-reflection-disclaimer]"),
  ).toContainText(
    "Răspunsurile din această explorare nu reprezintă un diagnostic",
  );
});

test("the reflection result enters the contact message only after explicit opt-in", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 0, 0, 0, 1, 1, 1, 3]);

  const includeResult = reflection.getByRole("checkbox", {
    name: /Includeți rezultatul explorării în mesaj/,
  });
  await expect(includeResult).not.toBeChecked();
  const contactOption = reflection.locator("[data-reflection-contact-option]");
  await expect(contactOption).toHaveCSS("font-size", "14px");
  await expect(contactOption).toHaveCSS("font-weight", "400");
  await expect(contactOption).not.toContainText(
    "Vor fi incluse doar rezumatul și distribuția, nu răspunsurile individuale.",
  );

  await includeResult.check();
  await reflection.getByRole("link", { name: "Scrieți un prim mesaj" }).click();

  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("[data-contact-reflection]")).toBeVisible();
  const attachedResult = page.locator("[data-contact-reflection-input]");
  await expect(attachedResult).toBeEnabled();
  await expect(attachedResult).toHaveValue(
    /Dificultățile legate de corp au apărut mai des\./,
  );
  await expect(attachedResult).toHaveValue(/Corp, somn și energie: 4 din 8/);
  await expect(attachedResult).not.toHaveValue(
    /Mă simt mai obosit\(ă\), dorm mai prost/,
  );
  expect(new URL(page.url()).search).toBe("");
  expect(await page.evaluate(() => window.name)).toBe("");
  expect(
    await page.evaluate(() =>
      window.sessionStorage.getItem("despresine.reflectionResult"),
    ),
  ).toBeNull();

  await page.getByRole("button", { name: "Eliminați rezultatul" }).click();
  await expect(page.locator("[data-contact-reflection]")).toBeHidden();
  await expect(attachedResult).toBeDisabled();
  await expect(attachedResult).toHaveValue("");
  await expect(page.getByRole("status")).toContainText(
    "Rezultatul reflecției a fost eliminat din mesaj.",
  );

  await page.goBack();
  await expect(page).toHaveURL(/\/reflectie-ghidata\/$/);
  await expect(page.locator("[data-contact-form]")).toHaveCount(0);
  await expect(
    page.locator("[data-guided-reflection]").getByRole("radio").first(),
  ).toBeEnabled();
});

test("the completion acknowledgement respects reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0, 1]);

  const completion = reflection.locator("[data-reflection-complete]");
  await expect(completion).toContainText("Reflecție finalizată");
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(completion.getByRole("progressbar")).toHaveCount(0);
  await expect(completion.locator(".reflection-complete__spark")).toHaveCount(
    0,
  );
});

test("answers stay in the browser component and are not submitted or persisted", async ({
  page,
}) => {
  const dataRequests: string[] = [];
  const resultChunkRequests: string[] = [];
  page.on("request", (request) => {
    if (/ReflectionAnswer|recharts/i.test(request.url())) {
      resultChunkRequests.push(request.url());
    }

    if (
      ["fetch", "xhr"].includes(request.resourceType()) &&
      (request.method() !== "GET" || request.url().includes("/api/"))
    ) {
      dataRequests.push(`${request.method()} ${request.url()}`);
    }
  });

  const reflection = await openReflection(page);
  resultChunkRequests.length = 0;
  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0, 1]);
  await expect(
    reflection.getByRole("button", {
      name: "Distribuiți sau salvați rezultatul",
    }),
  ).toHaveCount(0);
  await expect(reflection.locator("[data-reflection-share]")).toHaveCount(0);

  expect(dataRequests).toEqual([]);
  expect(resultChunkRequests).toEqual([]);
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

test("without JavaScript, the reflection explains why its controls are unavailable", async ({
  baseURL,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto(new URL("/reflectie-ghidata/", baseURL).href);

    const reflection = reflectionRegion(page);
    const fallback = reflection.locator("noscript");
    await expect(fallback).toBeVisible();
    expect(await fallback.textContent()).toContain(
      "Pentru a parcurge reflecția ghidată, activați JavaScript.",
    );
    await expect(
      reflection.locator("[data-reflection-question]"),
    ).toHaveAttribute("aria-busy", "true");
    await expect(reflection.getByRole("radio")).toHaveCount(4);
    await expect(reflection.getByRole("radio").first()).toBeDisabled();
    await expect(
      reflection.getByRole("button", { name: "Continuați" }),
    ).toBeDisabled();
  } finally {
    await context.close();
  }
});
