# Dashboard Restore Instructions

## Quick Restore from Backup

If you accidentally deploy a bad build, restore the working version:

### Method 1: Restore from Backup Archive

```bash
cd ~
# Find the latest backup
ls -lht kpi-dashboard-working-backup-*.tar.gz | head -1

# Extract backup (replace with actual filename)
cd ~/kpi-dashboard-frontend
tar -xzf ../kpi-dashboard-working-backup-YYYYMMDD-HHMMSS.tar.gz

# Rebuild and restart
sudo docker build -t kpi-dashboard:latest .
sudo docker compose down && sudo docker compose up -d
```

### Method 2: Manual Restore (Working Version Details)

The working version uses these specific files:

**index.html:**
- JavaScript: `/assets/index-KiZo7epi.js`
- CSS: `/assets/index-BIZZkbZt.css`
- Favicon: `/assets/famar_logo-c9zNb1rQ.png`

**Required Assets:**
```
assets/
├── index-KiZo7epi.js         # Main JavaScript bundle
├── index-BIZZkbZt.css        # Main stylesheet
├── famar_logo-c9zNb1rQ.png   # Logo
├── login_logo-CBJo0P-m.png   # Login logo
├── fire icon-x7e10hHt.png    # Fire icon
├── medical icon-RldRuvTK.png # Medical icon
├── account.png               # Account icon
├── account_icon.png          # Account icon variant
├── dashboard_icon.png        # Dashboard icon
├── settings_icon.png         # Settings icon
├── white fire icon.png       # White fire icon
├── white medical icon.png    # White medical icon
└── ... (other images)
```

## Before Deploying New Build

**ALWAYS create a backup first:**

```bash
cd ~/kpi-dashboard-frontend
tar -czf ../kpi-dashboard-backup-$(date +%Y%m%d-%H%M%S).tar.gz .
```

## Safe Deployment Process

1. **Backup current working version:**
   ```bash
   cd ~/kpi-dashboard-frontend
   tar -czf ../kpi-dashboard-backup-$(date +%Y%m%d-%H%M%S).tar.gz .
   ```

2. **Copy new build files:**
   ```bash
   cp -r ~/ser401/kpi_dashboard/dist/* .
   ```

3. **Test locally first:**
   ```bash
   # Check if index.html references exist
   cat index.html
   
   # Verify asset files exist
   ls -la assets/
   ```

4. **Build and deploy:**
   ```bash
   sudo docker build -t kpi-dashboard:latest .
   sudo docker compose down && sudo docker compose up -d
   ```

5. **Verify it works:**
   ```bash
   # Test locally
   curl http://localhost:8090
   
   # Check for errors
   sudo docker logs kpi-dashboard
   
   # Test in browser
   # Visit: https://luciano-nonindictable-aretha.ngrok-free.dev
   ```

6. **If broken, restore backup:**
   ```bash
   cd ~/kpi-dashboard-frontend
   rm -rf *
   tar -xzf ../kpi-dashboard-backup-YYYYMMDD-HHMMSS.tar.gz
   sudo docker build -t kpi-dashboard:latest .
   sudo docker compose down && sudo docker compose up -d
   ```

## Common Issues After Bad Deploy

### JavaScript/CSS files not found (404)
**Symptom:** Blank page, console errors about missing .js or .css files

**Fix:**
1. Check `index.html` - verify the asset filenames match actual files
2. Restore from backup if needed

### Images not showing
**Symptom:** Dashboard loads but images are broken

**Fix:**
1. Verify images exist in `assets/` folder
2. Check Docker container: `sudo docker exec kpi-dashboard ls -la /usr/share/nginx/html/assets/`
3. Rebuild if needed

### Completely broken
**Symptom:** Nothing works, errors everywhere

**Fix:**
```bash
cd ~/kpi-dashboard-frontend
rm -rf *
tar -xzf ../kpi-dashboard-working-backup-*.tar.gz
sudo docker build -t kpi-dashboard:latest .
sudo docker compose down && sudo docker compose up -d
```

## Backup Locations

Backups are stored in `/home/zachsplat/` with naming pattern:
- `kpi-dashboard-working-backup-YYYYMMDD-HHMMSS.tar.gz`
- `kpi-dashboard-backup-YYYYMMDD-HHMMSS.tar.gz`

Keep at least 3 most recent backups.

## Emergency Restore Command

One-liner to restore latest backup:

```bash
cd ~/kpi-dashboard-frontend && \
rm -rf * && \
tar -xzf $(ls -t ~/kpi-dashboard-*backup*.tar.gz | head -1) && \
sudo docker build -t kpi-dashboard:latest . && \
sudo docker compose down && sudo docker compose up -d
```

## Prevention

1. **Always backup before deploying**
2. **Test builds locally before deploying**
3. **Keep multiple backup versions**
4. **Document what changed in each deployment**
