/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop  */
import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import Papa from "papaparse";
import fs from "fs/promises";

import { createCountPoint, runProcess, convertDateToTimeStampS } from "./utils";

const MANDATES_CSV =
  "https://raw.githubusercontent.com/ParkingReformNetwork/mandates-map/main/map/trimmed_map_data.csv";
const CITIES_JSON =
  "https://raw.githubusercontent.com/ParkingReformNetwork/parking-lot-map/main/data/score-cards.json";

const parseMandatesCsv = (csv: string, timestamp?: number): Point => {
  const parsed = Papa.parse(csv, { header: true });
  return createCountPoint(
    "mandates-map-entries",
    parsed.data.length,
    timestamp
  );
};

const parseCitiesJson = (jsonData: Record<string, unknown>): Point =>
  createCountPoint("parking-lot-map-entries", Object.keys(jsonData).length);

const getCurrentPoints = async (): Promise<Point[]> => {
  const [mandatesResponse, cities] = await Promise.all([
    axios.get(MANDATES_CSV, { responseType: "text" }),
    axios.get(CITIES_JSON, { responseType: "json" }),
  ]);
  return [
    parseMandatesCsv(mandatesResponse.data),
    parseCitiesJson(cities.data),
  ];
};

const getMandatesCountForCommit = async (
  commit: string,
  date: string
): Promise<Point> => {
  await runProcess("git", ["checkout", commit], { cwd: "../mandates-map" });
  const fileName =
    commit === "68bf32e"
      ? "initial_tidied_map_data.csv"
      : "tidied_map_data.csv";
  const mandates = await fs.readFile(`../mandates-map/map/${fileName}`, "utf8");
  return parseMandatesCsv(mandates, convertDateToTimeStampS(date));
};

const getHistoricalPoints = async (): Promise<Point[]> => {
  const repositoryPath = "../mandates-map";
  try {
    const stats = await fs.stat(repositoryPath);
    if (!stats.isDirectory()) {
      throw new Error(
        `The repository path "${repositoryPath}" is not a directory. Please provide a valid directory path.`
      );
    }
  } catch (error) {
    throw new Error(
      `The repository folder does not exist at "${repositoryPath}". Please make sure the directory exists.`
    );
  }
  await runProcess("git", ["checkout", "main"], { cwd: "../mandates-map" });
  const [stdout] = await runProcess(
    "git",
    [
      "log",
      "--pretty=format:'%h %ad'",
      "--date=short",
      "map/tidied_map_data.csv",
    ],
    { cwd: "../mandates-map" }
  );
  const commitDatePairs = stdout
    .split("\n")
    .map((line) => line.replace(/'/g, "").split(" "));

  const result = [];
  for (const [commit, date] of commitDatePairs) {
    const point = await getMandatesCountForCommit(commit, date);
    result.push(point);
  }
  return result;
};

export default {
  getCurrentPoints,
  getHistoricalPoints,
  parseCitiesJson,
  parseMandatesCsv,
};
