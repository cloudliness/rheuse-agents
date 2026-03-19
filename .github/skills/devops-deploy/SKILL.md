---
name: devops-deploy
description: 'Docker deployment for the RHEUSE ecommerce platform. Use when: containerizing the app, writing Dockerfiles, configuring docker-compose, setting up MongoDB containers, managing volumes for media uploads, configuring environment variables for containers, troubleshooting container networking, building production Docker images, or running RHEUSE locally with Docker. Keywords: Docker, Dockerfile, docker-compose, container, containerize, deploy, MongoDB, multi-stage build, volumes, networking, production build, local development, RHEUSE.'
---

# RHEUSE DevOps — Docker Deployment

Container-first deployment guide for the **RHEUSE** ecommerce platform (Next.js 14 + Payload CMS + MongoDB). All procedures are Docker-focused.

## When to Use

- Writing or updating `Dockerfile` or `docker-compose.yml`
- Building and tagging production images
- Running RHEUSE locally with full Docker stack (app + MongoDB)
- Configuring container environment variables
- Managing persistent volumes for MongoDB data and Payload media uploads
- Debugging container networking, startup order, or health checks
- Setting up a container registry push workflow

## Stack Overview

The RHEUSE Docker topology runs two services:

```
┌──────────────────────────────────────────────┐
│                 Docker Network: rheuse        │
│                                              │
│  ┌─────────────┐     ┌────────────────────┐  │
│  │    app      │────▶│      mongo         │  │
│  │ (Next.js +  │     │   (MongoDB 7)      │  │
│  │  Payload)   │     │                    │  │
│  │  port 3000  │     │   port 27017       │  │
│  └─────────────┘     └────────────────────┘  │
│         │                      │             │
│    [app-media]            [mongo-data]        │
│    (media uploads)       (DB files)          │
└──────────────────────────────────────────────┘
```

## 1. Dockerfile (Multi-Stage Production Build)

Use a multi-stage build to keep the final image lean. Place at project root:

```dockerfile
# ── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifest only — layer-cached unless dependencies change
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args injected at build time (non-secret public vars)
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Build Next.js + Payload together
RUN yarn build

# ── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Payload uploads directory — must be writable
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

> **Prerequisite:** Add `output: 'standalone'` to `next.config.js` to enable the standalone build output.

```js
// next.config.js
module.exports = {
  output: 'standalone',
  // ...existing config
}
```

## 2. docker-compose.yml

### Development (with hot reload)

```yaml
# docker-compose.yml  ← use for local development
version: '3.9'

