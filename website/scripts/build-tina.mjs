import { spawnSync } from "node:child_process";

const hasTinaCloudCredentials = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN,
);
const requiresTinaCloud =
  process.env.CF_PAGES === "1" || process.env.TINA_REQUIRE_CLOUD === "1";

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

const result = spawnSync("pnpm", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
