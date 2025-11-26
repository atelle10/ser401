# KPI Dashboard - Access Information

**Last Updated:** November 24, 2025

---

## ✅ Dashboard is Live

### Local Access
- **URL:** http://localhost:8090
- **Status:** Running in Docker container `kpi-dashboard`

### Public Access (ngrok)
- **URL:** https://luciano-nonindictable-aretha.ngrok-free.dev
- **Auth Token:** Configured (35u0JI0nbNbnji868pj71Sz3kh1_3MC4Kv2BXjAZwyLSADu8E)
- **Status:** Online

### Management
- **ngrok Dashboard:** http://localhost:4040
- **Docker Container:** `kpi-dashboard`

---

## Quick Commands

### Start Everything
```bash
cd ~/kpi-dashboard-frontend
./start-dashboard.sh
```

### Stop Everything
```bash
./stop-dashboard.sh
```

### Check Status
```bash
# Check Docker container
sudo docker ps | grep kpi-dashboard

# Check ngrok tunnel
curl -s http://localhost:4040/api/tunnels | python3 -m json.tool

# Test local access
curl http://localhost:8090
```

### View Logs
```bash
# Dashboard logs
sudo docker logs kpi-dashboard -f

# ngrok logs
cat /tmp/ngrok.log
```

---

## Troubleshooting

### "Endpoint is offline" Error

If you see `ERR_NGROK_3200` or "endpoint is offline":

1. **Check if ngrok is running:**
   ```bash
   ps aux | grep ngrok
   ```

2. **Check if dashboard is running:**
   ```bash
   curl http://localhost:8090
   ```

3. **Restart everything:**
   ```bash
   ./stop-dashboard.sh
   ./start-dashboard.sh
   ```

### ngrok URL Changed

ngrok free tier generates random URLs that change on restart. Your current URL is:
- https://luciano-nonindictable-aretha.ngrok-free.dev

To get a static domain, upgrade to ngrok paid plan.

### Auth Token Issues

If ngrok shows auth errors:
```bash
/home/zachsplat/ngrok authtoken 35u0JI0nbNbnji868pj71Sz3kh1_3MC4Kv2BXjAZwyLSADu8E
```

---

## System Architecture

```
Internet
    ↓
ngrok (https://luciano-nonindictable-aretha.ngrok-free.dev)
    ↓
localhost:8090
    ↓
Docker Container (kpi-dashboard)
    ↓
nginx serving static files
```

---

## Files

- `index.html` - Main dashboard HTML
- `assets/` - JavaScript, CSS, images
- `docker-compose.yml` - Container configuration
- `nginx.conf` - Web server configuration
- `start-dashboard.sh` - Start script
- `stop-dashboard.sh` - Stop script
- `README.md` - Full documentation
- `DASHBOARD_INFO.md` - This file

---

## Notes

- Dashboard runs in Docker for easy management and portability
- ngrok provides secure public access without port forwarding
- Auth token is saved in `~/.config/ngrok/ngrok.yml`
- Logs are saved to `/tmp/ngrok.log`
