// The lockfile is what `npm ci` installs, here and in CI, so a vulnerable
// transitive copy there is a vulnerable install, whatever package.json allows.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const lock = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
)

// GHSA-g3hv-75wg-m249 covers minimatch >= 7.0.0, < 11.0.1. The prerelease and
// build suffixes are stripped before comparing, and a prerelease of 11.0.1
// sorts before 11.0.1, so it is inside. A version that does not parse cannot
// be shown safe, so it throws rather than passing as "not in range".
const inAdvisory = version => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(-[^+]*)?(\+.*)?$/.exec(
    String(version).trim(),
  )
  if (!match) throw new Error(`unparseable minimatch version: ${version}`)
  const [major, minor, patch] = match.slice(1, 4).map(Number)
  const prerelease = match[4] !== undefined
  if (major >= 7 && major <= 10) return true
  if (major !== 11 || minor !== 0) return false
  return patch < 1 || (patch === 1 && prerelease)
}

test("inAdvisory reads the range, prereleases and build metadata", () => {
  for (const v of [
    "7.0.0",
    "10.2.6",
    "11.0.0",
    "11.0.0-beta.1",
    "11.0.1-rc.0",
    "10.2.6+build.5",
    "v9.0.0",
  ]) {
    assert.equal(inAdvisory(v), true, `${v} should be inside`)
  }
  for (const v of [
    "3.1.5",
    "6.2.0",
    "11.0.1",
    "11.0.8",
    "11.1.0-rc.0",
    "11.0.1+build.1",
    "12.0.0",
  ]) {
    assert.equal(inAdvisory(v), false, `${v} should be outside`)
  }
  for (const v of [undefined, "", "latest", "11.0", "11.0.x"]) {
    assert.throws(() => inAdvisory(v), /unparseable/, `${v} should throw`)
  }
})

test("#12 no minimatch in package-lock.json falls inside GHSA-g3hv-75wg-m249", () => {
  const copies = Object.entries(lock.packages).filter(([path]) =>
    path.endsWith("node_modules/minimatch"),
  )
  // A `link: true` entry carries no version: the copy it points at is its
  // own entry, checked there. Any other entry without one is a lockfile this
  // test cannot read, so it fails naming the path instead of throwing.
  const unversioned = copies
    .filter(([, pkg]) => !pkg.link && typeof pkg.version !== "string")
    .map(([path]) => path)
  assert.deepEqual(unversioned, [], "minimatch entries with no version")
  const hits = copies
    .filter(([, pkg]) => !pkg.link && inAdvisory(pkg.version))
    .map(([path, pkg]) => `${path}@${pkg.version}`)
  assert.deepEqual(hits, [])
})