services:
  app:
    build:
      context: .
      target: deps           # Only install deps — mount source for hot reload
    command: yarn dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app               # Mount entire source for hot reload
      - /app/node_modules    # Anonymous volume: prevents host node_modules override
      - app-media:/app/media # Persistent media uploads
    env_file:
      - .env.local
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - rheuse

  mongo:
    image: mongo:7
    restart: unless-stopped
    ports:
      - '27017:27017'        # Expose locally for DB clients (Compass, etc.)
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: rheuse
    healthcheck:
      test: ['CMD', 'mongosh', '--eval', "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - rheuse

volumes:
  mongo-data:
  app-media:

networks:
  rheuse:
    driver: bridge
```

### Production

```yaml
# docker-compose.prod.yml  ← use for production
version: '3.9'

services:
  app:
    build:
      context: .
      target: runner          # Final lean image
      args:
        NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    image: rheuse/app:${IMAGE_TAG:-latest}
    restart: unless-stopped
    ports:
      - '3000:3000'
    volumes:
      - app-media:/app/media  # Persist Payload media uploads
    env_file:
      - .env.production
    depends_on:
      mongo:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - rheuse

  mongo:
    image: mongo:7
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: rheuse
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    healthcheck:
      test: ['CMD', 'mongosh', '--eval', "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    # Do NOT expose port 27017 in production — internal network only
    networks:
      - rheuse

volumes:
  mongo-data:
  app-media:

networks:
  rheuse:
    driver: bridge
```

## 3. Environment Files

### `.env.local` (development — never commit)

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database — matches docker-compose service name
MONGODB_URI=mongodb://mongo:27017/rheuse

# Payload
PAYLOAD_SECRET=dev-secret-change-in-production
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Stripe (test keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_...
```

### `.env.production` (production — use secrets manager or inject at runtime)

```env
NEXT_PUBLIC_APP_URL=https://shop.rheuse.com
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/rheuse
PAYLOAD_SECRET=<strong-random-64-char-secret>
PAYLOAD_PUBLIC_SERVER_URL=https://shop.rheuse.com
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_...
MONGO_ROOT_USER=rheuse_admin
MONGO_ROOT_PASSWORD=<strong-password>
```

> **Security:** Never commit `.env.production` or `.env.local`. Add both to `.gitignore`. Use `PAYLOAD_SECRET` of at least 32 random characters — it signs auth tokens.

## 4. .dockerignore

Prevents bloating the build context. Place at project root:

```
node_modules
.next
.git
.gitignore
*.md
.env*
.env.local
.env.production
docker-compose*.yml
coverage
.nyc_output
```

## 5. Common Commands

### Development

```bash
# Start full stack (app + MongoDB) with hot reload
docker compose up

# Start in background
docker compose up -d

# Rebuild after package.json changes
docker compose up --build

# View live logs
docker compose logs -f app

# Open a shell in the running app container
docker compose exec app sh

# Stop everything
docker compose down

# Stop and remove volumes (wipes DB — use with care)
docker compose down -v
```

### Production Build

```bash
# Build the production image
docker compose -f docker-compose.prod.yml build

# Tag for a registry (e.g., GHCR)
docker tag rheuse/app:latest ghcr.io/your-org/rheuse-app:v1.0.0

# Push to registry
docker push ghcr.io/your-org/rheuse-app:v1.0.0

# Deploy on the server
docker compose -f docker-compose.prod.yml up -d

# Zero-downtime redeploy (pull new image, restart app only)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --no-deps app
```

### Maintenance

```bash
# Run a one-off command (e.g., seed the database)
docker compose run --rm app yarn payload seed

# Inspect container health
docker inspect --format='{{json .State.Health}}' rheuse-app-1

# Follow MongoDB logs
docker compose logs -f mongo

# Backup MongoDB data volume
docker run --rm \
  -v rheuse_mongo-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/mongo-$(date +%Y%m%d).tar.gz /data

# Restore from backup
docker run --rm \
  -v rheuse_mongo-data:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/mongo-YYYYMMDD.tar.gz --strip 1"
```

## 6. Volume Strategy

| Volume | Container Path | What's Stored | Backup Priority |
|--------|---------------|---------------|----------------|
| `mongo-data` | `/data/db` | All MongoDB collections — products, orders, users | **Critical** — back up daily |
| `app-media` | `/app/media` | Payload CMS uploaded images/files | **High** — back up weekly |

> For production scale, replace the local `app-media` volume with S3 or similar object storage by configuring Payload's `upload` adapter.

## 7. Networking Rules

- All inter-service communication uses the **service name as hostname** (e.g., `mongo:27017` not `localhost:27017`)
- MongoDB port `27017` is **never exposed** in production — only accessible within the `rheuse` Docker network
- Only port `3000` (app) is exposed to the host; put a reverse proxy (Nginx/Caddy) in front for TLS termination

## 8. Health Check Endpoint

Add a lightweight health route so Docker knows when the container is ready:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

## 9. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `app` exits immediately | MongoDB not ready yet | Ensure `depends_on` with `condition: service_healthy` |
| `ECONNREFUSED mongodb:27017` | Wrong `MONGODB_URI` host | Use service name `mongo`, not `localhost` |
| Media uploads missing after redeploy | `app-media` volume not mounted | Verify volume mount in compose file |
| `PAYLOAD_SECRET` warning in logs | Secret too short or missing | Set a 32+ char random string |
| `next build` fails in Docker | Missing build args | Pass `NEXT_PUBLIC_*` vars as `args:` in compose `build:` block |
| Port 3000 already in use | Host process conflict | `lsof -i :3000` and kill, or change host port to `3001:3000` |
| Slow image builds | `node_modules` not cached | Ensure `COPY package.json yarn.lock` is before `COPY . .` |