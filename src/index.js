import "dotenv/config";
import { InfluxDB } from "@influxdata/influxdb-client";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { log } from "./utils.js";
import mapProjects from "./mapProjects.js";

const readArgv = () =>
  yargs(hideBin(process.argv))
    .option("services", {
      alias: "s",
      type: "array",
      default: [],
      choices: ["map-projects"],
      description: "Specify the services to scrape",
    })
    .option("write", {
      alias: "w",
      type: "boolean",
      default: false,
      description: "Write results to InfluxDB",
    }).argv;

const readEnvVars = () => {
  const expected = [
    "INFLUXDB_URL",
    "INFLUXDB_API_TOKEN",
    "INFLUXDB_ORG",
    "INFLUXDB_BUCKET",
  ];
  return expected.reduce((acc, envVar) => {
    const val = process.env[envVar];
    if (!val) {
      throw new Error(`Environment variable ${envVar} is not set.`);
    }
    return { ...acc, [envVar]: val };
  }, {});
};

const setUpInflux = (envVars) => {
  const influxDB = new InfluxDB({
    url: envVars.INFLUXDB_URL,
    token: envVars.INFLUXDB_API_TOKEN,
  });
  return influxDB.getWriteApi(
    envVars.INFLUXDB_ORG,
    envVars.INFLUXDB_BUCKET,
    "s"
  );
};

const getCurrentPoints = async (argv) => {
  const result = [];

  if (argv.services.includes("map-projects")) {
    log("map-projects: starting");
    const mapPoints = await mapProjects.getCurrentPoints();
    log("map-projects: finished");
    result.push(...mapPoints);
  }

  return result;
};

const main = async () => {
  const argv = readArgv();
  const envVars = readEnvVars();

  const result = await getCurrentPoints(argv);
  log(`Result: ${result}`);

  if (!argv.write) {
    return;
  }

  const influx = setUpInflux(envVars);
  influx.writePoints(result);
  await influx.close();
  log("InfluxDB write finished.");
};

main();
