# Project Setup & Run Guide

## Overview
### This project is a full-stack app with:

- Backend: NestJS

- Frontend: Next.js

- Database: PostgreSQL

- We use Docker + Docker Compose to simplify setup, environment management, and deployment.

- Two environments are supported:

- Development: hot-reload, code changes reflected instantly.

- Production: optimized images, no volume mounts, stable environment.

We use Docker + Docker Compose to simplify setup, environment management, and deployment.

#### Environment Variables
create a `.env` file
and then put these environment variables in that
```

POSTGRES_USER=dev
POSTGRES_PASSWORD=root
POSTGRES_DB=mxuc
POSTGRES_PORT=5432
```

#### Development
##### You don't need to do anything for this.

Backend: configs/.env.back

Frontend: configs/.env.front

### Start Development Environment
```bash

docker compose -f docker-compose.dev.yml up --build
```