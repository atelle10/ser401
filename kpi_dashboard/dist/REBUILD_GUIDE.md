# Dashboard Rebuild Guide

## When to Rebuild

Rebuild the Docker image when you:
- Update the dashboard code
- Add/change images
- Modify nginx configuration
- Update any static files

## Quick Rebuild

```bash
cd ~/kpi-dashboard-frontend

# 1. Copy new files from source (if needed)
cp -r ~/ser401/kpi_dashboard/dist/* .

# 2. Rebuild Docker image
sudo docker build -t kpi-dashboard:latest .

# 3. Restart container
sudo docker compose down
sudo docker compose up -d
```

## Full Deployment Process

### 1. Build Your React App
```bash
cd ~/ser401/kpi_dashboard
npm run build
```

### 2. Copy Build Files
```bash
# Copy everything to deployment folder
cp -r dist/* ~/kpi-dashboard-frontend/

# Or copy specific items:
cp dist/index.html ~/kpi-dashboard-frontend/
cp -r dist/assets/* ~/kpi-dashboard-frontend/assets/
```

### 3. Rebuild Docker Image
```bash
cd ~/kpi-dashboard-frontend
sudo docker build -t kpi-dashboard:latest .
```

### 4. Restart Container
```bash
sudo docker compose down
sudo docker compose up -d
```

### 5. Verify
```bash
# Check container is running
sudo docker ps | grep kpi-dashboard

# Test locally
curl http://localhost:8090

# Check logs
sudo docker logs kpi-dashboard
```

## Image Path Fix

The dashboard looks for images in two locations:
1. `/assets/` - For bundled assets (with hashed names)
2. `/src/Components/assets/` - For component images

The Dockerfile copies assets to both locations to ensure all images load correctly.

## Troubleshooting

### Images not showing
```bash
# Check if images exist in container
sudo docker exec kpi-dashboard ls -la /usr/share/nginx/html/assets/
sudo docker exec kpi-dashboard ls -la /usr/share/nginx/html/src/Components/assets/

# If missing, rebuild image
sudo docker build -t kpi-dashboard:latest .
sudo docker compose restart
```

### Container won't start
```bash
# Check logs
sudo docker logs kpi-dashboard

# Verify image exists
sudo docker images | grep kpi-dashboard

# Rebuild if needed
sudo docker build -t kpi-dashboard:latest .
```

### Changes not appearing
```bash
# Force rebuild without cache
sudo docker build --no-cache -t kpi-dashboard:latest .

# Remove old container and start fresh
sudo docker compose down
sudo docker compose up -d
```

## Files Structure

```
kpi-dashboard-frontend/
├── index.html              # Main HTML file
├── vite.svg               # Vite logo
├── assets/                # Static assets
│   ├── *.png             # Images
│   ├── *.js              # JavaScript bundles
│   └── *.css             # Stylesheets
├── nginx.conf            # Nginx configuration
├── Dockerfile            # Docker build instructions
├── docker-compose.yml    # Container orchestration
└── start-dashboard.sh    # Startup script
```

## Notes

- Always rebuild the image after changing files
- The container serves files from `/usr/share/nginx/html/`
- Images are copied to both `/assets/` and `/src/Components/assets/`
- Port 8090 is exposed for local and ngrok access
