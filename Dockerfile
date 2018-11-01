FROM node:10 AS builder
ENV NODE_ENV production
RUN npm i -g yarn
COPY . /src
RUN cd /src/UI && yarn && yarn build && cd /src/Server && yarn && mkdir public && mv /src/UI/build/* public

FROM mhart/alpine-node:10
ENV NODE_ENV production
WORKDIR /dist
EXPOSE 6769
RUN npm i -g pm2
COPY --from=builder /src/Server /dist
CMD pm2-docker index.js