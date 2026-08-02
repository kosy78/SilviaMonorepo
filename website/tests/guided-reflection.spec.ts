import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

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
  await expect(reflection.locator("[data-reflection-result]")).toBeVisible();
}

test("keyboard users can select an answer, advance, go back, and keep their choice", async ({
  page,
}) => {
  const reflection = await openReflection(page);
  const progress = reflection.getByRole("progressbar");
  const progressFill = progress.locator("div");
  await expect(reflection.locator("#reflection-privacy-note")).toHaveText(
    "Rezultatul este orientativ și nu reprezintă un diagnostic.",
  );
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
  await expect(progress).toHaveAttribute("data-state", "loading");
  await expect(progress).toHaveAttribute(
    "aria-valuetext",
    "Întrebarea 1 din 7",
  );
  expect(initialProgress).toBe(14);
  await expect(progressFill).toHaveAttribute("style", /translateX\(-86%\)/);
  for (const offset of radioCenterOffsets) {
    expect(offset).toBeLessThanOrEqual(0.5);
  }
  if ((page.viewportSize()?.width ?? 0) < 768) {
    expect(questionTypography.fontSize).toBe(30);
    expect(questionTypography.lineHeight / questionTypography.fontSize).toBe(
      1.4,
    );
  } else {
    expect((await progress.boundingBox())?.width).toBe(672);
    expect(questionTypography.fontSize).toBe(36);
    expect(questionTypography.lineHeight / questionTypography.fontSize).toBe(
      1.1,
    );
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
  ).toContainText("Întrebarea 2 din 7");
});

test("a tied pattern names the balanced directions in a compact result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  // The first three options represent the descriptive dimensions; the fourth
  // is the neutral option. The 3/3/0 split ties the strongest dimensions while
  // preserving one explicitly uncertain answer.
  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 3]);

  await expect(
    reflection.locator('[data-reflection-result="balanced"]'),
  ).toBeVisible();
  const completion = reflection.locator("[data-reflection-complete]");
  await expect(completion).toBeVisible();
  await expect(completion).toBeInViewport();
  await expect(completion).toHaveAttribute("role", "status");
  await expect(completion).toContainText("Reflecție finalizată");
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-name",
    "reflection-complete-mark",
  );
  await expect(completion.locator(":scope > svg")).toHaveCSS(
    "animation-duration",
    "0.22s",
  );
  await expect(reflection.locator("[data-reflection-result]")).toHaveClass(
    /ui-panel-enter/,
  );
  await expect(completion.getByRole("progressbar")).toHaveCount(0);
  await expect(reflection.getByRole("heading", { level: 2 })).toHaveText(
    "Semnalele corpului și stările emoționale au apărut la fel de des.",
  );
  expect(
    await reflection.locator("[data-reflection-result]").evaluate((result) => {
      const completionStatus = result.querySelector(
        "[data-reflection-complete]",
      );
      const resultContent = result.querySelector(
        "[data-reflection-result-content]",
      );

      return completionStatus?.nextElementSibling === resultContent;
    }),
  ).toBe(true);
  await expect(reflection).toContainText(
    /nu (?:este|reprezintă) un diagnostic/i,
  );

  const tally = reflection.locator("[data-reflection-distribution]");
  await expect(tally).toBeVisible();
  await expect(tally).toContainText("Distribuția alegerilor");
  await expect(tally.locator("dt")).toHaveCount(4);
  await expect(tally.locator("[data-reflection-frequency]")).toHaveCount(4);
  const tallyCounts = (
    await tally.locator("[data-reflection-count]").allTextContents()
  ).map((value) => Number.parseInt(value, 10));
  expect(tallyCounts).toEqual([3, 3, 0, 1]);
  const frequencyFills = await tally
    .locator('[data-reflection-dimension] [data-slot="progress-indicator"]')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).backgroundImage),
    );
  expect(frequencyFills.slice(0, 3).every((fill) => fill !== "none")).toBe(
    true,
  );
  expect(new Set(frequencyFills.slice(0, 3)).size).toBe(3);
  expect(frequencyFills[3]).toBe("none");
  await expect(tally.locator("svg")).toHaveCount(0);
  await expect(
    reflection.getByRole("heading", { name: "O întrebare de păstrat" }),
  ).toHaveCount(1);
  await expect(reflection).not.toContainText("O direcție apropiată");

  const resultContent = reflection.locator("[data-reflection-result-content]");
  const hasExpectedContentOrder = await resultContent.evaluate((content) => {
    const selectors = [
      "h2",
      "[data-reflection-distribution]",
      "[data-reflection-disclaimer]",
      "[data-reflection-prompt]",
      "[data-reflection-share]",
      "details",
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

  const visibleResultWords = await reflection
    .locator(
      "[data-reflection-complete], h2, [data-reflection-distribution], [data-reflection-disclaimer], [data-reflection-prompt]",
    )
    .allTextContents();
  expect(visibleResultWords.join(" ").trim().split(/\s+/).length).toBeLessThan(
    100,
  );

  await expect(reflection.getByRole("heading", { level: 2 })).toBeInViewport();
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
  expect((resultBox?.height ?? 0) / (viewport?.height ?? 1)).toBeLessThan(1.6);

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

  await expect(reflection.locator("fieldset")).toBeVisible();
  await expect(reflection.getByRole("radio").first()).not.toBeChecked();
  await expect(reflection.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "14",
  );
  await expect(reflection.locator("fieldset legend")).toBeFocused();
});

test("reduced motion removes movement from the completed reflection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 3]);

  const result = reflection.locator("[data-reflection-result]");
  const completionIcon = reflection.locator("[data-reflection-complete] > svg");
  const disclosure = reflection.getByText("Despre această reflecție și surse");
  const disclosureIcon = reflection.locator('[data-slot="disclosure-icon"]');

  await expect(result).toHaveCSS("animation-name", "none");
  await expect(completionIcon).toHaveCSS("animation-name", "none");
  await expect(disclosureIcon).toHaveCSS("transition-property", "none");
  await disclosure.click();
  await expect(disclosureIcon).toHaveCSS("transition-property", "none");
});

