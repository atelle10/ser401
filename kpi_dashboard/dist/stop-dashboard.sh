#!/bin/bash
# Stop KPI Dashboard and ngrok tunnel

echo "Stopping KPI Dashboard..."

# Stop ngrok
pkill -f "ngrok http" 2>/dev/null && echo "✓ Stopped ngrok" || echo "ℹ ngrok not running"

# Stop Docker container
cd /home/zachsplat/kpi-dashboard-frontend
sudo docker compose down && echo "✓ Stopped Docker container" || echo "✗ Failed to stop container"

echo ""
echo "Dashboard stopped."
