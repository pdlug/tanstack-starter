import { describe, expect, test } from "vitest";

import { formatFormErrors } from "@/utils";

describe("formatFormErrors", function () {
  test("returns an empty string for no errors", function () {
    expect(formatFormErrors([])).toBe("");
  });

  test("formats mixed error shapes into a readable string", function () {
    const errors: readonly unknown[] = [
      "Required",
      { message: "Invalid format" },
      { message: 42 },
      123,
    ];

    expect(formatFormErrors(errors)).toBe(
      "Required, Invalid format, 42, An error occurred",
    );
  });
});
