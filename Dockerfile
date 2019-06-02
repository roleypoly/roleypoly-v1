FROM node:12 AS builder
WORKDIR /src
COPY . /src
# we double yarn here to strip off dev-only packages that are needed at build time.
RUN yarn --frozen-lockfile &&\
    yarn build &&\
    yarn --prod --frozen-lockfile

FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /dist
COPY --from=builder /src /dist
CMD npm start
