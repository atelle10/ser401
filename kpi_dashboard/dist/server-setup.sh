#!/bin/bash
# KPI Dashboard Server Setup Script
# Run this on the server to start the dashboard

set -e

echo "KPI Dashboard Setup"
echo "==================="
echo ""

# Check if Docker is running
if ! sudo docker ps > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    echo "Start Docker with: sudo systemctl start docker"
    exit 1
fi

# Navigate to deployment directory
cd ~/kpi-dashboard-frontend

echo "Starting KPI Dashboard container..."
sudo docker-compose up -d

echo ""
echo "Waiting for container to start..."
sleep 5

# Check container status
if sudo docker ps | grep -q kpi-dashboard; then
    echo "Success! Container is running"
    echo ""
    echo "Access dashboard at:"
    echo "  Local: http://localhost:8090"
    echo "  Server: http://100.85.239.76:8090"
    echo ""
    echo "Check health: curl http://localhost:8090/health"
    echo "View logs: sudo docker-compose logs -f"
    echo ""
    echo "Next step: Configure Cloudflare tunnel for public access"
else
    echo "Error: Container failed to start"
    echo "Check logs with: sudo docker-compose logs"
    exit 1
fi
