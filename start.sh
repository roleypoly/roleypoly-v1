#!/bin/sh

docker-compose up -d 

cd Server
yarn
yarn dev

cd ..

cd UI
yarn
yarn start