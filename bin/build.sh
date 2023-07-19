#!/bin/sh

#
# Script to creating docker images. 
#
# Available commands with tags:
# 
# Production:
# sh ./build -> traceo/traceo:latest
# sh ./build 1.0.0 -> traceo/traceo:1.0.0
# sh ./build latest -> traceo/traceo:latest
# 
# Development - to own purpose or as test image in docker hub:
# sh ./build 1.0.0 --unix -> traceo/traceo:1.0.0-1689765552
# sh ./build --unix -> traceo/traceo:1689765552
#

set -e

if [ -z "$1" ]; then
    _traceo_tag="latest"
else
    _traceo_tag=$1
fi

if [ "$1" = "--unix" ]; then
    _traceo_tag="$(date +%s)"
elif [ "$2" = "--unix" ]; then
    _traceo_tag=$_traceo_tag"-$(date +%s)"
fi

echo "Building image traceo/traceo:$_traceo_tag"

docker build -t traceo/traceo:$_traceo_tag -f ../Dockerfile ../