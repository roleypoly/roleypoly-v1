#!/bin/sh

docker-compose up -d 

pushd Server
npm ci
yarn dev

popd

pushd UI
npm ci
yarn start
popd