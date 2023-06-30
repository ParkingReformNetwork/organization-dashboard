import { expect, test } from "@playwright/test";

import { runProcess } from "../src/utils";

test.describe("runProcess", () => {
  test("captures stdout", async () => {
    const [stdout, stderr] = await runProcess("echo 'hello world'");
    expect(stdout).toEqual("hello world\n");
    expect(stderr).toEqual("");
  });

  test("captures stderr", async () => {
    const [stdout, stderr] = await runProcess("echo 'hello world' 1>&2");
    expect(stdout).toEqual("");
    expect(stderr).toEqual("hello world\n");
  });

  test("errors on failures", async () => {
    try {
      await runProcess("fake-process");
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
