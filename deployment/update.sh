#!/bin/bash

# CloudLead Update Script
# This script updates the deployed applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/cloudlead"
APP_USER="cloudlead"

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "${BLUE}🔄 Starting CloudLead Update${NC}"

# Check if running as correct user
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root."
   exit 1
fi

# Stop PM2 applications
print_status "Stopping PM2 applications..."
pm2 stop cloudlead-api
pm2 stop cloudlead-web
pm2 stop cloudlead-admin

# Backup current deployment
print_status "Creating backup..."
BACKUP_DIR="/opt/cloudlead-backup-$(date +%Y%m%d-%H%M%S)"
sudo cp -r $APP_DIR $BACKUP_DIR
print_status "Backup created at $BACKUP_DIR"

# Update application code
print_status "Updating application code..."
if [ -d "web-app" ] && [ -d "ADMIN_DASHBOARD" ] && [ -d "APP_API" ]; then
    # Copy new code
    sudo rm -rf $APP_DIR/web-app
    sudo rm -rf $APP_DIR/ADMIN_DASHBOARD
    sudo rm -rf $APP_DIR/APP_API
    
    cp -r web-app $APP_DIR/
    cp -r ADMIN_DASHBOARD $APP_DIR/
    cp -r APP_API $APP_DIR/
    
    # Restore environment files
    if [ -f "$BACKUP_DIR/web-app/.env.local" ]; then
        cp $BACKUP_DIR/web-app/.env.local $APP_DIR/web-app/
    fi
    if [ -f "$BACKUP_DIR/ADMIN_DASHBOARD/.env.local" ]; then
        cp $BACKUP_DIR/ADMIN_DASHBOARD/.env.local $APP_DIR/ADMIN_DASHBOARD/
    fi
    if [ -f "$BACKUP_DIR/APP_API/.env" ]; then
        cp $BACKUP_DIR/APP_API/.env $APP_DIR/APP_API/
    fi
    
    print_status "Application code updated"
else
    print_error "Application directories not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies and build
print_status "Installing dependencies and building applications..."

# Web App
cd $APP_DIR/web-app
pnpm install
pnpm build

# Admin Dashboard
cd $APP_DIR/ADMIN_DASHBOARD
pnpm install
pnpm build

# APP_API
cd $APP_DIR/APP_API
npm install
npm run build

# Update database schema if needed
print_status "Updating database schema..."
npx prisma generate
npx prisma db push

# Set proper permissions
sudo chown -R $APP_USER:$APP_USER $APP_DIR

# Start PM2 applications
print_status "Starting PM2 applications..."

# Start API
cd $APP_DIR/APP_API
pm2 start npm --name "cloudlead-api" -- run start

# Start Web App
cd $APP_DIR/web-app
pm2 start npm --name "cloudlead-web" -- run start

# Start Admin Dashboard
cd $APP_DIR/ADMIN_DASHBOARD
pm2 start npm --name "cloudlead-admin" -- run start

pm2 save

# Wait for applications to start
sleep 15

# Check PM2 status
print_status "Checking PM2 status..."
pm2 status
pm2 logs --lines 5

echo -e "${GREEN}🎉 Update completed successfully!${NC}"
echo -e "${YELLOW}Backup location: $BACKUP_DIR${NC}"
