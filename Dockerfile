FROM node:20 AS builder

ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /usr/src/app

# Install Rush globally
RUN npm install -g @microsoft/rush

# Clone repo
RUN git clone https://github.com/arkenrealms/arken.git
WORKDIR /usr/src/app/arken
RUN git checkout main

# Init & update submodules like before
RUN git submodule init
RUN git submodule update --remote --recursive

# Swap rush.json
RUN rm rush.json && mv rush.forge.json rush.json

# Install deps
RUN rush update

# Move into forge-web
WORKDIR /usr/src/app/arken/packages/forge/packages/web

# Copy env from this repo
COPY .env.sample /usr/src/app/arken/packages/forge/packages/web/.env

# Build
RUN rushx build