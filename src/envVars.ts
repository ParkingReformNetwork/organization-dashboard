import "dotenv/config";

const EXPECTED_ENV_VARS = {
  INFLUXDB_URL: "",
  INFLUXDB_API_TOKEN: "",
  INFLUXDB_ORG: "",
  INFLUXDB_BUCKET: "",
  IG_ACCESS_TOKEN: "",
  IG_USER_ID: "",
};

type EnvVars = typeof EXPECTED_ENV_VARS;

const readEnvVars = (): EnvVars =>
  Object.keys(EXPECTED_ENV_VARS).reduce((acc, envVar) => {
    const val = process.env[envVar];
    if (!val) {
      throw new Error(`Environment variable ${envVar} is not set.`);
    }
    return { ...acc, [envVar]: val };
  }, {}) as EnvVars;

export { EnvVars, readEnvVars };
