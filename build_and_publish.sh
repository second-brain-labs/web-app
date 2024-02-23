#!/bin/bash
#
# This shell script builds docker images and drops them into the k3s container
# Current version: v2

set -euxo pipefail

if [ -z "$1" ]; then
    echo "Usage: $0 <version_string>"
    exit 1
fi

version=$1

cd frontend
docker build -t frontend:$version .

cd ../backend
docker build -t backend:$version .

sudo k3s ctr images prune --all
docker save frontend:$version | sudo k3s ctr images import -
docker save backend:$version | sudo k3s ctr images import -
