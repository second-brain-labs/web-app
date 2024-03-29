#!/bin/bash
set -euxo pipefail

if [ -z "${1+x}" ]; then
    echo "Usage: $0 <version_string>"
    exit 1
fi

version=${1}

cd ~/web-app
git pull --rebase --force

if [[ -n "$CHANGES_FRONTEND" ]] || [[ -n "$CHANGES_BACKEND" ]]; then
    sudo k3s ctr images prune --all
fi

cd ~/web-app/frontend
if [[ -n "$CHANGES_FRONTEND" ]]; then
    docker build -t frontend:$version .
    docker save frontend:$version | sudo k3s ctr images import -
    sed -i "s/image: frontend:.*/image: frontend:$version/g" ../k8s/frontend.yml
    kubectl apply -f ../k8s/frontend.yml

fi

cd ~/web-app/backend
if [[ -n "$CHANGES_BACKEND" ]]; then
    docker build -t backend:$version .
    docker save backend:$version | sudo k3s ctr images import -
    sed -i "s/image: backend:.*/image: backend:$version/g" ../k8s/backend.yml
    kubectl apply -f ../k8s/backend.yml
fi

cd ~/web-app
git restore k8s/
