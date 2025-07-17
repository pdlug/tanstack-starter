// @ts-check

import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import functional from "eslint-plugin-functional";
import pluginRouter from "@tanstack/eslint-plugin-router";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
// import tailwind from "eslint-plugin-tailwindcss";
import vitest from "@vitest/eslint-plugin";

import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  configPrettier,
  unicorn.configs["flat/recommended"],
  functional.configs.externalTypeScriptRecommended,
  functional.configs.lite,
  functional.configs.stylistic,
  ...pluginRouter.configs["flat/recommended"],
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactRefresh.configs.recommended,
  // reactHooks.configs.recommended,
  // ...tailwind.configs["flat/recommended"],
  {
    ignores: [
      ".output/**",
      ".nitro/**",
      ".tanstack/**",
      ".wrangler/**",
      "dist/**",
      "eslint.config.mjs",
      "src/routeTree.gen.ts",
    ],
  },
  {
    // files: ["{src}/**/*.{js,jsx,ts,tsx}"],
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
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
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
      "react/react-in-jsx-scope": "off",
      "react/prefer-read-only-props": "error",
      "react/no-unescaped-entities": "off",
      "sort-imports": [
        "error",
        {
          allowSeparatedGroups: true,
          ignoreMemberSort: true,
        },
      ],
      // "tailwindcss/no-arbitrary-value": "error",
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
    },
  },
  {
    files: ["src/components/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "functional/immutable-data": "off",
    },
  },
  {
    files: ["src/routes/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/only-throw-error": "off",
      // Tanstack Router uses errors for notFound and other exceptions
      "functional/no-throw-statements": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["tests/**/*.{js,jsx,ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      configPrettier,
      tseslint.configs.strict,
      unicorn.configs["flat/recommended"],
      vitest.configs?.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
  },
);
