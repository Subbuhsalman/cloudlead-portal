#!/usr/bin/env bash
# CloudLead Deployment Script for Ubuntu 24.04 LTS
# Sets up nginx, MySQL, nvm, pnpm, PM2 and deploys three apps (web-app, ADMIN_DASHBOARD, APP_API)
# Safe for repeated runs (idempotent-ish)
set -euo pipefail

# ========= Colors =========
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

print_status()  { echo -e "${GREEN}✅ $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ========= Config =========
DOMAIN_NAME="${DOMAIN_NAME:-your-domain.com}"
EMAIL="${EMAIL:-you@your-domain.com}"

# App locations
APP_DIR="/opt/cloudlead-webportal"
NGINX_DIR="/etc/nginx"
SERVICE_DIR="/etc/systemd/system"

# App ports
WEB_APP_PORT=3000
ADMIN_DASHBOARD_PORT=3600
APP_API_PORT=8000

# DB config
DB_NAME="cloudlead"
DB_USER="cloudlead_user"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 32)}"   # allow override via env

# Sanity checks
if [[ "$DOMAIN_NAME" == "your-domain.com" || "$EMAIL" == "you@your-domain.com" ]]; then
  print_error "Please export DOMAIN_NAME and EMAIL before running."
  echo "  export DOMAIN_NAME=yourdomain.com"
  echo "  export EMAIL=you@yourdomain.com"
  exit 1
fi

echo -e "${BLUE}🚀 Starting CloudLead Deployment on Ubuntu 24.04 LTS${NC}"
echo -e "${YELLOW}Domain: $DOMAIN_NAME${NC}"
echo -e "${YELLOW}Email:  $EMAIL${NC}"

# ========= System prep =========
print_status "Updating system packages..."
sudo apt update && sudo apt -y upgrade

print_status "Installing essentials..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# ========= Node + pnpm + PM2 =========
print_status "Installing NVM (Node Version Manager)..."
if [[ ! -d "$HOME/.nvm" ]]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

print_status "Installing Node.js LTS via nvm..."
nvm install --lts
nvm alias default 'lts/*'
nvm use default

print_status "Installing pnpm and PM2 globally..."
npm install -g pnpm pm2

# ========= MySQL =========
print_status "Installing MySQL server/client..."
sudo apt install -y mysql-server mysql-client
sudo systemctl enable --now mysql

print_status "Configuring MySQL (socket-auth root, app DB/user)..."
sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
-- Hardening (safe to re-run)
DELETE FROM mysql.user WHERE User='' OR (User='root' AND Host NOT IN ('localhost','127.0.0.1','::1'));
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db LIKE 'test\\_%';
SQL
print_status "MySQL configured."

# ========= nginx + certbot (HTTP first, then SSL via --nginx) =========
print_status "Installing nginx and certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx

# Upstreams/servers config (HTTP-only; Certbot will add SSL & redirects)
print_status "Writing nginx site config (HTTP only for initial cert issue)..."
sudo tee "$NGINX_DIR/sites-available/cloudlead" >/dev/null <<EOF
# Rate limiting zones (http context OK via include)
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=upload:10m rate=5r/s;

upstream web_app { server 127.0.0.1:$WEB_APP_PORT; }
upstream admin_dashboard { server 127.0.0.1:$ADMIN_DASHBOARD_PORT; }
upstream app_api { server 127.0.0.1:$APP_API_PORT; }

