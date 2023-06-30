import fs from "fs/promises";

import { expect, test } from "@playwright/test";

import mapProjects from "../src/mapProjects";
import { createCountPoint } from "../src/utils";

test("parsing maps", async () => {
  const mandates = await fs.readFile("tests/mocks/mandates-map.csv", "utf8");
  const parkingRaw = await fs.readFile(
    "tests/mocks/parking-lot-map.json",
    "utf8"
  );
  const parking = JSON.parse(parkingRaw);

  const result = mapProjects.parsePoints(mandates, parking);
  expect(result).toEqual([
    createCountPoint("mandates-map-entries", 1552),
    createCountPoint("parking-lot-map-entries", 52),
  ]);
});
