# Organization dashboard

Supporting code for an InfluxDB dashboard showing how the Parking Reform Network is doing over time, such as # of social media followers and # donors.

This repository is used to ping the relevant APIs and then write those results into InfluxDB. We manage the InfluxDB data and dashboard directly in its Web UI.

**WARNING**: When running locally, _do not use production API keys for InfluxDB_. Set up a local InfluxDB instance. It's fine to use production credentials for our API integrations because we only ever read, but please be very careful to never share these keys or upload them online.

## How tos

Run `npm install` before all these commands.

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

You will have to set all relevant environment variables in `.env` for this to work. Be careful to never share this file!

Then, choose the services you want to scrape. Run `npm start -- --help` to see the choices.

Finally, run `npm start -- --services service1 service2`, e.g.

```bash
❯ npm start -- --services map-projects instagram
```
