import "dotenv/config";
import { InfluxDB, Point, WriteApi } from "@influxdata/influxdb-client";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { log } from "./utils";
import mapProjects from "./mapProjects";
import mastodon from "./mastodon";
import linkedin from "./linkedin";
import instagram from "./instagram";

const EXPECTED_ENV_VARS = {
  INFLUXDB_URL: "",
  INFLUXDB_API_TOKEN: "",
  INFLUXDB_ORG: "",
  INFLUXDB_BUCKET: "",
};

type EnvVars = typeof EXPECTED_ENV_VARS;

interface Arguments {
  [x: string]: unknown;
  services: string[];
  historical: string[];
  write: boolean;
}

const readArgv = (): Arguments =>
  yargs(hideBin(process.argv))
    .option("services", {
      alias: "s",
      type: "array",
      default: [],
      choices: ["map-projects", "mastodon", "linkedin", "instagram"],
      description: "Specify the services to get the current data for",
    })
    .option("historical", {
      alias: "h",
      type: "array",
      default: [],
      choices: ["map-projects"],
      description: "Specify the services to get historical data for",
    })
    .option("write", {
      alias: "w",
      type: "boolean",
      default: false,
      description: "Write results to InfluxDB",
    })
    .parseSync();

const readEnvVars = (): EnvVars =>
  Object.keys(EXPECTED_ENV_VARS).reduce((acc, envVar) => {
    const val = process.env[envVar];
    if (!val) {
      throw new Error(`Environment variable ${envVar} is not set.`);
    }
    return { ...acc, [envVar]: val };
  }, {}) as EnvVars;

const setUpInflux = (envVars: EnvVars): WriteApi => {
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

const getPoints = async (argv: Arguments): Promise<Point[]> => {
  const result = [];

  if (argv.services.includes("map-projects")) {
    log("map-projects (current): starting");
    const points = await mapProjects.getCurrentPoints();
    log("map-projects (current): finished");
    result.push(...points);
  }

  if (argv.services.includes("mastodon")) {
    log("mastodon (current): starting");
    const points = await mastodon.getCurrentPoints();
    log("mastodon (current): finished");
    result.push(...points);
  }

  if (argv.services.includes("linkedin")) {
    log("linkedin (current): starting");
    const points = await linkedin.getCurrentPoints();
    log("linkedin (current): finished");
    result.push(points);
  }

  if (argv.services.includes("instagram")) {
    log("instagram (current): starting");
    const points = await instagram.getCurrentPoints();
    log("instagram (current): finished");
    result.push(...points);
  }

  if (argv.historical.includes("map-projects")) {
    log("map-projects (historical): starting");
    const points = await mapProjects.getHistoricalPoints();
    log("map-projects (historical): finished");
    result.push(...points);
  }

  return result;
};

const main = async (): Promise<void> => {
  const argv = readArgv();
  const envVars = readEnvVars();

  const result = await getPoints(argv);
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
