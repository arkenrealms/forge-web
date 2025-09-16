FROM node:20

ARG CACHEBUST=17

ENV NODE_OPTIONS=--max-old-space-size=8192
ENV INLINE_RUNTIME_CHUNK=false

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y vim && rm -rf /var/lib/apt/lists/*
RUN npm install -g @microsoft/rush ts-node-dev pm2

WORKDIR /usr/src/app
RUN git clone https://github.com/arkenrealms/arken.git
WORKDIR /usr/src/app/arken
RUN git submodule init
RUN git submodule update --remote --recursive
RUN rm rush.json
RUN mv rush.forge.json rush.json
WORKDIR /usr/src/app/arken/packages/seer
RUN git checkout main
RUN git submodule init
RUN git submodule update --remote --recursive
WORKDIR /usr/src/app/arken/packages/evolution
RUN git checkout main
RUN git submodule init
RUN git submodule update --remote --recursive
WORKDIR /usr/src/app/arken/packages/forge
RUN git checkout main
RUN git submodule init
RUN git submodule update --remote --recursive
WORKDIR /usr/src/app/arken/packages/forge/packages/web
RUN git checkout main

RUN rush update

COPY .env.sample .env
# RUN rushx dev

EXPOSE 8021

CMD ["rushx", "dev"]
# CMD ["rushx dev"]