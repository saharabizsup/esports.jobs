# esports.jobs

Local development instructions for running the full esports.jobs experience on your workstation. The repository contains a TypeScript/Express API and a Vite-powered React front end composed of the feature modules under `apps/web/src/modules`.

## Prerequisites

- Node.js 18+
- npm 9+

## Install dependencies

From the repository root run:

```bash
npm install
```

This installs workspace dependencies for both the API and the web client.

## Run everything locally

Launch both the API (port 4000) and the web client (port 5173) in watch mode:

```bash
npm run dev
```

- API available at http://localhost:4000 (health check at `/api/health`)
- Web app available at http://localhost:5173

The web client proxies `/api` requests to the local API during development.

## Useful workspace scripts

You can run scripts for an individual workspace using npm's `--workspace` flag:

```bash
# API only
npm run dev --workspace @esportsjobs/api

# Web app only
npm run dev --workspace @esportsjobs/web

# Type check and build all workspaces
npm run build
```

To start the compiled API (after running `npm run build`):

```bash
npm start
```

## Deployment prep

Once you're ready to publish the site via FTP, build the production bundles:

```bash
# Build API (outputs to apps/api/dist) and web client (outputs to apps/web/dist)
npm run build
```

The web build artifacts in `apps/web/dist` can be uploaded to your host. If you plan to serve the API externally, deploy the `apps/api/dist` output on a Node-compatible host.

## Environment variables

The local setup works without additional configuration. For production hosting you can override the API base URL used by the web client by setting `VITE_API_BASE_URL` during the build step.

