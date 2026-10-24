# Plan: Host the fleet's shared configs

## Technical context

- Prettier resolves a string `prettier` key in `package.json` as a module; ESLint's flat config imports by module name; TypeScript resolves `extends` through `node_modules` and the package's `exports`.
- A git dependency installs this repo's `dependencies`, never its `devDependencies`, so the ESLint config's imports are dependencies.
- typescript-eslint 8.72 supports TypeScript `>=4.8.4 <6.1.0` and ESLint 8 to 10; the fleet runs ESLint 9 and TypeScript 5 or 6.

## Design

1. Three files at the root, mapped by `exports`, shipped by `files`.
2. `test/consumer.test.js`: a throwaway directory whose `node_modules/@chrisgriffin/config` links to this repo, with a `package.json`, `eslint.config.js` and `tsconfig.json` that name the configs by package path, checked with Prettier's, ESLint's and tsc's own APIs.
3. The repo formats and lints itself with its own configs.

## Surfaces touched

- a new repo: CODEOWNERS and the stubs are in this diff; registering it with the fleet's agents happens outside this repo; the ruleset and the secrets are admin actions, recorded in the PR body.
- a published surface: README.
