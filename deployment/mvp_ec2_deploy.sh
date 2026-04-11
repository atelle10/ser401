#!/bin/bash
set -e

REPO_URL="https://github.com/atelle10/ser401.git"
BRANCH="staging"
DEPLOY_DIR="/opt/famar"

echo "Starting EC2 famar deployment..."

echo "Installing Docker..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "Cloning repo..."
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR
git clone -b $BRANCH $REPO_URL $DEPLOY_DIR

cd $DEPLOY_DIR/deployment

if [ ! -f .env ]; then
    echo "No .env found. Copy .env.example to .env and fill it out first!!"
    exit 1
fi

echo "Starting containers..."
sudo docker compose up -d --build

echo "Done. App on port 3000"
