# ----------------------------
# Stage 1: Builder
# ----------------------------
FROM node:20 AS builder

ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /usr/src/app

# Install Rush globally
RUN npm install -g @microsoft/rush

# Clone repo
RUN git clone https://github.com/arkenrealms/arken.git
WORKDIR /usr/src/app/arken
RUN git checkout main

# Init & update submodules (top-level)
RUN git submodule init
RUN git submodule update --remote --recursive

# Swap rush.json
RUN rm rush.json && mv rush.forge.json rush.json

# Update submodules in specific packages
WORKDIR /usr/src/app/arken/packages/seer
RUN git checkout main && git submodule init && git submodule update --remote --recursive

WORKDIR /usr/src/app/arken/packages/evolution
RUN git checkout main && git submodule init && git submodule update --remote --recursive

WORKDIR /usr/src/app/arken/packages/forge
RUN git checkout main && git submodule init && git submodule update --remote --recursive

# Move into forge-web
WORKDIR /usr/src/app/arken/packages/forge/packages/web
RUN git checkout main

# Install deps at repo root
WORKDIR /usr/src/app/arken
RUN rush update

# Back into forge-web
WORKDIR /usr/src/app/arken/packages/forge/packages/web

# Copy sample env file (inside container, no host dependency)
RUN cp .env.sample .env

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