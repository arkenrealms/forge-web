# ----------------------------
# Stage 1: Builder
# ----------------------------
FROM node:20 AS builder

ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /usr/src/app

# Install Rush globally
RUN npm install -g @microsoft/rush

# Clone repo + submodules
RUN git clone https://github.com/arkenrealms/arken.git
WORKDIR /usr/src/app/arken
RUN git checkout main
RUN git submodule update --init --recursive

# Swap rush.json
RUN rm rush.json && mv rush.forge.json rush.json

# Install deps
RUN rush update

# Move into forge-web
WORKDIR /usr/src/app/arken/packages/forge/packages/web

# Copy env
COPY .env.sample .env

# Build
RUN rushx build

# ----------------------------
# Stage 2: Runtime
# ----------------------------
FROM node:20-slim AS runtime

WORKDIR /usr/src/app

# Copy build artifacts only
COPY --from=builder /usr/src/app/arken/packages/forge/packages/web/build ./build

# Install a lightweight static server
RUN npm install -g serve

EXPOSE 8021

# Serve production build
CMD ["serve", "-s", "build", "-l", "8021"]