FROM mhart/alpine-node:latest

ADD . /app/keystone
WORKDIR /app/keystone
VOLUME /app/keystone /app/keystone

ONBUILD RUN apk add --no-cache make gcc g++ python && npm install && npm link
