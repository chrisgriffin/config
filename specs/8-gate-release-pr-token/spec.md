# Spec: The gate stub passes RELEASE_PR_TOKEN so the gate can resolve a review thread

**Issue**: [#8](https://github.com/chrisgriffin/config/issues/8)

## Overview

This repo's `evaluator-gate.yml` stub passes its secrets by name. The gate replies on each inline finding thread with Autofix's answer and resolves the thread when every finding was fixed (ops#1919); only a user token may resolve a thread (ops#1914), so the reusable passes `TARGET_TOKEN || RELEASE_PR_TOKEN` to the gate for it (chrisgriffin/workflows#39). One line in the stub.

## Success criteria

- [x] The stub passes `TARGET_TOKEN: ${{ secrets.RELEASE_PR_TOKEN }}` beside its other named secrets: `TARGET_TOKEN` is the name the reusable at `v1` already declares, and a secret the callee does not declare fails the run at parse time (`startup_failure`). Corrected after the Evaluator's round-0 verdict on PR #9: the value is not unused at `v1`, whose reusable reads `ops-token: ${{ secrets.OPS_GH_TOKEN || secrets.TARGET_TOKEN }}`, so it is also the fallback for checking out ops when `OPS_GH_TOKEN` is empty; the stub's comment says so, and the by-name `RELEASE_PR_TOKEN` pass waits for chrisgriffin/workflows#40 to reach `v1`.
- [x] **Runnable:** `grep -cF "TARGET_TOKEN: \${{ secrets.RELEASE_PR_TOKEN }}" .github/workflows/evaluator-gate.yml` prints `1` (prints `0` on `develop`).

## Needs from Chris

none
