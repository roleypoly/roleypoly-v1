#!/bin/sh

docker-compose up -d 

pushd Server
yarn
yarn dev

popd

pushd UI
yarn
yarn start
popd