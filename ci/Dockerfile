# ----------------------------
# Stage 1: Builder
# ----------------------------
FROM node:20 AS builder

ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /usr/src/app

# Install Rush globally
RUN npm install -g @microsoft/rush

# Clone repo + submodules in one shot
RUN git clone https://github.com/arkenrealms/arken.git \
 && cd arken \
 && git checkout main \
 && git submodule update --init --recursive --remote \
 && rm rush.json && mv rush.forge.json rush.json

WORKDIR /usr/src/app/arken

# Install deps
RUN rush update

# Move into forge-web
WORKDIR /usr/src/app/arken/packages/forge/packages/web

# Copy env (ensure build context includes .env.sample)
COPY .env.sample .env

# Build forge-web
RUN rushx build


# ----------------------------
# Stage 2: Runtime
# ----------------------------
FROM node:20-slim AS runtime

WORKDIR /usr/src/app

# Copy production build only
COPY --from=builder /usr/src/app/arken/packages/forge/packages/web/build ./build

# Lightweight static server
RUN npm install -g serve

EXPOSE 8021

# Serve production build
CMD ["serve", "-s", "build", "-l", "8021"]