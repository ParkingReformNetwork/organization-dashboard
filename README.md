# Organization dashboard

Supporting code for an InfluxDB dashboard showing how the Parking Reform Network is doing over time, such as # of social media followers and # donors.

This repository is used to ping the relevant APIs and then write those results into InfluxDB. We manage the InfluxDB data and dashboard directly in its Web UI.

**WARNING**: When running locally, _do not use production API keys for InfluxDB unless you are 100% confident what you are doing and it is temporary_. Set up a local InfluxDB instance. It's fine to use production credentials for our API integrations because we only ever read, but please be very careful to never share these keys or upload them online.

## Prereqs to run locally

- Node.js
- Git
  - On Windows, download Git Bash.
- [InfluxDB](https://docs.influxdata.com/influxdb/v2.7/install/). It should be running via the program `influxd`. Check that http://localhost:8086 loads.

### Set up InfluxDB account

At http://localhost:8086, create an account:

- Your login is only used locally, so you don't need a strong username or password. Save both values.
- Set Organization Name to "parking-reform-network"
- Set Bucket Name to "metrics"

Once you get to the dashboard, save your API key from the top of the screen somewhere temporarily.

Find your Organization ID number by clicking the P icon in the left sidebar, then "About". Save it somewhere temporarily.

## Set up environment variables

In this repository, create the file `.env` and fill in the relevant places:

```txt
INFLUXDB_URL=http://localhost:8086
INFLUXDB_BUCKET=metrics
INFLUXDB_API_TOKEN=REPLACE WITH INFLUX TOKEN
INFLUXDB_ORG=REPLACE WITH ORGANIZATION ID
```

Be careful to never share the `.env` file!

## How tos

Run `npm install` before all these commands.

### Check type compilation

```bash
❯ npm run build
```

`npm start` and `npm test` will also compile your code.

### Format code

```bash
❯ npm run fmt
```

### Lint code

Linting checks for common bugs.

```bash
❯ npm run lint
```

### Run tests

```bash
❯ npm test
```

### Run the script

First, choose the services you want to scrape. Run `npm start -- --help` to see the choices.

Finally, run `npm start -- --services service1 service2`, e.g.

```bash
❯ npm start -- --services map-projects instagram
```

Add `--write` to the command to save the results to InfluxDB. Otherwise, the result will only be logged to the screen, which is useful when iterating on a service.
