/* eslint-disable no-console */

import { exec, ExecOptions } from "child_process";

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
  options?: ExecOptions
): Promise<[string, string]> =>
  new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stdout instanceof Buffer || stderr instanceof Buffer) {
        return reject(
          new Error("stdout or stderr is Buffer, which is not supported")
        );
      }
      return resolve([stdout, stderr]);
    });
  });

export { createCountPoint, log, runProcess, convertDateToTimeStampS, NOW_S };