test("all uncertain answers produce a dedicated unclear result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [3, 3, 3, 3, 3, 3, 3]);

  await expect(
    reflection.locator('[data-reflection-result="unclear"]'),
  ).toBeVisible();
  await expect(reflection.getByRole("heading", { level: 2 })).toHaveText(
    "Răspunsurile nu conturează încă o direcție clară.",
  );
  await expect(reflection.locator("[data-reflection-count]")).toHaveText([
    "0 din 7",
    "0 din 7",
    "0 din 7",
    "7 din 7",
  ]);
  await expect(reflection.locator("[data-reflection-prompt]")).toContainText(
    "Ce observație mică ați vrea să păstrați din acest parcurs?",
  );
  await expect(
    reflection.locator("[data-reflection-disclaimer]"),
  ).not.toContainText("evaluarea medicală");
});

test("uncertainty tied with the strongest direction remains an unclear result", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 0, 0, 3, 3, 3, 1]);

  await expect(
    reflection.locator('[data-reflection-result="unclear"]'),
  ).toBeVisible();
  await expect(reflection.getByRole("heading", { level: 2 })).toHaveText(
    "Răspunsurile nu conturează încă o direcție clară.",
  );
  await expect(reflection.locator("[data-reflection-count]")).toHaveText([
    "3 din 7",
    "1 din 7",
    "0 din 7",
    "3 din 7",
  ]);
});

test("a near tie is folded into one direct result sentence", async ({
  page,
}) => {
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 0, 0, 1, 1, 2, 2]);

  await expect(
    reflection.locator('[data-reflection-result="body"]'),
  ).toBeVisible();
  await expect(reflection.getByRole("heading", { level: 2 })).toHaveText(
    "Semnalele corpului au apărut cel mai des, iar stările emoționale și tiparele relaționale aproape la fel de des.",
  );
  await expect(reflection).not.toContainText("O direcție apropiată");
  await expect(
    reflection.locator('[data-reflection-dimension="uncertain"]'),
  ).toHaveCount(0);
  await expect(
    reflection.locator("[data-reflection-disclaimer]"),
  ).toContainText("evaluarea medicală rămâne importantă");
});

