FROM node:25.2-slim AS base

EXPOSE 3000
EXPOSE 6006
ENV PORT=3000

FROM base AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG SSR_API_URL=http://chiron
ENV SSR_API_URL=${SSR_API_URL}
RUN yarn build

FROM base
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs ./public ./public
COPY --chown=nodejs:nodejs ./.next/standalone ./
COPY --chown=nodejs:nodejs ./.next/static ./.next/static

USER nodejs

CMD ["node", "server.js"]

