FROM node:10 AS builder
# ENV NODE_ENV production
COPY ./UI /src/UI
RUN cd /src/UI && yarn && yarn build

COPY ./Server /src/Server
RUN cd /src/Server && yarn

RUN cp -r /src/UI/build /src/Server/public


FROM mhart/alpine-node:10
ENV NODE_ENV production
WORKDIR /dist
EXPOSE 6769
RUN npm i -g pm2
COPY --from=builder /src/Server /dist
CMD pm2-docker index.js