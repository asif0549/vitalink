# VitaLink Database Setup 💾

This directory contains configuration to run a local MongoDB instance.

## Run using Docker Compose

If you have Docker installed, you can start MongoDB with:
```bash
docker-compose up -d
```

This starts MongoDB on the default port `27017` and persists data in a Docker volume called `mongodb_data`.

## Run using Local MongoDB Service

If you already have MongoDB installed as a local system service (running on port `27017`), the backend will connect to it automatically.
