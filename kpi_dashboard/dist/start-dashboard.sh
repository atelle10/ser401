#!/bin/bash
# Start KPI Dashboard and ngrok tunnel

set -e

echo "=========================================="
echo "Starting KPI Dashboard"
echo "=========================================="
echo ""

# Navigate to dashboard directory
cd /home/zachsplat/kpi-dashboard-frontend

# Start Docker container
echo "Step 1: Starting Docker container..."
sudo docker compose up -d

# Wait for container to be healthy
echo "Step 2: Waiting for container to start..."
sleep 3

# Check if container is running
if sudo docker ps | grep -q "kpi-dashboard"; then
    echo "✓ Container is running"
else
    echo "✗ Container failed to start"
    sudo docker logs kpi-dashboard
    exit 1
fi

# Check if dashboard is accessible
echo "Step 3: Checking dashboard..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Dashboard is accessible at http://localhost:8090"
else
    echo "✗ Dashboard returned HTTP $HTTP_CODE"
    exit 1
fi

# Stop any existing ngrok processes
echo "Step 4: Setting up ngrok tunnel..."
pkill -f "ngrok http" 2>/dev/null || true
sleep 1

# Ensure auth token is configured
/home/zachsplat/ngrok authtoken 35u0JI0nbNbnji868pj71Sz3kh1_3MC4Kv2BXjAZwyLSADu8E > /dev/null 2>&1

# Start ngrok
nohup /home/zachsplat/ngrok http 8090 > /tmp/ngrok.log 2>&1 &
sleep 4

# Get ngrok URL
if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])" 2>/dev/null)
    echo "✓ ngrok tunnel established"
    echo ""
    echo "=========================================="
    echo "Dashboard is Live!"
    echo "=========================================="
    echo ""
    echo "Local:  http://localhost:8090"
    echo "Public: $PUBLIC_URL"
    echo ""
    echo "ngrok Web Interface: http://localhost:4040"
    echo ""
else
    echo "⚠ ngrok failed to start"
    echo "Dashboard is still accessible locally at http://localhost:8090"
fi
