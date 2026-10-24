import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const appName = "remix-of-ai-video-studio-landing-page";

test("monorepo commands execute inside apps/remix-of-ai-video-studio-landing-page", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "studio-paths-"));
  try {
    const appRoot = path.join(fixture, "apps", appName);
    cpSync(path.join(root, "Makefile"), path.join(appRoot, "Makefile"), { recursive: true });
    writeFileSync(path.join(fixture, "Makefile"), `APP_DIR := apps/${appName}\ninclude $(APP_DIR)/Makefile\n`);
    for (const [target, commands] of Object.entries({
      install: ["npm ci --no-audit --no-fund"],
      ci: ["npm run check", "npm run build"],
      build: ["npm run build"],
      test: ["npm test"],
      dev: ["npm run dev"],
      preview: ["npm run preview"],
    })) {
      const output = execFileSync("make", ["--no-print-directory", "--dry-run", target], { cwd: fixture, encoding: "utf8" });
      for (const command of commands) {
        assert.ok(output.includes(`cd "${appRoot}/" && ${command}`), `${target} must run in the app, not the monorepo root`);
      }
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("all app-local imports and imported assets resolve within the app root", () => {
  function visit(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(directory, entry.name);
      return entry.isDirectory() ? visit(full) : /\.[cm]?[jt]sx?$/.test(full) ? [full] : [];
    });
  }
  let checked = 0;
  for (const file of visit(path.join(root, "src"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith(".") && !specifier.startsWith("@/")) continue;
      const resolved = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : path.resolve(path.dirname(file), specifier);
      assert.ok(resolved.startsWith(root), `${file}: ${specifier} must not escape the app`);
      assert.ok(["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"].some((suffix) => existsSync(resolved + suffix)), `${file}: unresolved ${specifier}`);
      checked += 1;
    }
  }
  assert.ok(checked > 0, "must inspect actual local imports");
});

test("npm clean install uses a lockfile matching every declared dependency", () => {
  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const lock = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"));
  for (const category of ["dependencies", "devDependencies"]) {
    for (const [name, version] of Object.entries(pkg[category] ?? {})) {
      assert.equal(lock.packages[""][category]?.[name], version, `lockfile mismatch: ${name}`);
      assert.ok(lock.packages[`node_modules/${name}`], `missing locked package: ${name}`);
    }
  }
});

test("the monorepo can discover this app and its lockfile", () => {
  const config = JSON.parse(readFileSync(path.join(root, "pipeline.json"), "utf8"));
  assert.equal(config.name, appName);
  assert.equal(config.package_manager, "npm");
  assert.ok(existsSync(path.join(root, config.lockfile)));
  assert.ok(existsSync(path.join(root, "Makefile")));
});