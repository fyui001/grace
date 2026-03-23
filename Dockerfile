FROM node:25.2-slim AS base

EXPOSE 3000
EXPOSE 6006
ENV PORT=3000

FROM base AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG SSR_API_BASE_PATH=http://sophia
ENV SSR_API_BASE_PATH=${SSR_API_BASE_PATH}
RUN yarn build

FROM base AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=build --chown=nodejs:nodejs /app/public ./public
COPY --from=build --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nodejs:nodejs /app/.next/static ./.next/static

USER nodejs

CMD ["node", "server.js"]
