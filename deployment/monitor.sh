#!/bin/bash

# CloudLead Monitoring Script
# This script monitors the health of all services and applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/cloudlead"
DOMAIN_NAME="${DOMAIN_NAME:-your-domain.com}"

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo -e "${BLUE}📊 CloudLead System Monitoring${NC}"
echo -e "${YELLOW}Timestamp: $(date)${NC}"
echo ""

# Check system resources
print_info "System Resources:"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo ""

# Check services
print_info "Service Status:"
services=("mysql" "nginx")

for service in "${services[@]}"; do
    if sudo systemctl is-active --quiet $service; then
        print_status "$service is running"
    else
        print_error "$service is not running"
    fi
done

# Check PM2 applications
print_info "PM2 Application Status:"
pm2_apps=("cloudlead-api" "cloudlead-web" "cloudlead-admin")
for app in "${pm2_apps[@]}"; do
    if pm2 describe $app > /dev/null 2>&1 && pm2 describe $app | grep -q "online"; then
        print_status "$app is running"
    else
        print_error "$app is not running"
    fi
done
echo ""

# Check application health
print_info "Application Health:"

# Check web app
if curl -s -f "https://$DOMAIN_NAME" > /dev/null; then
    print_status "Web App is responding"
else
    print_error "Web App is not responding"
fi

# Check admin dashboard
if curl -s -f "https://admin.$DOMAIN_NAME" > /dev/null; then
    print_status "Admin Dashboard is responding"
else
    print_error "Admin Dashboard is not responding"
fi

# Check API
if curl -s -f "https://api.$DOMAIN_NAME" > /dev/null; then
    print_status "API is responding"
else
    print_error "API is not responding"
fi
echo ""

# Check SSL certificates
print_info "SSL Certificate Status:"
domains=("$DOMAIN_NAME" "admin.$DOMAIN_NAME" "api.$DOMAIN_NAME")

for domain in "${domains[@]}"; do
    if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
        expiry_date=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$domain/fullchain.pem" | cut -d= -f2)
        expiry_timestamp=$(date -d "$expiry_date" +%s)
        current_timestamp=$(date +%s)
        days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ $days_until_expiry -gt 30 ]; then
            print_status "$domain SSL certificate expires in $days_until_expiry days"
        elif [ $days_until_expiry -gt 7 ]; then
            print_warning "$domain SSL certificate expires in $days_until_expiry days"
        else
            print_error "$domain SSL certificate expires in $days_until_expiry days"
        fi
    else
        print_error "$domain SSL certificate not found"
    fi
done
echo ""

# Check database
print_info "Database Status:"
if mysql -u cloudlead_user -p$(grep DB_PASSWORD $APP_DIR/APP_API/.env | cut -d= -f2) -e "SELECT 1;" > /dev/null 2>&1; then
    print_status "Database is accessible"
    
    # Check database size
    db_size=$(mysql -u cloudlead_user -p$(grep DB_PASSWORD $APP_DIR/APP_API/.env | cut -d= -f2) -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema='cloudlead';" -s -N)
    echo "Database size: ${db_size}MB"
else
    print_error "Database is not accessible"
fi
echo ""

# Check disk space
print_info "Disk Space:"
df -h | grep -E "(Filesystem|/dev/)" | while read line; do
    echo "$line"
done
echo ""

# Check recent logs
print_info "Recent Error Logs (last 10 lines):"
echo "PM2 Application Logs:"
pm2 logs --lines 10 --err

# Check nginx error logs
if [ -f "/var/log/nginx/error.log" ]; then
    echo "Nginx Error Logs:"
    sudo tail -10 /var/log/nginx/error.log | grep -i error || echo "No recent errors"
fi
echo ""

# Check file upload directory
print_info "File Upload Directory:"
if [ -d "$APP_DIR/APP_API/uploads" ]; then
    upload_count=$(find "$APP_DIR/APP_API/uploads" -type f | wc -l)
    upload_size=$(du -sh "$APP_DIR/APP_API/uploads" | cut -f1)
    print_status "Upload directory: $upload_count files, $upload_size"
else
    print_error "Upload directory not found"
fi
echo ""

# Check cron jobs
print_info "SSL Renewal Cron Job:"
if crontab -l 2>/dev/null | grep -q "certbot renew"; then
    print_status "SSL renewal cron job is configured"
else
    print_warning "SSL renewal cron job not found"
fi
echo ""

# Summary
print_info "Monitoring Summary:"
echo "All systems operational: $(if curl -s -f "https://$DOMAIN_NAME" > /dev/null && curl -s -f "https://admin.$DOMAIN_NAME" > /dev/null && curl -s -f "https://api.$DOMAIN_NAME" > /dev/null; then echo "Yes"; else echo "No"; fi)"
echo "System services running: $(systemctl is-active mysql nginx | grep -c "active")/2"
echo "PM2 applications running: $(pm2 status --no-colors | grep -E "(cloudlead-api|cloudlead-web|cloudlead-admin)" | grep -c "online")/3"
echo "SSL certificates: $(ls /etc/letsencrypt/live/ | wc -l) domains configured"

echo -e "${GREEN}🎉 Monitoring completed!${NC}"
