/* eslint-disable no-console */

import { InfluxDB, Point } from "@influxdata/influxdb-client";

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

const samplePoints = () =>
  [
    [100, 1678780800],
    [200, 1678867200],
  ].map(([v, timestamp]) =>
    new Point("hardcoded-measurement").intField("count", v).timestamp(timestamp)
  );

const main = () => {
  const envVars = readEnvVars();
  const influx = setUpInflux(envVars);

  const result = samplePoints();

  influx.writePoints(result);
  influx.close().then(() => {
    console.log("InfluxDB write finished.");
  });
};

main();
