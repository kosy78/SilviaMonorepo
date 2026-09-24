import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execute = promisify(execFile);
const website = fileURLToPath(new URL("../../", import.meta.url));
const title = "Verificare Markdown: ă, â, î, ș, ț";
const description = "Conținut tehnic temporar pentru verificarea publicării.";
const publishedSlug = "test-publicare-markdown";
const drafts = ["test-ciorna-explicita", "test-ciorna-implicita"];
const canonical = `https://despresine.ro/blog/${publishedSlug}/`;

function article(slug, draft) {
  return `---
title: "${slug === publishedSlug ? title : slug}"
description: "${description}"
publishedAt: 2026-09-20T00:00:00.000Z
updatedAt: 2026-09-21T00:00:00.000Z
${draft === undefined ? "" : `draft: ${draft}\n`}author: Silvia Dinu
---

## Verificare de formatare

Diacritice: ă, â, î, ș, ț. **Text îngroșat** și *text cursiv*.

[Legătură de test](/blog/)
`;
}

test("Markdown publishing uses the real article template and keeps drafts private", async () => {
  await assert.rejects(
    readdir(join(website, "public/admin")),
    { code: "ENOENT" },
    "Remove legacy Tina output from public/admin before building",
  );
  const temporary = await mkdtemp(join(tmpdir(), "despresine-blog-test-"));
  try {
    // Copy only build inputs, never .env files. Fixtures and output stay outside
    // the real source tree and production dist, even when an assertion fails.
    for (const input of [
      "src",
      "public",
      "astro.config.mjs",
      "tsconfig.json",
      "package.json",
    ]) {
      await cp(join(website, input), join(temporary, input), {
        recursive: true,
      });
    }
    // Exercise the production blog routes and their real layouts/components.
    // The normal build and browser suite cover the other routes and images.
    await rm(join(temporary, "src/pages"), { recursive: true });
    await cp(
      join(website, "src/pages/blog"),
      join(temporary, "src/pages/blog"),
      {
        recursive: true,
      },
    );
    await symlink(
      join(website, "node_modules"),
      join(temporary, "node_modules"),
      "dir",
    );
    // Astro otherwise puts its cache inside the linked node_modules directory.
    await writeFile(
      join(temporary, "astro.test.config.mjs"),
      `import config from "./astro.config.mjs";
export default {
  ...config,
  cacheDir: "./.astro-cache",
  vite: { ...config.vite, cacheDir: "./.vite-cache" },
};
`,
    );

    for (const [slug, draft] of [
      [publishedSlug, false],
      [drafts[0], true],
      [drafts[1], undefined],
    ]) {
      await writeFile(
        join(temporary, "src/content/blog", `${slug}.md`),
        article(slug, draft),
      );
    }

    const astroPackagePath = fileURLToPath(
      import.meta.resolve("astro/package.json"),
    );
    const astroPackage = JSON.parse(await readFile(astroPackagePath, "utf8"));
    try {
      await execute(
        process.execPath,
        [
          join(dirname(astroPackagePath), astroPackage.bin.astro),
          "build",
          "--config",
          "astro.test.config.mjs",
        ],
        {
          cwd: temporary,
          env: {
            PATH: process.env.PATH,
            ASTRO_TELEMETRY_DISABLED: "1",
            NODE_ENV: "production",
          },
          timeout: 180_000,
          maxBuffer: 10 * 1024 * 1024,
        },
      );
    } catch (error) {
      throw new Error(
        `Isolated blog build failed:\n${error.stdout ?? ""}\n${error.stderr ?? ""}`,
        { cause: error },
      );
    }

    const output = join(temporary, "dist");
    const html = await readFile(
      join(output, "blog", publishedSlug, "index.html"),
      "utf8",
    );
    const listing = await readFile(join(output, "blog/index.html"), "utf8");
    const sitemapFiles = (await readdir(output)).filter((name) =>
      /^sitemap.*\.xml$/.test(name),
    );
    assert.ok(sitemapFiles.length > 0, "Build must emit a sitemap");
    const sitemap = (
      await Promise.all(
        sitemapFiles.map((name) => readFile(join(output, name), "utf8")),
      )
    ).join("\n");

    for (const expected of [
      `<title>${title} | DespreSine</title>`,
      `rel="canonical" href="${canonical}"`,
      `name="description" content="${description}"`,
      'property="og:type" content="article"',
      'property="article:author" content="Silvia Dinu"',
      'property="article:published_time" content="2026-09-20T00:00:00.000Z"',
      'property="article:modified_time" content="2026-09-21T00:00:00.000Z"',
      'datetime="2026-09-20T00:00:00.000Z"',
      "20 septembrie 2026",
      "Actualizat la 21 septembrie 2026",
      "Diacritice: ă, â, î, ș, ț.",
      "<strong>Text îngroșat</strong>",
      "<em>text cursiv</em>",
      '<a href="/blog/">Legătură de test</a>',
    ]) {
      assert.ok(
        html.includes(expected),
        `Published article must contain: ${expected}`,
      );
    }
    assert.match(
      html,
      /<h1\b[^>]*>\s*Verificare Markdown: ă, â, î, ș, ț\s*<\/h1>/,
    );
    assert.ok(listing.includes(`href="/blog/${publishedSlug}/"`));
    assert.ok(listing.includes(title));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));

    for (const slug of drafts) {
      assert.ok(
        !listing.includes(slug),
        `${slug} must stay out of the listing`,
      );
      assert.ok(
        !sitemap.includes(slug),
        `${slug} must stay out of the sitemap`,
      );
      await assert.rejects(readdir(join(output, "blog", slug)), {
        code: "ENOENT",
      });
    }
    await assert.rejects(readdir(join(output, "admin")), { code: "ENOENT" });
    console.log(
      "Blog verification passed: Markdown rendering, metadata, listing, sitemap, hidden drafts, and no admin output.",
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
