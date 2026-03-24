# 🚀 Quick Start Guide - Imprints Website

Get your website running in **5 minutes**!

## Step 1: Download the Files (Done ✅)
You already have all the files in the `imprints-website` folder.

## Step 2: Install Python
If you don't have Python installed:
- **Windows**: Download from [python.org](https://python.org)
- **Mac**: `brew install python3`
- **Linux**: `sudo apt install python3 python3-pip`

Verify: `python --version` (should be 3.8 or higher)

## Step 3: Set Up the Project

Open terminal/command prompt and run:

```bash
# Navigate to project folder
cd imprints-website

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 4: Configure Database (Temporary Local Setup)

For quick testing, we'll use a local MySQL database:

### Option A: Install MySQL Locally
1. Download MySQL from [dev.mysql.com/downloads](https://dev.mysql.com/downloads/mysql/)
2. Install and note your root password
3. Create `.env` file:

```bash
# Copy the example
cp .env.example .env

# Edit .env file with these values:
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=imprints_db
DB_PORT=3306
```

### Option B: Use Railway (Recommended for Production)

Skip local MySQL and go straight to Railway:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create "New Project" → "Provision MySQL"
4. Copy database credentials to `.env`:

```env
SECRET_KEY=generate-random-key-here
FLASK_ENV=development
PORT=5000
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your-railway-password
DB_NAME=railway
DB_PORT=xxxx
```

## Step 5: Run the Website

```bash
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5000
* Database initialized successfully
```

## Step 6: Open in Browser

Open your browser and go to:
```
http://localhost:5000
```

## Step 7: Test Features

✅ **Navigation** - Click on menu items
✅ **Contact Form** - Fill and submit (check console for success)
✅ **Before/After** - Toggle buttons on transformation section
✅ **Gallery** - Click filter tabs
✅ **Chatbot** - Click chat icon and ask questions
✅ **WhatsApp** - Click WhatsApp button (update number first!)

## Quick Customization

### Update WhatsApp Number
Edit `templates/index.html`, find and replace:
```
9876543210  →  YOUR_NUMBER
```
(2 locations: hero button and floating button)

### Change Colors
Edit `static/css/style.css`:
```css
:root {
    --primary-gold: #C9A961;  /* Your brand color */
    --primary-dark: #2C2416;  /* Dark text color */
    --beige: #F5F1E8;         /* Background color */
}
```

### Update Company Info
Edit `templates/index.html`:
- Company name
- Testimonials
- Service descriptions

## Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt --force-reinstall
```

### "Database connection failed"
- Check MySQL is running
- Verify credentials in `.env`
- Check if port 3306 is available

### "Port 5000 already in use"
Change port in `.env`:
```env
PORT=8000
```

### Images not loading
Make sure logo file is in:
```
static/images/logo.jpg
```

## Next Steps

### For Development
1. ✅ Customize content and images
2. ✅ Test all features thoroughly
3. ✅ Add your own project images
4. ✅ Update contact information

### For Production
1. 📱 Deploy to Railway (see DEPLOYMENT.md)
2. 🔒 Get SSL certificate (automatic with Railway)
3. 🌐 Connect custom domain (optional)
4. 📊 Set up analytics (Google Analytics)
5. 📱 Create Android app (see ANDROID_APP.md)

## File Structure Overview

```
imprints-website/
├── app.py                  # Flask backend
├── requirements.txt        # Dependencies
├── .env                    # Configuration (create this)
├── templates/
│   └── index.html         # Main website
├── static/
│   ├── css/
│   │   └── style.css      # Styling
│   ├── js/
│   │   └── script.js      # Interactive features
│   └── images/
│       └── logo.jpg       # Your logo
└── README.md              # Full documentation
```

## Important Files

- **app.py** - Backend logic, API endpoints
- **index.html** - All website content
- **style.css** - Visual design
- **script.js** - Interactive features
- **.env** - Configuration (DON'T share this!)

## Common Tasks

### Add New Project
Edit `templates/index.html`, find `<div class="projects-grid">`, add:
```html
<div class="project-card fade-in-up">
    <div class="project-image">
        <img data-src="YOUR_IMAGE_URL" alt="Project Name" class="lazy">
        <div class="project-overlay">
            <h3>Project Title</h3>
            <p>Project Description</p>
        </div>
    </div>
</div>
```

### Add Testimonial
Find `<div class="testimonials-grid">`, add:
```html
<div class="testimonial-card fade-in-up">
    <div class="stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
    </div>
    <p class="testimonial-text">"Your testimonial here"</p>
    <div class="testimonial-author">
        <h4>Customer Name</h4>
        <p>Location</p>
    </div>
</div>
```

### Check Database
```bash
# Connect to Railway MySQL
railway connect mysql

# Run SQL query
SELECT * FROM contacts;
```

## Support & Resources

📚 **Documentation**
- [Full README](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Android App Guide](ANDROID_APP.md)

🔗 **Helpful Links**
- Flask Docs: [flask.palletsprojects.com](https://flask.palletsprojects.com)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Bootstrap Icons: [fontawesome.com](https://fontawesome.com)

💡 **Tips**
- Save changes and refresh browser to see updates
- Check browser console (F12) for errors
- Use Chrome DevTools for mobile testing
- Test contact form with real mobile numbers

## Development Workflow

1. **Make Changes** - Edit HTML/CSS/JS files
2. **Save** - Ctrl+S (Cmd+S on Mac)
3. **Refresh** - Browser (F5 or Ctrl+R)
4. **Test** - Verify changes work
5. **Commit** - `git commit -m "Description"`
6. **Push** - `git push` (if using Git)

## Production Checklist

Before going live:

- [ ] Update WhatsApp number
- [ ] Change SECRET_KEY in .env
- [ ] Test contact form thoroughly
- [ ] Test on mobile devices
- [ ] Optimize all images
- [ ] Set FLASK_ENV=production
- [ ] Enable HTTPS (automatic with Railway)
- [ ] Test all navigation links
- [ ] Verify Google Maps location
- [ ] Test chatbot responses
- [ ] Check database connection
- [ ] Set up backups (Railway)

## Emergency Contacts

If something goes wrong:

1. Check browser console (F12)
2. Check terminal for errors
3. Restart Flask app
4. Check `.env` file
5. Verify database connection

---

## You're Ready! 🎉

Your website should now be running at `http://localhost:5000`

**Next:** Deploy to Railway for a live website (takes 15 minutes)

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

---

**Questions?** Check the full [README.md](README.md) for detailed documentation.