// Each config is checked the way a repo uses it: from a throwaway consumer
// whose node_modules holds this repo under its package name, so the
// `exports` map is what resolves `@chrisgriffin/config/<name>`.
import { test, before, after } from "node:test"
import assert from "node:assert/strict"
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { spawnSync } from "node:child_process"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import * as prettier from "prettier"
import { ESLint } from "eslint"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
let dir

before(() => {
  dir = mkdtempSync(join(tmpdir(), "config-consumer-"))
  mkdirSync(join(dir, "node_modules", "@chrisgriffin"), { recursive: true })
  symlinkSync(ROOT, join(dir, "node_modules", "@chrisgriffin", "config"), "dir")
  const write = (name, text) => writeFileSync(join(dir, name), text)
  write(
    "package.json",
    JSON.stringify({
      type: "module",
      prettier: "@chrisgriffin/config/prettier",
    }),
  )
  write(
    "eslint.config.js",
    'import base from "@chrisgriffin/config/eslint"\n\nexport default [...base]\n',
  )
  write("a.ts", "const unused: number = 1\nexport const cwd = process.cwd()\n")
  write("b.js", "const unused = 1\nexport const home = process.env.HOME\n")
  write(
    "tsconfig.json",
    JSON.stringify({
      extends: "@chrisgriffin/config/tsconfig.json",
      compilerOptions: {
        noEmit: true,
        module: "NodeNext",
        moduleResolution: "NodeNext",
      },
      files: ["c.ts"],
    }),
  )
  write("c.ts", "export function id(x) {\n  return x\n}\n")
})

after(() => rmSync(dir, { recursive: true, force: true }))

test("prettier: the fleet style, no semicolons and no parens on a lone arrow parameter", async () => {
  const options = await prettier.resolveConfig(join(dir, "a.js"))
  assert.deepEqual(options, { arrowParens: "avoid", semi: false })
  const out = await prettier.format("const f = (x) => x;\n", {
    ...options,
    parser: "babel",
  })
  assert.equal(out, "const f = x => x\n")
})

test("eslint: recommended rules on JS and TS, typescript-eslint on TS only, Node globals", async () => {
  const results = await new ESLint({ cwd: dir }).lintFiles(["a.ts", "b.js"])
  const rules = Object.fromEntries(
    results.map(r => [
      r.filePath.split("/").pop(),
      r.messages.map(m => m.ruleId),
    ]),
  )
  assert.deepEqual(rules["a.ts"], ["@typescript-eslint/no-unused-vars"])
  assert.deepEqual(rules["b.js"], ["no-unused-vars"])
})

test("tsconfig: extending it turns on strict type checking", () => {
  const tsc = join(ROOT, "node_modules", "typescript", "bin", "tsc")
  const shown = spawnSync(process.execPath, [tsc, "-p", dir, "--showConfig"], {
    encoding: "utf8",
  })
  assert.equal(JSON.parse(shown.stdout).compilerOptions.strict, true)
  const run = spawnSync(process.execPath, [tsc, "-p", dir], {
    encoding: "utf8",
  })
  assert.notEqual(run.status, 0)
  assert.match(run.stdout, /c\.ts\(1,\d+\): error TS7006/)
})
