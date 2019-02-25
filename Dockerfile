FROM node:10 AS builder
WORKDIR /src
COPY . /src
# we double yarn here to strip off dev-only packages that are needed at build time.
RUN yarn --frozen-lockfile &&\
    yarn build &&\
    yarn --prod --frozen-lockfile

FROM mhart/alpine-node:10
ENV NODE_ENV production
WORKDIR /dist
COPY --from=builder /src /dist
CMD node index.js
