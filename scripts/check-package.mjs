import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporaryDirectory = mkdtempSync(join(tmpdir(), "arctic2-package-"));
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

try {
	const packOutput = execFileSync(
		npm,
		["pack", "--json", "--ignore-scripts", "--pack-destination", temporaryDirectory],
		{
			cwd: root,
			encoding: "utf8"
		}
	);
	const [{ filename }] = JSON.parse(packOutput);
	const consumerDirectory = join(temporaryDirectory, "consumer");
	mkdirSync(consumerDirectory);
	writeFileSync(join(consumerDirectory, "package.json"), '{"private":true,"type":"module"}\n');
	execFileSync(
		npm,
		["install", "--ignore-scripts", "--no-audit", "--no-fund", join(temporaryDirectory, filename)],
		{
			cwd: consumerDirectory,
			stdio: "inherit"
		}
	);

	const installedPackagePath = join(consumerDirectory, "node_modules", "arctic2");
	const installedPackage = JSON.parse(
		readFileSync(join(installedPackagePath, "package.json"), "utf8")
	);
	const arctic = await import(pathToFileURL(join(installedPackagePath, "dist", "index.js")));

	assert.equal(installedPackage.name, "arctic2");
	assert.equal(typeof arctic.GitHub, "function");
	assert.equal(typeof arctic.OAuth2Client, "function");
	assert.equal(typeof arctic.generateState, "function");
} finally {
	rmSync(temporaryDirectory, { force: true, recursive: true });
}
