#!/bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD | tr '/' '_')

docker build -t "katie/roleypoly:$GIT_BRANCH" .
docker build -f bot.Dockerfile -t "katie/roleypoly:$GIT_BRANCH-bot" .