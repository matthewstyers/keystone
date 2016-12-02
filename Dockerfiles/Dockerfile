# uses an alpine linux image with node/npm pre-installed
FROM mhart/alpine-node:6.9.1

# adds current directory to image at /app/keystone
ADD . /app/keystone

# on build, the working directory will be /app/keystone
WORKDIR /app/keystone

# adds the bare necessities to run npm and installs node_modules
RUN apk add --no-cache make gcc g++ python && npm i --loglevel info

# on build, /app/keystone on this image (i.e. this directory) will
# be mapped to the dependent image at the same location
VOLUME /app/keystone

# adds some instuctions to execute at the beginning of the dependant image's
# build process.

# link we reference when building the dependant image.
ONBUILD RUN npm link
