FROM node:12-alpine AS builder
# ENV NODE_ENV production
COPY ./UI /src/UI
RUN cd /src/UI && npm ci && npm run build

COPY ./Server /src/Server
RUN cd /src/Server && npm ci

RUN cp -r /src/UI/build /src/Server/public


FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /dist
EXPOSE 6769
RUN npm i -g pm2
COPY --from=builder /src/Server /dist
CMD pm2-docker index.js