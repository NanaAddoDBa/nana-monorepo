import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const monorepoRoot = path.resolve(appRoot, "../..");
const rootPackagePath = path.join(monorepoRoot, "package.json");
const inMonorepo = path.basename(path.dirname(appRoot)) === "apps" && existsSync(rootPackagePath);

test("root studio commands select apps/remix-of-ai-video-studio-landing-page", { skip: !inMonorepo }, () => {
  const scripts = JSON.parse(readFileSync(rootPackagePath, "utf8")).scripts;
  const prefix = "npm --prefix apps/remix-of-ai-video-studio-landing-page";
  for (const [name, command] of Object.entries({
    install: "ci",
    dev: "run dev",
    check: "run check",
    test: "test",
    lint: "run lint",
    build: "run build",
    preview: "run preview",
  })) {
    assert.equal(scripts[`${name}:studio`], `${prefix} ${command}`);
  }
  assert.equal(scripts["ci:studio"], "npm run check:studio && npm run lint:studio && npm run build:studio");
});

test("existing root portfolio commands remain unchanged", { skip: !inMonorepo }, () => {
  const pkg = JSON.parse(readFileSync(rootPackagePath, "utf8"));
  for (const [name, command] of Object.entries({
    install: "pnpm --dir apps/nana-portfolio install --frozen-lockfile",
    dev: "pnpm --dir apps/nana-portfolio dev",
    typecheck: "pnpm --dir apps/nana-portfolio typecheck",
    lint: "pnpm --dir apps/nana-portfolio lint",
    build: "pnpm --dir apps/nana-portfolio build",
    ci: "pnpm typecheck && pnpm lint && pnpm build",
  })) {
    assert.equal(pkg.scripts[name], command);
  }
  assert.equal(pkg.workspaces, undefined, "independent app dependency installs must remain isolated");
});