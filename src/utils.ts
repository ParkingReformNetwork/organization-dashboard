/* eslint-disable no-console */

import { Point } from "@influxdata/influxdb-client";

const NOW_S = Math.floor(Date.now() / 1000);

const log = (msg: string): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

const createCountPoint = (
  measurementName: string,
  count: number,
  timestamp_s: number = NOW_S
): Point =>
  new Point(measurementName).intField("count", count).timestamp(timestamp_s);

export { createCountPoint, log, NOW_S };
