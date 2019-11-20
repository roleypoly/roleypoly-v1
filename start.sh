#!/bin/sh

docker-compose up -d 

pushd Server
npm i
npm run dev

popd

pushd UI
npm i
npm start
popd