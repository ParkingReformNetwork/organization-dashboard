/* eslint-disable no-console */

import { Point } from "@influxdata/influxdb-client";

const NOW = Date.now();

const log = (msg) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

const createCountPoint = (measurementName, count) =>
  new Point(measurementName).intField("count", count).timestamp(NOW);

export { createCountPoint, log, NOW };
