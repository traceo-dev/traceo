#!/bin/sh

set -e

if [ -z "$1" ]; then
    _traceo_tag="latest"
else
    _traceo_tag=$1
fi

echo "Pushing image piotrszewczyk/traceo:$_traceo_tag to Docker Hub"

docker push piotrszewczyk/traceo:$_traceo_tag .