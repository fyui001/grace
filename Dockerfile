FROM node:22.10-slim

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs ./public ./public
COPY --chown=nodejs:nodejs ./.next/standalone ./
COPY --chown=nodejs:nodejs ./.next/static ./.next/static

USER nodejs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]

