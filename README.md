# Imprints - The Design Studio

A modern, premium full-stack website for an interior design studio built with Flask, MySQL, and vanilla JavaScript.

## 🎨 Features

### Frontend
- **Modern Premium Design**: Luxury aesthetics with beige, gold, and neutral tones
- **Fully Responsive**: Mobile-first design that works on all devices
- **Interactive Elements**:
  - Smooth scrolling navigation
  - Lazy loading images for optimal performance
  - Before/After transformation toggles
  - Gallery filtering
  - Animated scroll effects
  - WhatsApp integration
  - AI Chatbot for FAQs

### Backend
- **Flask API**: RESTful API endpoints
- **MySQL Database**: Contact form data storage (Railway)
- **Security Features**:
  - Rate limiting (Flask-Limiter)
  - Input validation & sanitization
  - Environment-based configuration
  - No hardcoded secrets

### Sections
1. **Hero**: Eye-catching landing with CTAs
2. **Featured Projects**: 12+ premium project showcases
3. **Before & After**: Interactive transformation gallery
4. **Services**: Interior Design, Modular Kitchen, Living Room, Bedroom, Renovation
5. **Gallery**: Categorized image gallery with filters
6. **Testimonials**: Customer reviews with star ratings
7. **Contact**: Form with MySQL integration + Google Maps

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- MySQL database (Railway recommended)
- Git

### Local Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd imprints-website
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# See Railway Database Setup section below
```

5. **Run the application**
```bash
python app.py
```

6. **Open in browser**
```
http://localhost:5000
```

## 🗄️ Railway Database Setup

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create MySQL Database
1. Click "New Project"
2. Select "Provision MySQL"
3. Wait for database to be created

### Step 3: Get Connection Details
1. Click on your MySQL service
2. Go to "Variables" tab
3. Copy these values:
   - `MYSQL_HOST` → DB_HOST
   - `MYSQL_USER` → DB_USER
   - `MYSQL_PASSWORD` → DB_PASSWORD
   - `MYSQL_DATABASE` → DB_NAME
   - `MYSQL_PORT` → DB_PORT

### Step 4: Update .env File
```env
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your-password-here
DB_NAME=railway
DB_PORT=6379
```

### Step 5: Test Connection
```bash
python app.py
# Database will be initialized automatically
```

## 🌐 Deployment to Railway

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Flask app

3. **Configure Environment Variables**
   - Go to your project → Variables
   - Add all variables from your .env file:
     - `SECRET_KEY`
     - `FLASK_ENV=production`
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `DB_PORT`

4. **Generate Domain**
   - Go to Settings → Domains
   - Click "Generate Domain"
   - Your site will be live at: `yourapp.railway.app`

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## 📱 Android App Conversion

### Option 1: WebView App (Easiest)

Create a simple Android app that loads your website in a WebView:

```java
// MainActivity.java
public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webView);
        webView.setWebViewClient(new WebViewClient());
        
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        
        // Load your Railway URL
        webView.loadUrl("https://yourapp.railway.app");
    }
}
```

### Option 2: Native App with API

Build a native Android app that consumes your Flask API:

1. Use the same backend (Railway)
2. Create native Android UI
3. Make HTTP requests to `/api/contact` and `/api/chat`
4. Better performance and native features

### Recommended Tools
- **Android Studio**: For native app development
- **Flutter**: Cross-platform (Android + iOS)
- **React Native**: JavaScript-based mobile development

## 🔧 API Documentation

### POST /api/contact
Submit contact form data

**Request:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Thank you! We will contact you soon."
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Please enter a valid 10-digit mobile number"
}
```

### POST /api/chat
Chatbot query endpoint

**Request:**
```json
{
  "message": "What are your pricing options?"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "Our pricing varies based on project size..."
}
```

## 🎯 Customization

### Update WhatsApp Number
Edit `templates/index.html`:
```html
<!-- Line 195 and 408 -->
https://wa.me/YOUR_NUMBER?text=...
```

### Change Colors
Edit `static/css/style.css`:
```css
:root {
    --primary-gold: #C9A961;
    --primary-dark: #2C2416;
    --beige: #F5F1E8;
}
```

### Add More Projects
Edit `templates/index.html` in the `#projects` section - add more `.project-card` divs

### Update Services
Edit `templates/index.html` in the `#services` section

## 🔒 Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Use Railway environment variables in production

2. **Change SECRET_KEY**
   ```python
   import secrets
   print(secrets.token_hex(32))
   ```

3. **Enable HTTPS**
   - Railway provides automatic HTTPS
   - Always use secure connections

4. **Rate Limiting**
   - Already configured in app.py
   - Prevents spam and abuse

## 📊 Performance Optimization

- **Lazy Loading**: Images load as user scrolls
- **Minification**: Consider minifying CSS/JS for production
- **CDN**: Use CDN for external libraries (already implemented)
- **Caching**: Add browser caching headers
- **Image Optimization**: Compress images before upload

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Test MySQL connection
python -c "import mysql.connector; print('MySQL installed correctly')"

# Check Railway database is running
railway status
```

### Port Already in Use
```bash
# Change port in .env
PORT=8000
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## 📝 Project Structure

```
imprints-website/
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── templates/
│   └── index.html         # Main HTML template
└── static/
    ├── css/
    │   └── style.css      # Styles
    ├── js/
    │   └── script.js      # JavaScript
    └── images/
        └── logo.jpg       # Company logo
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary to Imprints - The Design Studio.

## 📞 Support

For issues or questions:
- Email: contact@imprints.com
- WhatsApp: +91-9876543210

## 🎉 Acknowledgments

- Fonts: Google Fonts (Playfair Display, Montserrat)
- Icons: Font Awesome
- Images: Unsplash (placeholder images)

---

**Built with ❤️ for Imprints - The Design Studio**