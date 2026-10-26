# Spec: Ignore the operator's laid trees in Prettier

## Overview

`npm run verify` starts with `prettier --check .`, which in a shift checkout also checks `.agents/` and `.specify/`: trees the operator lays at runtime and this repo never tracks. The gate goes red on 26–27 files that are not ours. A `.prettierignore` listing both trees, the fleet's existing pattern, makes the gate judge only this repo's own files. Fixes #4.

## User scenarios

- A shift runs `npm run verify` in a checkout with `.agents/` and `.specify/` laid and gets a gate result about this repo's own files.
- A contributor without the laid trees sees no change at all.

## Functional requirements

- FR-1: A `.prettierignore` at the repo root lists `.agents/` and `.specify/`.
- FR-2: Each entry carries a one-line comment naming what lays the tree and why it is not this repo's to format.
- FR-3: No tracked file is reformatted; the published `files` are unchanged.

## Success criteria

- [ ] A `.prettierignore` exists at the repo root listing `.agents/` and `.specify/`, each with a one-line comment saying what drops it there and why it is not ours to format.
- [ ] `npm run verify` exits 0 in a checkout that has both trees laid.
- [ ] No tracked file changes shape — the formatting of the repo's own files is untouched.
- [ ] **Runnable:** `npm run verify` → exit `0` with `.agents/` and `.specify/` present. Red today: the same command exits non-zero on `prettier --check .` with the 27 warnings above.

## Needs from Chris

none
