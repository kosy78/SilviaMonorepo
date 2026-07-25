import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedDirectories = ["dist", "public/admin", "tina/__generated__"];

for (const directory of generatedDirectories) {
  rmSync(resolve(websiteRoot, directory), { recursive: true, force: true });
}

const hasTinaCloudCredentials = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN,
);
const requiresTinaCloud =
  process.env.CF_PAGES === "1" || process.env.TINA_REQUIRE_CLOUD === "1";
const skipsTinaCloudChecks = process.env.TINA_SKIP_CLOUD_CHECKS === "1";

if (!hasTinaCloudCredentials && requiresTinaCloud) {
  console.error(
    [
      "TinaCMS production build requires TinaCloud credentials.",
      "Set NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN in Cloudflare Pages.",
    ].join("\n"),
  );
  process.exit(1);
}

const args = ["exec", "tinacms", "build", "--noTelemetry"];

if (!hasTinaCloudCredentials) {
  args.push("--local", "--skip-cloud-checks");
}

if (hasTinaCloudCredentials && skipsTinaCloudChecks) {
  args.push("--skip-cloud-checks");
}

const tinaBuildEnv = { ...process.env };

if (!tinaBuildEnv.NODE_OPTIONS?.includes("--max-old-space-size")) {
  tinaBuildEnv.NODE_OPTIONS = [
    tinaBuildEnv.NODE_OPTIONS,
    "--max-old-space-size=4096",
  ]
    .filter(Boolean)
    .join(" ");
}

const result = spawnSync("pnpm", args, {
  env: tinaBuildEnv,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
