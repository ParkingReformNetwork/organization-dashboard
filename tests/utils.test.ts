import { expect, test } from "@playwright/test";

import { runProcess, convertDateToTimeStampS } from "../src/utils";

test.describe("runProcess", () => {
  test("captures stdout", async () => {
    const [stdout, stderr] = await runProcess("echo", ["hello world"]);
    expect(stdout).toEqual("hello world\n");
    expect(stderr).toEqual("");
  });

  test("captures stderr", async () => {
    const [stdout, stderr] = await runProcess("node", [
      "-e",
      "console.error('hello world')",
    ]);
    expect(stdout).toEqual("");
    expect(stderr).toEqual("hello world\n");
  });

  test("errors on failures", async () => {
    try {
      await runProcess("fake-process", []);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});

test("convertDateToTimeStampS", () => {
  const result = convertDateToTimeStampS("1990-06-29");
  expect(result).toEqual(646617600);
});