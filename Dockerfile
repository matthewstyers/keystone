FROM mhart/alpine-node:latest

ADD . /app/keystone
RUN apk add --no-cache make gcc g++ python && npm install -g gulp@3.9.1
