// @ts-check

import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import functional from "eslint-plugin-functional";
import pluginRouter from "@tanstack/eslint-plugin-router";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import vitest from "@vitest/eslint-plugin";

import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  configPrettier,
  unicorn.configs["recommended"],
  functional.configs.externalTypeScriptRecommended,
  functional.configs.lite,
  functional.configs.stylistic,
  ...pluginRouter.configs["flat/recommended"],

  {
    ignores: [
      ".output/**",
      ".nitro/**",
      ".tanstack/**",
      ".wrangler/**",
      "dist/**",
      "eslint.config.mjs",
      "src/routeTree.gen.ts",
      "worker-configuration.d.ts",
    ],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
  },
  {
    rules: {
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "functional/functional-parameters": "off",
      "functional/no-mixed-types": "off",
      "functional/no-return-void": "off",
      "functional/prefer-tacit": "off",
      "functional/immutable-data": [
        "error",
        {
          ignoreIdentifierPattern: "displayName",
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "warn",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            Db: true,
            Dir: true,
            Env: true,
            Param: true,
            Params: true,
            Props: true,
            Ref: true,
            acc: true,
            args: true,
            db: true,
            dir: true,
            e2e: true,
            env: true,
            fn: true,
            num: true,
            params: true,
            props: true,
            ref: true,
          },
        },
      ],
      "@typescript-eslint/unified-signatures": "error",
    },
  },
  {
    files: ["src/components/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "functional/immutable-data": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["src/routes/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/only-throw-error": "off",
      // TanStack Router uses errors for notFound and other exceptions
      "functional/no-throw-statements": "off",
      // TanStack Start routes export Route config alongside local component functions
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: [
      "src/lib/auth/**/*.ts",
      "src/lib/middleware.ts",
      "src/routes/api/auth/$.ts",
    ],
    rules: {
      // Cloudflare Env type is mutable; middleware context requires unsafe assignment
      "@typescript-eslint/no-unsafe-assignment": "off",
      "functional/prefer-immutable-types": "off",
    },
  },
  {
    files: ["tests/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      vitest,
    },
    rules: {
      ...tseslint.configs.strict.rules,
      ...unicorn.configs["recommended"].rules,
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
  },
);
