FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS runtime
WORKDIR /app

# Copy the built output and node_modules needed at runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Railway injects PORT; Nitro node-server reads it automatically
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["bun", "run", "start"]
