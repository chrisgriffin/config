// The lockfile is what `npm ci` installs, here and in CI, so a vulnerable
// transitive copy there is a vulnerable install, whatever package.json allows.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const lock = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
)

// GHSA-g3hv-75wg-m249 covers minimatch >= 7.0.0, < 11.0.1.
const inAdvisory = version => {
  const [major, minor, patch] = version.split(".").map(Number)
  if (major >= 7 && major <= 10) return true
  return major === 11 && minor === 0 && patch < 1
}

test("#12 no minimatch in package-lock.json falls inside GHSA-g3hv-75wg-m249", () => {
  const hits = Object.entries(lock.packages)
    .filter(
      ([path, pkg]) =>
        path.endsWith("node_modules/minimatch") && inAdvisory(pkg.version),
    )
    .map(([path, pkg]) => `${path}@${pkg.version}`)
  assert.deepEqual(hits, [])
})
