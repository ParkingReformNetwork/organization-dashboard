/* eslint-disable no-console */

import { spawn, SpawnOptionsWithoutStdio } from "child_process";

import { Point } from "@influxdata/influxdb-client";

const NOW_S = Math.floor(Date.now() / 1000);

const log = (msg: string): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
};

const convertDateToTimeStampS = (date: string): number => {
  const parsedDate = new Date(date);
  return Math.floor(parsedDate.getTime() / 1000);
};

const createCountPoint = (
  measurementName: string,
  count: number,
  timestampInSeconds: number = NOW_S
): Point =>
  new Point(measurementName)
    .intField("count", count)
    .timestamp(timestampInSeconds);

const runProcess = (
  cmd: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio
): Promise<[string, string]> =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);

    let output = "";
    child.stdout.on("data", (data) => {
      output += data;
    });

    let errorOutput = "";
    child.stderr.on("data", (data) => {
      errorOutput += data;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve([output, errorOutput]);
      } else {
        reject(new Error(`Command exited with code ${code}: ${errorOutput}`));
      }
    });
  });

export { createCountPoint, log, runProcess, convertDateToTimeStampS, NOW_S };
