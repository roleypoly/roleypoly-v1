FROM node:11.14 AS builder
WORKDIR /src
COPY . /src
# we double yarn here to strip off dev-only packages that are needed at build time.
RUN yarn workspace @roleypoly/bot --frozen-lockfile &&\
    yarn workspace @roleypoly/bot build &&\
    yarn workspace @roleypoly/bot --frozen-lockfile --prod

FROM node:11.14-alpine
ENV NODE_ENV production
WORKDIR /dist
COPY --from=builder /src/packages /dist/packages/
COPY --from=builder /src/node_modules /dist/node_modules
CMD node /dist/packages/roleypoly-bot/lib/index.js
