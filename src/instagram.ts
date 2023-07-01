import { Point } from "@influxdata/influxdb-client";
import axios from "axios";

import { createCountPoint } from "./utils";

const getCurrentPoints = async (): Promise<Point[]> => {
  const response = await axios.get("https://www.instagram.com/parkingreform/", {
    responseType: "text",
  });
  console.log(response.data);
  return [createCountPoint("instagram-followers", 2000)];
};

export default {
  getCurrentPoints,
};
