#!/bin/bash
#
# This shell script builds docker images and drops them into the k3s container
# TODO: automatically update k8s manifest image versions
#
set -euxo pipefail

if [ -z "$1" ]; then
    echo "Usage: $0 <version_string>"
    exit 1
fi

version=$1

cd frontend
docker build -t frontend:$version ./frontend

cd ../backend
docker build -t backend:$version ./backend
docker save frontend:$version | k3s ctr images import -
docker save backend:$version | k3s ctr images import -
