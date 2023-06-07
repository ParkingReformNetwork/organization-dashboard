# Organization dashboard

Supporting code for an InfluxDB dashboard showing how the Parking Reform Network is doing over time, such as # of social media followers and # donors.

This repository is used to ping the relevant APIs and then write those results into InfluxDB. We manage the InfluxDB data and dashboard directly in its Web UI.

The code is not meant to be run locally because of the need for sensitive API keys.

## How tos

### Format code

```bash
❯ npm install
❯ npm fmt
```

### Lint code

Linting checks for common bugs.

```bash
❯ npm install
❯ npm lint
```
