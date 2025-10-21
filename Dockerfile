# ------------------- Base Stage -------------------
FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# ------------------- Dependencies -------------------
FROM base AS deps
RUN pnpm install --frozen-lockfile

# ------------------- Builder -------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

# Generate the prisma client before build
RUN pnpm prisma generate

RUN pnpm build

# ------------------- Development -------------------
FROM base AS dev

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the prisma client
RUN pnpm prisma generate

RUN chmod +x entrypoint.sh

EXPOSE 3333

CMD ["pnpm", "start:dev"]

# ------------------- Production -------------------
FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./entrypoint.sh"]
CMD ["pnpm", "start:prod"]
