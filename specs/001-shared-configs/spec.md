# Spec: Host the fleet's shared Prettier, ESLint and TypeScript configs

## Overview

Each repo in the fleet writes its own formatter, linter and compiler config, and they have drifted. This repo holds one of each, which a repo installs as `github:chrisgriffin/config#v1` and extends. Fixes #1.

## User scenarios

- A repo points Prettier at `@chrisgriffin/config/prettier` and formats in the fleet style.
- A repo spreads `@chrisgriffin/config/eslint` first in its flat config and layers its own globals and rules after it.
- A TypeScript repo extends `@chrisgriffin/config/tsconfig.json` and sets only its module system, libs and includes.

## Functional requirements

- FR-1: `exports` maps `./prettier`, `./eslint` and `./tsconfig.json`; `files` ships only those three.
- FR-2: Prettier: `semi: false`, `arrowParens: "avoid"`, the style three of the four Prettier repos already use.
- FR-3: ESLint: `js.configs.recommended`, `typescript-eslint` recommended scoped to TypeScript files, Node globals, ESM.
- FR-4: tsconfig: `strict`, `isolatedModules`, `target: ES2022`, `esModuleInterop`, `resolveJsonModule`, `forceConsistentCasingInFileNames`, `skipLibCheck`.
- FR-5: The plugins the ESLint config imports are dependencies; ESLint, Prettier and TypeScript are peers, ESLint and TypeScript optional.
- FR-6: Bootstrap: CODEOWNERS, the fleet's stubs at `chrisgriffin/workflows@v1`, a release that moves a floating `v1` tag.

## Success criteria

- [ ] A repo that installs this one can point Prettier at `@chrisgriffin/config/prettier` and gets the fleet style: no semicolons, and no parentheses around a lone arrow-function parameter.
- [ ] A repo can spread `@chrisgriffin/config/eslint` into its `eslint.config.mjs` and gets ESLint's recommended rules on JavaScript, typescript-eslint's recommended rules on TypeScript, and Node globals.
- [ ] A TypeScript repo can set `"extends": "@chrisgriffin/config/tsconfig.json"` and gets strict type checking without restating it.
- [ ] The repo is bootstrapped as a fleet repo: CODEOWNERS, the standard workflow stubs, and a release flow that moves a floating `v1` tag.
- [ ] **Runnable:** `npm run verify` passes, and its tests install this repo into a throwaway consumer and check each of the three configs from there. On `develop` there are no such tests.

## Needs from Chris

none
