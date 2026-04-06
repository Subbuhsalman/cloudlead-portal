# CloudLead Deployment Scripts

This directory contains deployment scripts for the CloudLead application suite on Ubuntu 24.04 LTS.

## Scripts Overview

### 1. `deploy.sh` - Main Deployment Script
Complete deployment script that sets up the entire CloudLead environment.

**Features:**
- Installs nginx, MySQL, nvm, pnpm, PM2
- Sets up SSL certificates with Let's Encrypt
- Configures proxy pass for all applications
- Starts applications with simple PM2 commands
- Sets up automatic SSL renewal
- Configures environment variables
- Builds and starts all applications

**Usage:**
```bash
# Set your domain and email
export DOMAIN_NAME=yourdomain.com
export EMAIL=your-email@yourdomain.com

# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### 2. `update.sh` - Application Update Script
Updates the deployed applications with new code.

**Features:**
- Creates backup before update
- Updates application code
- Rebuilds applications
- Updates database schema
- Restarts services

**Usage:**
```bash
chmod +x update.sh
./update.sh
```

### 3. `backup.sh` - Backup Script
Creates comprehensive backups of the entire system.

**Features:**
- Backs up application files
- Backs up database
- Backs up nginx configuration
- Backs up SSL certificates
- Backs up systemd services
- Creates compressed archives
- Cleans up old backups

**Usage:**
```bash
chmod +x backup.sh
./backup.sh
```

### 4. `monitor.sh` - System Monitoring Script
Monitors the health of all services and applications.

**Features:**
- Checks system resources
- Monitors service status
- Tests application endpoints
- Checks SSL certificate expiry
- Monitors database health
- Shows recent error logs
- Provides system summary

**Usage:**
```bash
chmod +x monitor.sh
./monitor.sh
```

### 5. `pm2-manage.sh` - PM2 Management Script
Easy management of PM2 applications.

**Features:**
- Start/stop/restart applications
- View logs and status
- Zero-downtime reloads
- PM2 monitoring dashboard
- Configuration management

**Usage:**
```bash
chmod +x pm2-manage.sh
./pm2-manage.sh [start|stop|restart|reload|status|logs|monitor|info]
```

## Prerequisites

### Server Requirements
- Ubuntu 24.04 LTS
- Minimum 2GB RAM
- Minimum 20GB disk space
- Root or sudo access
- Domain name pointing to server

### DNS Configuration
Before running the deployment script, ensure your DNS records are configured:

```
A    yourdomain.com        -> YOUR_SERVER_IP
A    admin.yourdomain.com  -> YOUR_SERVER_IP
A    api.yourdomain.com    -> YOUR_SERVER_IP
```

## Deployment Process

### 1. Initial Setup
```bash
# Clone your repository
git clone <your-repo-url>
cd cloudlead

# Set environment variables
export DOMAIN_NAME=yourdomain.com
export EMAIL=your-email@yourdomain.com

# Run deployment
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

### 2. Post-Deployment Configuration

#### Update SMTP Settings
Edit the API environment file:
```bash
sudo nano /opt/cloudlead/APP_API/.env
```

Update the SMTP configuration:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME="CloudLead File Processing"
```

#### Restart API Service
```bash
sudo systemctl restart cloudlead-api
```

### 3. Verification
```bash
# Check all services
sudo systemctl status cloudlead-*

# Test applications
curl -I https://yourdomain.com
curl -I https://admin.yourdomain.com
curl -I https://api.yourdomain.com

# Run monitoring script
./deployment/monitor.sh
```

## Application URLs

After successful deployment:
- **Web App**: https://yourdomain.com
- **Admin Dashboard**: https://admin.yourdomain.com
- **API**: https://api.yourdomain.com

## File Structure

```
/opt/cloudlead/
├── web-app/                 # Next.js web application
├── ADMIN_DASHBOARD/         # Next.js admin dashboard
├── APP_API/                 # Node.js API server
├── deployment-info.txt      # Deployment information
└── .env files              # Environment configurations

/etc/nginx/sites-available/
└── cloudlead               # Nginx configuration

~/.pm2/
├── dump.pm2               # PM2 process dump
└── logs/                  # PM2 application logs

/etc/letsencrypt/live/
├── yourdomain.com/         # SSL certificates
├── admin.yourdomain.com/
└── api.yourdomain.com/
```

## Security Features

### SSL/TLS
- Automatic SSL certificate generation with Let's Encrypt
- Automatic renewal via cron job
- HTTP to HTTPS redirects
- Security headers configuration

### Rate Limiting
- API rate limiting (10 requests/second)
- Upload rate limiting (5 requests/second)
- Burst handling for legitimate traffic

### File Security
- File type validation
- Size limitations (50MB)
- Secure file storage
- Access controls

## Monitoring and Maintenance

### Regular Tasks
```bash
# Check system status
./deployment/monitor.sh

# Create backups
./deployment/backup.sh

# Update applications
./deployment/update.sh
```

### Log Locations
- **API Logs**: `/opt/cloudlead/APP_API/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `journalctl -u cloudlead-*`

### Service Management
```bash
# Using PM2 management script
./deployment/pm2-manage.sh start      # Start all applications
./deployment/pm2-manage.sh stop       # Stop all applications
./deployment/pm2-manage.sh restart    # Restart all applications
./deployment/pm2-manage.sh reload     # Zero-downtime reload
./deployment/pm2-manage.sh status     # Check status
./deployment/pm2-manage.sh logs       # View logs
./deployment/pm2-manage.sh monitor    # PM2 dashboard

# Direct PM2 commands
pm2 start npm --name "cloudlead-api" -- run start    # Start API
pm2 start npm --name "cloudlead-web" -- run start    # Start Web App
pm2 start npm --name "cloudlead-admin" -- run start  # Start Admin Dashboard
pm2 stop all                          # Stop all applications
pm2 restart all                       # Restart all applications
pm2 reload all                        # Zero-downtime reload
pm2 status                            # Check status
pm2 logs                              # View logs
pm2 monit                             # Monitoring dashboard
```

## Troubleshooting

### Common Issues

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

#### Service Not Starting
```bash
# Check PM2 logs
pm2 logs cloudlead-api
pm2 logs cloudlead-web
pm2 logs cloudlead-admin

# Check PM2 status
pm2 status
pm2 describe cloudlead-api

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### Database Connection Issues
```bash
# Test database connection
mysql -u cloudlead_user -p

# Check database status
sudo systemctl status mysql
```

### Recovery Procedures

#### Restore from Backup
```bash
# Extract backup
cd /opt/cloudlead-backups
tar -xzf cloudlead-backup-YYYYMMDD-HHMMSS.tar.gz

# Follow restore instructions in backup-info.txt
```

#### Rebuild Applications
```bash
# Stop PM2 applications
pm2 stop all

# Rebuild
cd /opt/cloudlead-webportal/web-app && pnpm build
cd /opt/cloudlead-webportal/ADMIN_DASHBOARD && pnpm build
cd /opt/cloudlead-webportal/APP_API && npm run build

# Start applications
cd /opt/cloudlead-webportal/APP_API && pm2 start npm --name "cloudlead-api" -- run start
cd /opt/cloudlead-webportal/web-app && pm2 start npm --name "cloudlead-web" -- run start
cd /opt/cloudlead-webportal/ADMIN_DASHBOARD && pm2 start npm --name "cloudlead-admin" -- run start
```

## Support

For issues or questions:
1. Check the monitoring script output
2. Review application logs
3. Verify DNS configuration
4. Check SSL certificate status
5. Ensure all services are running

## License

This deployment system is part of the CloudLead application suite.
