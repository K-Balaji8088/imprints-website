# 🚀 Complete Deployment Guide - Imprints Website

## Railway Deployment (Recommended)

### Prerequisites
- GitHub account
- Railway account (free tier available)
- Your code pushed to GitHub

### Step-by-Step Deployment

#### 1. Prepare Railway MySQL Database

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Provision MySQL"
   - Wait for provisioning to complete

3. **Get Database Credentials**
   - Click on the MySQL service
   - Go to "Variables" tab
   - Copy these values (you'll need them later):
     ```
     MYSQLHOST
     MYSQLUSER
     MYSQLPASSWORD
     MYSQLDATABASE
     MYSQLPORT
     ```

#### 2. Deploy Flask Application

1. **Create New Service**
   - In the same Railway project, click "New"
   - Select "GitHub Repo"
   - Connect your repository
   - Select the `imprints-website` repository

2. **Configure Environment Variables**
   - Click on your Flask service
   - Go to "Variables" tab
   - Add the following variables:
   
   ```env
   SECRET_KEY=generate-a-random-secret-key-here
   FLASK_ENV=production
   DB_HOST=containers-us-west-xxx.railway.app (from MySQL service)
   DB_USER=root (from MySQL service)
   DB_PASSWORD=your-mysql-password (from MySQL service)
   DB_NAME=railway (from MySQL service)
   DB_PORT=3306
   PORT=5000
   ```

   **How to Generate SECRET_KEY:**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. **Verify Deployment**
   - Railway will automatically detect Flask app
   - Build process will start
   - Wait for "Success" status

4. **Generate Public URL**
   - Go to "Settings" → "Domains"
   - Click "Generate Domain"
   - Your site will be available at: `yourapp.railway.app`

#### 3. Test Your Deployment

1. **Visit Your Site**
   - Open the generated URL
   - All sections should load properly

2. **Test Contact Form**
   - Fill out the contact form
   - Submit and verify success message

3. **Test Chatbot**
   - Click chatbot icon
   - Ask a question
   - Verify response

4. **Verify Database**
   - In Railway MySQL service, click "Data" tab
   - Check if `contacts` table exists
   - Verify submitted contact appears in database

## Alternative: Manual VPS Deployment

### For AWS EC2, DigitalOcean, Linode, etc.

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Nginx
sudo apt install nginx -y

# Install MySQL
sudo apt install mysql-server -y
```

#### 2. MySQL Configuration

```bash
# Secure MySQL
sudo mysql_secure_installation

# Create database
sudo mysql
```

```sql
CREATE DATABASE imprints_db;
CREATE USER 'imprints_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON imprints_db.* TO 'imprints_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> imprints
cd imprints

# Create virtual environment
sudo python3 -m venv venv
sudo venv/bin/pip install -r requirements.txt

# Create .env file
sudo nano .env
# Add your configuration
```

#### 4. Configure Gunicorn

```bash
# Create systemd service
sudo nano /etc/systemd/system/imprints.service
```

```ini
[Unit]
Description=Imprints Flask App
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/imprints
Environment="PATH=/var/www/imprints/venv/bin"
ExecStart=/var/www/imprints/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start imprints
sudo systemctl enable imprints
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/imprints
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/imprints/static;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/imprints /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=imprints_db
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=imprints_db
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### Deploy with Docker

```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All images display properly
- [ ] Navigation works smoothly
- [ ] Contact form submits successfully
- [ ] Data saves to database
- [ ] Chatbot responds correctly
- [ ] WhatsApp button works
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled (if applicable)
- [ ] Google Maps loads correctly

## Monitoring & Maintenance

### 1. Check Application Logs (Railway)
- Go to your service → "Deployments"
- Click on latest deployment
- View logs for errors

### 2. Monitor Database
- Check Railway MySQL "Metrics" tab
- Monitor connections and queries

### 3. Set Up Alerts
- Railway provides automatic alerts
- Configure in project settings

### 4. Backup Database
```bash
# For Railway, use their backup feature
# Settings → Backups → Enable automatic backups
```

### 5. Update Application
```bash
# Push changes to GitHub
git add .
git commit -m "Update feature"
git push

# Railway automatically redeploys
```

## Troubleshooting

### Common Issues

**Issue: Database connection timeout**
```
Solution: Check DB_HOST, DB_PORT in environment variables
Verify MySQL service is running in Railway
```

**Issue: 502 Bad Gateway**
```
Solution: Check application logs
Verify gunicorn is running
Check PORT environment variable
```

**Issue: Static files not loading**
```
Solution: Verify static folder structure
Check Flask url_for() paths in templates
Clear browser cache
```

**Issue: Contact form not saving**
```
Solution: Check database connection
Verify table exists
Check API endpoint logs
Test with Postman/curl
```

## Performance Optimization

### 1. Enable Caching
Add to app.py:
```python
from flask import Flask
app = Flask(__name__)

@app.after_request
def add_header(response):
    response.cache_control.max_age = 300
    return response
```

### 2. Use CDN for Static Assets
- Upload images to Cloudinary or AWS S3
- Use CDN URLs in templates

### 3. Enable Gzip Compression
In Railway, this is automatic

### 4. Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_created_at ON contacts(created_at);
```

## Security Hardening

### 1. Update Dependencies Regularly
```bash
pip list --outdated
pip install --upgrade package-name
```

### 2. Enable CORS (if needed for API)
```python
from flask_cors import CORS
CORS(app, origins=['https://yourapp.railway.app'])
```

### 3. Add Security Headers
```python
@app.after_request
def security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

## Custom Domain Setup (Railway)

1. **Purchase Domain**
   - Any domain registrar (Namecheap, GoDaddy, etc.)

2. **Add Custom Domain in Railway**
   - Settings → Domains
   - Click "Custom Domain"
   - Enter your domain

3. **Update DNS Records**
   - Add CNAME record in your domain registrar:
     ```
     Type: CNAME
     Name: www (or @)
     Value: your-app.railway.app
     ```

4. **Wait for Propagation**
   - Can take 1-48 hours
   - Check status in Railway

## Scaling

### Vertical Scaling (Railway)
- Upgrade to Pro plan
- Increase resources in Settings

### Horizontal Scaling
- Add more workers to gunicorn:
  ```
  gunicorn --workers 5 --bind 0.0.0.0:5000 app:app
  ```

## Support & Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Flask Docs**: [flask.palletsprojects.com](https://flask.palletsprojects.com)
- **MySQL Docs**: [dev.mysql.com/doc](https://dev.mysql.com/doc/)

---

**Deployment Date**: [Add date when deployed]
**Deployed By**: [Add your name]
**URL**: [Add your Railway URL]