#!/bin/sh

set -e

if [ -z "$1" ]; then
    _traceo_tag="latest"
else
    _traceo_tag=$1
fi

echo "Building image traceo/traceo:$_traceo_tag"

docker build -t traceo/traceo:$_traceo_tag -t traceo/traceo:latest .