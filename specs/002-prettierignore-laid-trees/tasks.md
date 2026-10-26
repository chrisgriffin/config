# Tasks: Ignore the operator's laid trees in Prettier

## Phase 1: Build

- [x] T001 Run `npm run verify` in a laid checkout and confirm it is red on `prettier --check .` (26 warnings, all under `.agents/` and `.specify/`)
- [x] T002 Add `.prettierignore` at the repo root listing `.agents/` and `.specify/`, each with a one-line comment
- [x] T003 Run `npm run verify` in the same laid checkout and confirm exit 0

## Phase 2: Surfaces

- [x] T004 Surfaces touched is `none` — confirm the diff is only `.prettierignore` and this spec folder, with no tracked file reformatted
