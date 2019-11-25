#!/usr/bin/env bash

set -e
echo hello
mkdir -p screenshots
mkdir -p trace
rm -rf *.db  
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install
node index.js&
node_modules/.bin/jest --runInBand --detectOpenHandles acceptance\ tests/*
#node_modules/.bin/jest --runInBand --detectOpenHandles acceptance\ tests/accountUI.js
read -p "Press enter to continue"
kill %1

