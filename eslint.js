import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

const TS = ["**/*.{ts,tsx,mts,cts}"]

// The fleet's base: ESLint's recommended rules everywhere, typescript-eslint's
// on TypeScript files only, and Node globals. A repo spreads this first, then
// adds its own files, globals (the browser, a test runner) and rules after it.
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({ ...config, files: TS })),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
]
