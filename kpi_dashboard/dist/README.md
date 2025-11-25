# KPI Dashboard

## Quick Start

### Start Dashboard
```bash
./start-dashboard.sh
```

This will:
1. Start the Docker container on port 8090
2. Create an ngrok tunnel for public access
3. Display both local and public URLs

### Stop Dashboard
```bash
./stop-dashboard.sh
```

---

## Manual Commands

### Start Container Only
```bash
sudo docker compose up -d
```

### View Logs
```bash
sudo docker logs kpi-dashboard -f
```

### Restart Container
```bash
sudo docker compose restart
```

### Stop Container
```bash
sudo docker compose down
```

---

## Access

- **Local:** http://localhost:8090
- **Public:** Check ngrok URL after running `start-dashboard.sh`
- **ngrok Dashboard:** http://localhost:4040

---

## Troubleshooting

### Dashboard not accessible
```bash
# Check if container is running
sudo docker ps | grep kpi-dashboard

# Check container logs
sudo docker logs kpi-dashboard

# Restart container
sudo docker compose restart
```

### ngrok not working
```bash
# Check if ngrok is running
ps aux | grep ngrok

# Check ngrok logs
cat /tmp/ngrok.log

# Restart ngrok
pkill -f "ngrok http"
nohup /home/zachsplat/ngrok http 8090 > /tmp/ngrok.log 2>&1 &
```

### Port 8090 already in use
```bash
# Find what's using port 8090
sudo netstat -tulpn | grep 8090

# Or use lsof
sudo lsof -i :8090
```

---

## Files

- `index.html` - Main HTML file
- `assets/` - Static assets (JS, CSS, images)
- `nginx.conf` - Nginx configuration
- `docker-compose.yml` - Docker Compose configuration
- `start-dashboard.sh` - Start script
- `stop-dashboard.sh` - Stop script

---

## Docker Image

The dashboard uses the `kpi-dashboard:latest` image which contains:
- Nginx web server
- Static files (HTML, JS, CSS)
- Health check endpoint

To rebuild the image (if needed):
```bash
# You'll need a Dockerfile for this
sudo docker build -t kpi-dashboard:latest .
```
