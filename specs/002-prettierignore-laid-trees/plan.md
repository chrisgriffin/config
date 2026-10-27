# Plan: Ignore the operator's laid trees in Prettier

## Technical context

- Prettier reads `.prettierignore` at the project root; it does not read `.gitignore` entries beyond its defaults, and this repo's `.gitignore` carries only `node_modules/`.
- `npm run verify` is `format:check && lint && node --test`; only `format:check` fails on the laid trees.

## Design

1. One new file, `.prettierignore`, with `.agents/` and `.specify/`, each under a one-line comment — the same two entries the fleet's other Prettier repos carry.
2. Nothing else: no tracked file is reformatted, `package.json`'s `files` is untouched, so the published package is unchanged.

## Surfaces touched

- none — `.prettierignore` is local tooling config: not a published surface (`files` ships only the three configs), not a workflow, job name or ruleset, not a directory added or a part's job changed, and no README or doc names how Prettier is scoped here.
