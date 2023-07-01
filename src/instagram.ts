import { Point } from "@influxdata/influxdb-client";

import { createCountPoint } from "./utils";

const getCurrentPoints = async (): Promise<Point[]> => {
  return [createCountPoint("instagram-followers", 2000)];
};

export default {
  getCurrentPoints,
};
