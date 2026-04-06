#!/bin/bash

# CloudLead PM2 Management Script
# This script provides easy management of PM2 applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/cloudlead-webportal"

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

show_help() {
    echo -e "${BLUE}CloudLead PM2 Management Script${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all applications"
    echo "  stop        Stop all applications"
    echo "  restart     Restart all applications"
    echo "  reload      Reload all applications (zero-downtime)"
    echo "  status      Show status of all applications"
    echo "  logs        Show logs for all applications"
    echo "  logs-api    Show logs for API only"
    echo "  logs-web    Show logs for Web App only"
    echo "  logs-admin  Show logs for Admin Dashboard only"
    echo "  monitor     Show PM2 monitoring dashboard"
    echo "  save        Save current PM2 configuration"
    echo "  delete      Delete all applications from PM2"
    echo "  info        Show detailed information about applications"
    echo "  help        Show this help message"
    echo ""
}

start_apps() {
    print_status "Starting all CloudLead applications..."
    
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
    print_status "All applications started successfully!"
}

stop_apps() {
    print_status "Stopping all CloudLead applications..."
    pm2 stop cloudlead-api cloudlead-web cloudlead-admin
    print_status "All applications stopped successfully!"
}

restart_apps() {
    print_status "Restarting all CloudLead applications..."
    pm2 restart cloudlead-api cloudlead-web cloudlead-admin
    print_status "All applications restarted successfully!"
}

reload_apps() {
    print_status "Reloading all CloudLead applications (zero-downtime)..."
    pm2 reload cloudlead-api cloudlead-web cloudlead-admin
    print_status "All applications reloaded successfully!"
}

show_status() {
    print_info "CloudLead Application Status:"
    pm2 status
    echo ""
    print_info "Application Details:"
    pm2 describe cloudlead-api
    pm2 describe cloudlead-web
    pm2 describe cloudlead-admin
}

show_logs() {
    print_info "Showing logs for all applications (last 50 lines):"
    pm2 logs --lines 50
}

show_logs_api() {
    print_info "Showing API logs (last 50 lines):"
    pm2 logs cloudlead-api --lines 50
}

show_logs_web() {
    print_info "Showing Web App logs (last 50 lines):"
    pm2 logs cloudlead-web --lines 50
}

show_logs_admin() {
    print_info "Showing Admin Dashboard logs (last 50 lines):"
    pm2 logs cloudlead-admin --lines 50
}

show_monitor() {
    print_info "Opening PM2 monitoring dashboard..."
    pm2 monit
}

save_config() {
    print_status "Saving PM2 configuration..."
    pm2 save
    print_status "PM2 configuration saved successfully!"
}

delete_apps() {
    print_warning "This will delete all CloudLead applications from PM2!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deleting all CloudLead applications..."
        pm2 delete cloudlead-api cloudlead-web cloudlead-admin
        print_status "All applications deleted successfully!"
    else
        print_info "Operation cancelled."
    fi
}

show_info() {
    print_info "CloudLead Application Information:"
    echo ""
    echo "Application URLs:"
    echo "- Web App: https://$(grep DOMAIN_NAME $APP_DIR/APP_API/.env 2>/dev/null | cut -d= -f2 || echo 'yourdomain.com')"
    echo "- Admin Dashboard: https://admin.$(grep DOMAIN_NAME $APP_DIR/APP_API/.env 2>/dev/null | cut -d= -f2 || echo 'yourdomain.com')"
    echo "- API: https://api.$(grep DOMAIN_NAME $APP_DIR/APP_API/.env 2>/dev/null | cut -d= -f2 || echo 'yourdomain.com')"
    echo ""
    echo "Application Directories:"
    echo "- API: $APP_DIR/APP_API"
    echo "- Web App: $APP_DIR/web-app"
    echo "- Admin Dashboard: $APP_DIR/ADMIN_DASHBOARD"
    echo ""
    echo "Log Directories:"
    echo "- API Logs: $APP_DIR/APP_API/logs/"
    echo "- Web App Logs: $APP_DIR/web-app/logs/"
    echo "- Admin Dashboard Logs: $APP_DIR/ADMIN_DASHBOARD/logs/"
    echo ""
    echo "PM2 Configuration:"
    echo "- PM2 Home: ~/.pm2"
    echo "- Process Names: cloudlead-api, cloudlead-web, cloudlead-admin"
    echo ""
    pm2 info cloudlead-api
    pm2 info cloudlead-web
    pm2 info cloudlead-admin
}

# Main script logic
case "${1:-help}" in
    start)
        start_apps
        ;;
    stop)
        stop_apps
        ;;
    restart)
        restart_apps
        ;;
    reload)
        reload_apps
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    logs-api)
        show_logs_api
        ;;
    logs-web)
        show_logs_web
        ;;
    logs-admin)
        show_logs_admin
        ;;
    monitor)
        show_monitor
        ;;
    save)
        save_config
        ;;
    delete)
        delete_apps
        ;;
    info)
        show_info
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
