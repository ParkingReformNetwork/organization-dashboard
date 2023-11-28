import fs from "fs/promises";

import { expect, test } from "@playwright/test";

import linkedin from "../src/linkedin";
import { createCountPoint } from "../src/utils";

test("parseCitiesJson", async () => {
  const raw = await fs.readFile("tests/mocks/linkedin.html", "utf8");
  const result = linkedin.parseHtml(raw);
  expect(result).toEqual(createCountPoint("linkedin-followers-count", 746));
});
