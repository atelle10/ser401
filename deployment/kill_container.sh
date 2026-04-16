#!/bin/bash

echo "Stopping all MVP containers..."
sudo docker compose down

if [ "$1" = "--wipe" ]; then
    echo "Removing volumes..."
    sudo docker volume rm famar-system_postgres_data
fi

echo "Done."
