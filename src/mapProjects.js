import axios from "axios";
import Papa from "papaparse";

import { createCountPoint } from "./utils.js";

const MANDATES_CSV =
  "https://raw.githubusercontent.com/ParkingReformNetwork/mandates-map/main/map/trimmed_map_data.csv";
const CITIES_JSON =
  "https://raw.githubusercontent.com/ParkingReformNetwork/parking-lot-map/main/data/score-cards.json";

const parsePoints = (mandatesCsvData, citiesJsonData) => {
  const mandatesParsedData = Papa.parse(mandatesCsvData, { header: true });
  const mandateCount = mandatesParsedData.data.length;

  const cityCount = Object.keys(citiesJsonData).length;
  return [
    createCountPoint("mandates-map-entries", mandateCount),
    createCountPoint("parking-lot-map-entries", cityCount),
  ];
};

const getCurrentPoints = async () => {
  const [mandatesResponse, cities] = await Promise.all([
    axios.get(MANDATES_CSV, { responseType: "text" }),
    axios.get(CITIES_JSON, { responseType: "json" }),
  ]);
  return parsePoints(mandatesResponse.data, cities.data);
};

const getHistoricalPoints = async () => {
  return [];
};

export default {
  getCurrentPoints,
  getHistoricalPoints,
  parsePoints,
};
