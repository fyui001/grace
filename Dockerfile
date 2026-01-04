FROM node:25.2-slim as base

EXPOSE 3000
EXPOSE 6006
ENV PORT=3000

FROM base

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs ./public ./public
COPY --chown=nodejs:nodejs ./.next/standalone ./
COPY --chown=nodejs:nodejs ./.next/static ./.next/static

USER nodejs

CMD ["node", "server.js"]

