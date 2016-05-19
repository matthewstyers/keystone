FROM mhart/alpine-node:6

ADD . /app/keystone

CMD npm link
