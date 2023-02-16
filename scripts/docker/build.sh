#!/bin/sh

set -e

if [ -z "$1" ]; then
    _traceo_tag="latest"
else
    _traceo_tag=$1
fi

echo "Building image piotrszewczyk/traceo:$_traceo_tag"

# build everything 

docker build -t piotrszewczyk/traceo:$_traceo_tag -t piotrszewczyk/traceo:latest .