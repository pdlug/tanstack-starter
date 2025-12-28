import { describe, expect, test } from "vitest";

import { normalizeRedirectTo } from "@/utils";

describe("normalizeRedirectTo", function () {
  test("returns normalized internal paths", function () {
    expect(normalizeRedirectTo("/home?tab=1#top")).toBe("/home?tab=1#top");
  });

  test("rejects absolute or protocol-relative urls", function () {
    expect(normalizeRedirectTo("https://example.com")).toBeUndefined();
    expect(normalizeRedirectTo("//example.com")).toBeUndefined();
    expect(normalizeRedirectTo("javascript:alert(1)")).toBeUndefined();
  });
});
