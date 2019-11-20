FROM node:12-alpine AS base

FROM base AS uibase
WORKDIR /src/UI

FROM base AS serverbase
WORKDIR /src/Server
RUN apk add --no-cache git python build-base

FROM uibase AS uideps
COPY ./UI/package-lock.json ./UI/package.json ./
RUN npm ci

FROM serverbase AS serverdeps
COPY ./Server/package-lock.json ./Server/package.json ./
RUN npm ci

FROM uideps AS uibuild
COPY ./UI .
RUN npm run build

FROM scratch AS combined
COPY ./Server/ /src/Server
COPY --from=serverdeps /src/Server/node_modules /src/Server/node_modules
COPY --from=uibuild /src/UI/build /src/Server/public

FROM base
ENV NODE_ENV production
WORKDIR /dist
EXPOSE 6769
COPY --from=combined /src/Server /dist
CMD node index.js