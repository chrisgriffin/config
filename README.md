# config

Shared Prettier, ESLint and TypeScript configs for the repos in this fleet.
Each repo installs this one as a git dependency pinned to the floating `v1`
tag and extends what it needs, so a style or rule is decided once, here.

## Install

```sh
npm install --save-dev github:chrisgriffin/config#v1
```

`v1` moves with every `1.x` release. The lockfile pins the commit, so a repo
picks up a new release with `npm update @chrisgriffin/config`.

## Prettier

In `package.json`:

```json
{ "prettier": "@chrisgriffin/config/prettier" }
```

No semicolons, and no parentheses around a lone arrow-function parameter.
Everything else is Prettier's default.

## ESLint

In `eslint.config.mjs`, spread the base first and add the repo's own files,
globals and rules after it:

```js
import base from "@chrisgriffin/config/eslint"
import globals from "globals"

export default [
  ...base,
  { files: ["app/**"], languageOptions: { globals: globals.browser } },
]
```

The base is ESLint's recommended rules on every file, typescript-eslint's
recommended rules on TypeScript files, and Node globals. It needs ESLint 9,
and TypeScript 5.0 to 6.0 in a repo with TypeScript files.

## TypeScript

In `tsconfig.json`, extend the base and set what is the repo's own: `module`,
`moduleResolution`, `lib`, `jsx`, `include`, and whether it emits.

```json
{
  "extends": "@chrisgriffin/config/tsconfig.json",
  "compilerOptions": { "module": "NodeNext", "moduleResolution": "NodeNext" },
  "include": ["src"]
}
```

The base turns on `strict` and `isolatedModules`, targets ES2022, and sets
the interop options every repo here already used.

## Changing a config

A change here reaches every repo on its next update, so a stricter rule is a
change to all of them. `npm run verify` checks each config from a throwaway
consumer, the way a repo resolves it.