# Main site
server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Security headers (basic)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), microphone=()" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/xml application/json application/javascript text/javascript;

    location / {
        proxy_pass http://web_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}

# Admin
server {
    listen 80;
    server_name admin.$DOMAIN_NAME;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/xml application/json application/javascript text/javascript;

    location / {
        proxy_pass http://admin_dashboard;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
}

# API
server {
    listen 80;
    server_name api.$DOMAIN_NAME;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Rate limiting
    limit_req zone=api burst=20 nodelay;

    # Upload size
    client_max_body_size 50M;

    location / {
        limit_req zone=upload burst=10 nodelay;
        proxy_pass http://app_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Static uploads (served by API if needed)
    location /uploads/ {
        alias $APP_DIR/APP_API/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf "$NGINX_DIR/sites-available/cloudlead" "$NGINX_DIR/sites-enabled/cloudlead"
sudo rm -f "$NGINX_DIR/sites-enabled/default"
sudo nginx -t
sudo systemctl reload nginx
print_status "nginx HTTP config live."

# ========= App code & envs =========
print_status "Preparing application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown "$USER":"$USER" "$APP_DIR"

print_status "Copying application code..."


print_status "Writing environment files..."
# API .env
cat > "$APP_DIR/APP_API/.env" <<EOF
# Database
DATABASE_URL="mysql://$DB_USER:$DB_PASSWORD@localhost:3306/$DB_NAME"

# Server
PORT=$APP_API_PORT
NODE_ENV=production

# JWT
JWT_SECRET=$(openssl rand -base64 64)
JWT_EXPIRES_IN=7d

# Email (update to real SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME="CloudLead File Processing"

# Files
MAX_FILE_SIZE=52428800
UPLOAD_DIR=uploads

# CORS (ensure your API code supports comma-separated list or adjust accordingly)
CORS_ORIGIN=https://$DOMAIN_NAME,https://admin.$DOMAIN_NAME
EOF

# Admin .env.local
cat > "$APP_DIR/ADMIN_DASHBOARD/.env.local" <<EOF
NEXT_PUBLIC_API_URL=https://api.$DOMAIN_NAME
NEXT_PUBLIC_APP_URL=https://admin.$DOMAIN_NAME
NEXTAUTH_URL=https://admin.$DOMAIN_NAME
NEXTAUTH_SECRET=$(openssl rand -base64 64)
EOF

# Web .env.local
cat > "$APP_DIR/web-app/.env.local" <<EOF
NEXT_PUBLIC_API_URL=https://api.$DOMAIN_NAME
NEXT_PUBLIC_APP_URL=https://$DOMAIN_NAME
NEXTAUTH_URL=https://$DOMAIN_NAME
NEXTAUTH_SECRET=$(openssl rand -base64 64)
EOF

# ========= Install & Build (once) =========
print_status "Installing dependencies and building apps..."
cd "$APP_DIR/web-app" && pnpm install && pnpm build
cd "$APP_DIR/ADMIN_DASHBOARD" && pnpm install && pnpm build
cd "$APP_DIR/APP_API" && npm install && npx prisma generate

# Prisma migrate (prefer migrate deploy, fallback to db push)
print_status "Applying Prisma schema..."
cd "$APP_DIR/APP_API"
if [[ -d "prisma/migrations" && -n "$(ls -A prisma/migrations 2>/dev/null || true)" ]]; then
  npx prisma migrate deploy
else
  npx prisma db push
fi

# Create logs dir
mkdir -p "$APP_DIR/APP_API/logs" "$APP_DIR/web-app/logs" "$APP_DIR/ADMIN_DASHBOARD/logs"

# ========= PM2 apps =========
print_status "Starting apps with PM2..."
# API (assuming "start" script exists in APP_API/package.json)
pm2 start "npm run start" --name "cloudlead-api" --cwd "$APP_DIR/APP_API"
# Web & Admin (Next.js; use pnpm start)
pm2 start "pnpm start" --name "cloudlead-web"   --cwd "$APP_DIR/web-app"
pm2 start "pnpm start" --name "cloudlead-admin" --cwd "$APP_DIR/ADMIN_DASHBOARD"
pm2 save

print_status "Enabling PM2 on boot (non-interactive)..."
STARTUP_CMD="$(pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 || true)"
if [[ -n "${STARTUP_CMD:-}" ]]; then
  # shellcheck disable=SC2024
  sudo bash -lc "$STARTUP_CMD" || print_warning "PM2 startup finalization command failed; run it manually if needed."
else
  print_warning "Could not capture PM2 startup command; you may need to run 'pm2 startup' manually."
fi

# ========= SSL via Certbot --nginx (adds redirects + reloads nginx) =========
print_status "Requesting Let's Encrypt certificates via nginx plugin..."
sudo certbot --nginx -d "$DOMAIN_NAME" -d "admin.$DOMAIN_NAME" -d "api.$DOMAIN_NAME" \
  --email "$EMAIL" --agree-tos --redirect --non-interactive

print_status "Certbot installed systemd timers for auto-renewal (recommended)."

# ========= Final status & info =========
sleep 5
print_status "PM2 status:"
pm2 status

print_status "Writing deployment info..."
cat > "$APP_DIR/deployment-info.txt" <<EOF
CloudLead Deployment Information
===============================

Deployment Date: $(date)
Domain: $DOMAIN_NAME
Email: $EMAIL

Application URLs:
- Web App:        https://$DOMAIN_NAME
- Admin Dashboard: https://admin.$DOMAIN_NAME
- API:            https://api.$DOMAIN_NAME

Database:
- Name:     $DB_NAME
- User:     $DB_USER
- Password: $DB_PASSWORD

Services:
- MySQL:   $(systemctl is-active mysql)
- Nginx:   $(systemctl is-active nginx)

PM2 Apps:
$(pm2 status --no-color | awk 'NR==1 || /cloudlead-/ {print}')

Important Paths:
- App Dir:         $APP_DIR
- Nginx Site:      $NGINX_DIR/sites-available/cloudlead
- PM2 Logs:        $APP_DIR/*/logs/
- Prisma Schema:   $APP_DIR/APP_API/prisma/schema.prisma

Next Steps:
1) Update SMTP credentials in $APP_DIR/APP_API/.env
2) Ensure DNS A records for:
   - $DOMAIN_NAME
   - admin.$DOMAIN_NAME
   - api.$DOMAIN_NAME
   all point to this server's public IP.
3) Verify app health: web, admin, and API.
4) Set up monitoring & backups (DB + app data).
EOF

echo -e "\n${BLUE}🎉 Deployment completed!${NC}"
echo -e "${GREEN}Web:   https://$DOMAIN_NAME${NC}"
echo -e "${GREEN}Admin: https://admin.$DOMAIN_NAME${NC}"
echo -e "${GREEN}API:   https://api.$DOMAIN_NAME${NC}"
echo -e "${YELLOW}DB Password: $DB_PASSWORD${NC}"
echo -e "${YELLOW}Info File:   $APP_DIR/deployment-info.txt${NC}"
