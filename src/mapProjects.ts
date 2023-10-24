/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop  */
import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import Papa from "papaparse";
import fs from "fs/promises";

import { createCountPoint, runProcess, convertDateToTimeStampS } from "./utils";

const createParkingLotsPoint = (count: number, date?: string): Point => {
  const timestamp =
    date === undefined ? undefined : convertDateToTimeStampS(date);
  return createCountPoint("parking-lot-map-entries", count, timestamp);
};

const REFORM_CSV =
  "https://raw.githubusercontent.com/ParkingReformNetwork/reform-map/main/map/trimmed_map_data.csv";
const CITIES_JSON =
  "https://raw.githubusercontent.com/ParkingReformNetwork/parking-lot-map/main/data/score-cards.json";

const parseReformCsv = (csv: string, timestamp?: number): Point => {
  const parsed = Papa.parse(csv, { header: true });
  return createCountPoint(
    "reform-map-entries",
    parsed.data.length,
    timestamp
  );
};

const parseCitiesJson = (jsonData: Record<string, unknown>): Point =>
  createParkingLotsPoint(Object.keys(jsonData).length);

const getCurrentPoints = async (): Promise<Point[]> => {
  const [reformResponse, cities] = await Promise.all([
    axios.get(REFORM_CSV, { responseType: "text" }),
    axios.get(CITIES_JSON, { responseType: "json" }),
  ]);
  return [
    parseReformCsv(reformResponse.data),
    parseCitiesJson(cities.data),
  ];
};

const getReformCountForCommit = async (
  commit: string,
  date: string
): Promise<Point> => {
  await runProcess("git", ["checkout", commit], { cwd: "../reform-map" });
  const fileName =
    commit === "68bf32e"
      ? "initial_tidied_map_data.csv"
      : "tidied_map_data.csv";
  const reform = await fs.readFile(`../reform-map/map/${fileName}`, "utf8");
  return parseReformCsv(reform, convertDateToTimeStampS(date));
};

const getHistoricalPoints = async (): Promise<Point[]> => {
  const repositoryPath = "../reform-map";
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
  await runProcess("git", ["checkout", "main"], { cwd: "../reform-map" });
  const [stdout] = await runProcess(
    "git",
    [
      "log",
      "--pretty=format:'%h %ad'",
      "--date=short",
      "map/tidied_map_data.csv",
    ],
    { cwd: "../reform-map" }
  );
  const commitDatePairs = stdout
    .split("\n")
    .map((line) => line.replace(/'/g, "").split(" "));

  const result = [];
  for (const [commit, date] of commitDatePairs) {
    const point = await getReformCountForCommit(commit, date);
    result.push(point);
  }

  // Hardcode the historical data for parking-lots-map because we have so few entries.
  result.push(
    createParkingLotsPoint(53, "2023-7-1"),
    createParkingLotsPoint(52, "2023-4-6"),
    createParkingLotsPoint(51, "2023-3-8")
  );
  return result;
};

export default {
  getCurrentPoints,
  getHistoricalPoints,
  parseCitiesJson,
  parseReformCsv,
};
