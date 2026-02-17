import { describe, expect, test } from "vitest";

import { shouldSkipSessionLookup } from "@/lib/auth/middleware";

describe("shouldSkipSessionLookup", function () {
  test("skips auth endpoint requests", function () {
    expect(shouldSkipSessionLookup("/api/auth")).toBe(true);
    expect(shouldSkipSessionLookup("/api/auth/sign-in")).toBe(true);
  });

  test("skips static asset-like paths", function () {
    expect(shouldSkipSessionLookup("/assets/main.js")).toBe(true);
    expect(shouldSkipSessionLookup("/icons/favicon.svg")).toBe(true);
    expect(shouldSkipSessionLookup("/favicon.ico")).toBe(true);
  });

  test("does not skip application routes", function () {
    expect(shouldSkipSessionLookup("/")).toBe(false);
    expect(shouldSkipSessionLookup("/sign-in")).toBe(false);
    expect(shouldSkipSessionLookup("/home")).toBe(false);
    expect(shouldSkipSessionLookup("/api/posts")).toBe(false);
  });
});