test("native sharing receives only the compact result summary", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        (
          window as typeof window & {
            __reflectionSharePayload?: ShareData;
          }
        ).__reflectionSharePayload = data;
      },
    });
  });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 0, 1, 0, 1, 3]);
  await reflection.getByRole("button", { name: "Păstrați rezultatul" }).click();

  const payload = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __reflectionSharePayload?: ShareData;
        }
      ).__reflectionSharePayload,
  );
  expect(payload).toEqual(
    expect.objectContaining({
      title: "Reflecție ghidată — DespreSine",
      url: "https://despresine.ro/reflectie-ghidata/",
    }),
  );
  expect(payload?.text).toContain(
    "Semnalele corpului și stările emoționale au apărut la fel de des.",
  );
  expect(payload?.text).toContain("Corp și semnale fizice: 3 din 7");
  expect(payload?.text).toContain("Fără o potrivire clară: 1 din 7");
  expect(payload?.text).toContain("Nu este un diagnostic");
  expect(payload?.text).toContain(
    "Dacă vă preocupă simptome fizice, evaluarea medicală rămâne importantă.",
  );
  expect(payload?.text).not.toContain(
    "Prin somn, energie, tensiune sau alte senzații ale corpului",
  );
  const status = reflection.locator('[data-reflection-share-status="shared"]');
  await expect(status).toHaveAttribute("role", "status");
  await expect(status).toContainText(
    "Rezultatul a fost trimis către opțiunea aleasă.",
  );
});

test("cancelling native sharing is silent and does not copy the result", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (
      window as typeof window & {
        __reflectionClipboardCalled?: boolean;
      }
    ).__reflectionClipboardCalled = false;
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => {
        throw new DOMException("Sharing cancelled", "AbortError");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          (
            window as typeof window & {
              __reflectionClipboardCalled?: boolean;
            }
          ).__reflectionClipboardCalled = true;
        },
      },
    });
  });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0]);
  const shareButton = reflection.getByRole("button", {
    name: "Păstrați rezultatul",
  });
  await shareButton.click();

  await expect(shareButton).toBeEnabled();
  await expect(
    reflection.locator("[data-reflection-share-status]"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            __reflectionClipboardCalled?: boolean;
          }
        ).__reflectionClipboardCalled,
    ),
  ).toBe(false);
});

test("a text file is downloaded when sharing and copying are unavailable", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable");
        },
      },
    });
  });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [3, 3, 3, 3, 3, 3, 3]);
  const downloadPromise = page.waitForEvent("download");
  await reflection.getByRole("button", { name: "Păstrați rezultatul" }).click();
  const download = await downloadPromise;
  const downloadPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(downloadPath);
  const downloadedText = await readFile(downloadPath, "utf8");

  expect(download.suggestedFilename()).toBe("reflectie-ghidata-despresine.txt");
  expect(downloadedText).toContain(
    "Răspunsurile nu conturează încă o direcție clară.",
  );
  expect(downloadedText).toContain("Fără o potrivire clară: 7 din 7");
  expect(downloadedText).toContain("https://despresine.ro/reflectie-ghidata/");
  await expect(
    reflection.locator('[data-reflection-share-status="downloaded"]'),
  ).toContainText("Rezultatul a fost salvat ca fișier text.");
});

test("an unavailable local fallback leaves a clear recovery message", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable");
        },
      },
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: () => {
        throw new Error("Downloads unavailable");
      },
    });
  });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0]);
  const shareButton = reflection.getByRole("button", {
    name: "Păstrați rezultatul",
  });
  await shareButton.click();

  const status = reflection.locator('[data-reflection-share-status="error"]');
  await expect(status).toHaveAttribute("role", "status");
  await expect(status).toContainText(
    "Rezultatul nu a putut fi pregătit. Încercați din nou.",
  );
  await expect(shareButton).toBeEnabled();
});

test("the completion acknowledgement respects reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reflection = await openReflection(page);

  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0]);

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
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (
            window as typeof window & {
              __reflectionCopiedText?: string;
            }
          ).__reflectionCopiedText = text;
        },
      },
    });
  });
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
  await completeReflection(reflection, [0, 1, 2, 0, 1, 2, 0]);
  await reflection.getByRole("button", { name: "Păstrați rezultatul" }).click();

  const copiedText = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __reflectionCopiedText?: string;
        }
      ).__reflectionCopiedText,
  );
  expect(copiedText).toContain("Reflecție ghidată — DespreSine");
  expect(copiedText).toContain("https://despresine.ro/reflectie-ghidata/");
  expect(copiedText).not.toContain(
    "Prin somn, energie, tensiune sau alte senzații ale corpului",
  );
  await expect(
    reflection.locator('[data-reflection-share-status="copied"]'),
  ).toContainText("Rezultatul a fost copiat");

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
