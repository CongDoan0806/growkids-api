# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# ---------- Stage 2: Production Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# ---------- Stage 3: Production ----------
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache ca-certificates curl

RUN addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production

COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package*.json ./
COPY --from=builder --chown=app:app /app/prisma ./prisma

RUN mkdir -p /app/logs && chown -R app:app /app

USER app

EXPOSE 3000

CMD ["node", "dist/main.js"]
