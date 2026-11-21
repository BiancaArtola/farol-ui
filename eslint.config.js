import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "storybook-static"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Solo las dos reglas clásicas: el set completo de v7 apunta al React Compiler
      // y marca patrones válidos de esta librería (por ejemplo, enfocar un nodo en un efecto).
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      // Nombres descriptivos: `event`, no `e`. `i`, `x`/`y`, `id` (atributo HTML) y `cx` (helper de clases) se permiten.
      "id-length": [
        "error",
        {
          min: 3,
          properties: "never",
          exceptions: ["i", "x", "y", "_", "id", "cx"],
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description" },
      ],
      "max-lines": [
        "warn",
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "max-lines": [
        "warn",
        { max: 700, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: ["*.config.{js,ts}"],
    languageOptions: { globals: { ...globals.node } },
  },
);
