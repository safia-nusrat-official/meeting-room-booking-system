// @ts-check

import eslint from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            "no-console": "warn",
            "@typescript-eslint/no-unused-vars": "error",
        },
    },
]
