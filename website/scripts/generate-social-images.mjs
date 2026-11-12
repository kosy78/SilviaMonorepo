// Renders the 1200×630 share images: one site default and one per published
// article. Run `pnpm social:images` after publishing or retitling an article and
// commit the output; the build only serves the files already in public/.
import { mkdir, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const website = fileURLToPath(new URL("../", import.meta.url));
const asset = (path) => new URL(`../${path}`, import.meta.url).href;
const outputDirectory = `${website}public/images/social`;

const mark = (
  await readFile(`${website}public/images/despresine-mark.svg`, "utf8")
)
  .replace('stroke="#ffffff"', 'stroke="currentColor"')
  .replace("<svg", '<svg class="mark"');

// Colours mirror --accent-foreground, --primary-foreground and --chart-1 in
// src/styles/global.css.
const styles = `
  @font-face { font-family: Avenir; font-weight: 400; src: url("${asset("public/fonts/avenir-400-normal.woff2")}") format("woff2"); }
  @font-face { font-family: Avenir; font-weight: 500; src: url("${asset("public/fonts/avenir-500-normal.woff2")}") format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    position: relative; overflow: hidden;
    background: oklch(0.305 0.05 125); color: oklch(0.985 0.006 83);
    font-family: Avenir, sans-serif; font-weight: 400;
    -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision;
  }
  .top {
    position: absolute; inset: 70px 80px auto;
    display: flex; justify-content: space-between; align-items: flex-start;
    font-size: 32px; line-height: 1.3;
  }
  .top p { text-align: right; color: oklch(0.88 0.03 125); }
  .mark { display: block; width: 76px; height: 76px; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 500; letter-spacing: 0.01em; }
  .brand .mark { width: 44px; height: 44px; }
  h1 { position: absolute; font-weight: 500; line-height: 1.04; text-wrap: balance; }
  .site h1 { left: 68px; bottom: 34px; font-size: 212px; letter-spacing: -0.045em; white-space: nowrap; }
  .article .top { align-items: center; }
  .article h1 { inset: auto 80px 76px; font-size: 96px; letter-spacing: -0.03em; }
`;

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sitePage = `<body class="site">
  <div class="top">${mark}<p>Psihoterapie psihanalitică și consiliere<br>Silvia Dinu. În București și online</p></div>
  <h1>DespreSine</h1>`;

const articlePage = (title) => `<body class="article">
  <div class="top"><div class="brand">${mark}<span>DespreSine</span></div><p>De Silvia Dinu</p></div>
  <h1>${escapeHtml(title)}</h1>`;

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1];
  return value?.trim().replace(/^(["'])(.*)\1$/, "$2");
}

async function publishedArticles() {
  const directory = `${website}src/content/blog`;
  const articles = [];
  for (const file of (await readdir(directory)).filter((name) =>
    name.endsWith(".md"),
  )) {
    const source = await readFile(`${directory}/${file}`, "utf8");
    if (frontmatterValue(source, "draft") !== "false") continue;
    articles.push({
      slug: file.replace(/\.md$/, ""),
      title:
        frontmatterValue(source, "seoTitle") ??
        frontmatterValue(source, "title"),
    });
  }
  return articles;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

async function render(body, path) {
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>${styles}</style>${body}`,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Long titles step down in size until they fit above the brand line.
    const title = document.querySelector(".article h1");
    for (
      let size = 96;
      title && title.offsetHeight > 330 && size > 60;
      size -= 4
    ) {
      title.style.fontSize = `${size - 4}px`;
    }
  });
  await page.screenshot({ path, type: "jpeg", quality: 90 });
  console.log(path.replace(website, ""));
}

await mkdir(`${outputDirectory}/blog`, { recursive: true });
await render(sitePage, `${outputDirectory}/despresine.jpg`);
for (const { slug, title } of await publishedArticles()) {
  await render(articlePage(title), `${outputDirectory}/blog/${slug}.jpg`);
}
await browser.close();
