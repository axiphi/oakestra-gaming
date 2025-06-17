import { includeIgnoreFile } from "@eslint/compat";
import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "typescript-eslint";

export default [
  includeIgnoreFile(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".gitignore"),
  ),
  { files: ["**/*.{tsx,ts}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  eslintJs.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  ...eslintPluginTailwindcss.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_[^_].*$|^_$",
          varsIgnorePattern: "^_[^_].*$|^_$",
          caughtErrorsIgnorePattern: "^_[^_].*$|^_$",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
];
