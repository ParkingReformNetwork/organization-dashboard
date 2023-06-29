/* eslint-disable no-console */

import { Point } from "@influxdata/influxdb-client";

const NOW_S = Math.floor(Date.now() / 1000);

const log = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

const createCountPoint = (measurementName, count) =>
  new Point(measurementName).intField("count", count).timestamp(NOW_S);

export { createCountPoint, log, NOW_S };
