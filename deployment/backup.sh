#!/bin/bash

# CloudLead Backup Script
# This script creates backups of the application, database, and configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/cloudlead"
BACKUP_DIR="/opt/cloudlead-backups"
DB_NAME="cloudlead"
DB_USER="cloudlead_user"

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "${BLUE}💾 Starting CloudLead Backup${NC}"

# Create backup directory
sudo mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="cloudlead-backup-$TIMESTAMP"
FULL_BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

print_status "Creating backup: $BACKUP_NAME"

# Create backup directory
sudo mkdir -p $FULL_BACKUP_PATH

# Backup application files
print_status "Backing up application files..."
sudo cp -r $APP_DIR $FULL_BACKUP_PATH/

# Backup database
print_status "Backing up database..."
sudo mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $FULL_BACKUP_PATH/database.sql

# Backup nginx configuration
print_status "Backing up nginx configuration..."
sudo cp -r /etc/nginx $FULL_BACKUP_PATH/nginx-config

# Backup SSL certificates
print_status "Backing up SSL certificates..."
sudo cp -r /etc/letsencrypt $FULL_BACKUP_PATH/ssl-certificates

# Backup PM2 configuration
print_status "Backing up PM2 configuration..."
pm2 save
cp ~/.pm2/dump.pm2 $FULL_BACKUP_PATH/ 2>/dev/null || echo "PM2 dump not found"

# Create backup info file
cat > $FULL_BACKUP_PATH/backup-info.txt << EOF
CloudLead Backup Information
===========================

Backup Date: $(date)
Backup Name: $BACKUP_NAME
Server: $(hostname)

Contents:
- Application files: $APP_DIR
- Database: $DB_NAME
- Nginx configuration: /etc/nginx
- SSL certificates: /etc/letsencrypt
- PM2 configuration: dump.pm2

Restore Instructions:
1. Stop PM2 applications: pm2 stop all
2. Restore application: sudo cp -r $FULL_BACKUP_PATH/cloudlead-webportal $APP_DIR
3. Restore database: mysql -u $DB_USER -p $DB_NAME < $FULL_BACKUP_PATH/database.sql
4. Restore nginx: sudo cp -r $FULL_BACKUP_PATH/nginx-config /etc/nginx
5. Restore SSL: sudo cp -r $FULL_BACKUP_PATH/ssl-certificates /etc/letsencrypt
6. Restore PM2 dump: cp $FULL_BACKUP_PATH/dump.pm2 ~/.pm2/
7. Start applications: pm2 resurrect
EOF

# Create compressed archive
print_status "Creating compressed archive..."
cd $BACKUP_DIR
sudo tar -czf "$BACKUP_NAME.tar.gz" $BACKUP_NAME
sudo rm -rf $BACKUP_NAME

# Set proper permissions
sudo chown $USER:$USER "$BACKUP_NAME.tar.gz"

# Clean up old backups (keep last 7 days)
print_status "Cleaning up old backups..."
find $BACKUP_DIR -name "cloudlead-backup-*.tar.gz" -mtime +7 -delete

# Show backup information
BACKUP_SIZE=$(du -h "$BACKUP_NAME.tar.gz" | cut -f1)
print_status "Backup completed successfully!"
print_status "Backup file: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
print_status "Backup size: $BACKUP_SIZE"

echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
echo -e "${YELLOW}Backup location: $BACKUP_DIR/$BACKUP_NAME.tar.gz${NC}"
echo -e "${YELLOW}Backup size: $BACKUP_SIZE${NC}"
