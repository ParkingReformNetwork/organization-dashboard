import axios from "axios";
import { Point } from "@influxdata/influxdb-client";
import Papa from "papaparse";

import { createCountPoint } from "./utils";

const MANDATES_CSV =
  "https://raw.githubusercontent.com/ParkingReformNetwork/mandates-map/main/map/trimmed_map_data.csv";
const CITIES_JSON =
  "https://raw.githubusercontent.com/ParkingReformNetwork/parking-lot-map/main/data/score-cards.json";

const parseMandatesCsv = (csv: string): Point => {
  const parsed = Papa.parse(csv, { header: true });
  return createCountPoint("mandates-map-entries", parsed.data.length);
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

const getHistoricalPoints = async (): Promise<Point[]> => [
  createCountPoint("mandates-map-entries", 10, 1488417933),
];

export default {
  getCurrentPoints,
  getHistoricalPoints,
  parseCitiesJson,
  parseMandatesCsv,
};
