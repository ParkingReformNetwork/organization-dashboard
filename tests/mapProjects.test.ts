import fs from "fs/promises";

import { expect, test } from "@playwright/test";

import mapProjects from "../src/mapProjects";
import { createCountPoint } from "../src/utils";

test("parseCitiesJson", async () => {
  const raw = await fs.readFile("tests/mocks/parking-lot-map.json", "utf8");
  const parsed = JSON.parse(raw);
  const result = mapProjects.parseCitiesJson(parsed);
  expect(result).toEqual(createCountPoint("parking-lot-map-entries", 52));
});

test("parseMandatesCsv", async () => {
  const csv = await fs.readFile("tests/mocks/reform-map.csv", "utf8");
  const result = mapProjects.parseReformCsv(csv);
  expect(result).toEqual(createCountPoint("reform-map-entries", 1552));
});
