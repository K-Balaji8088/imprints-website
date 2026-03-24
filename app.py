from flask import Flask, render_template, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import mysql.connector
import os
from dotenv import load_dotenv
import re
from urllib.parse import urlparse
from mysql.connector import pooling, Error as MySQLError
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # Rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://"
    )

    
    # 🔹 Read Railway DATABASE_URL
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        url = urlparse(database_url)

        app.config["DB_CONFIG"] = {
        "host": url.hostname,
        "port": url.port or 3306,
        "user": url.username,
        "password": url.password,
        "database": url.path.lstrip("/"),
        "ssl_disabled": False,
        "auth_plugin": "mysql_native_password",
    }
    else:
        # fallback for local development
        app.config["DB_CONFIG"] = {
            "host": os.getenv("DB_HOST", "localhost"),
            "port": int(os.getenv("DB_PORT", "3306")),
            "user": os.getenv("DB_USER", ""),
            "password": os.getenv("DB_PASSWORD", ""),
            "database": os.getenv("DB_NAME", ""),
        }

    app.db_pool = None

    def get_db_pool():
        nonlocal app
        if app.db_pool is None:
            try:
                app.db_pool = pooling.MySQLConnectionPool(
                    pool_name="contacts_pool",
                    pool_size=5,
                    pool_reset_session=True,
                    **app.config["DB_CONFIG"],
                )
            except MySQLError as e:
                app.logger.error(f"Error creating DB pool: {e}")
                raise
        return app.db_pool

    def init_db():
        """
        Ensure the contacts table exists.
        Safe to call multiple times (uses IF NOT EXISTS).
        """
        pool = get_db_pool()
        conn = pool.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS contacts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    mobile_number VARCHAR(15) NOT NULL,
                    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                    """
                )
                conn.commit()
        finally:
            conn.close()

    @app.before_request
    def ensure_db():
        """
        Lazily initialize the database on first request.
        """
        try:
            init_db()
        except MySQLError:
            # Error will be surfaced when attempting to use the DB.
            pass

    @app.route('/')
    def index():
        """Serve homepage"""
        return render_template('index.html')

    
    @app.route('/api/chat', methods=['POST'])
    @limiter.limit("10 per minute")
    def chat():
        """Handle chatbot queries"""
        try:
            data = request.get_json()
            message = data.get('message', '').lower().strip()
            
            # FAQ responses
            responses = {
                'pricing': {
                    'keywords': ['price', 'pricing', 'cost', 'budget', 'charge', 'rate', 'fees', 'expensive', 'affordable'],
                    'response': 'Our pricing varies based on project size and requirements. Please contact us at +91-XXXXXXXXXX for a detailed quote, or use the contact form to discuss your specific needs.'
                },
                'services': {
                    'keywords': ['service', 'services', 'what do you do', 'offerings', 'provide', 'design', 'interior'],
                    'response': 'We offer Interior Design, Modular Kitchen, Living Room Design, Bedroom Design, and Complete Home Renovation services. Each project is customized to your unique style and requirements.'
                },
                'contact': {
                    'keywords': ['contact', 'reach', 'phone', 'email', 'address', 'location', 'visit', 'office'],
                    'response': 'You can reach us via the contact form on this website, WhatsApp, or visit our studio. We\'re located in Hyderabad. Click the WhatsApp button for instant chat!'
                },
                'time': {
                    'keywords': ['how long', 'duration', 'timeline', 'time', 'when', 'fast', 'quick'],
                    'response': 'Project timelines typically range from 2-8 weeks depending on scope. We\'ll provide a detailed timeline during our initial consultation.'
                },
                'consultation': {
                    'keywords': ['consult', 'consultation', 'meeting', 'discuss', 'free', 'appointment'],
                    'response': 'Yes! We offer free initial consultations. Fill out the contact form or WhatsApp us to schedule a meeting at your convenience.'
                },
                'portfolio': {
                    'keywords': ['portfolio', 'projects', 'work', 'previous', 'examples', 'gallery', 'photos'],
                    'response': 'You can view our completed projects in the Featured Projects and Gallery sections on this page. Scroll up to see our beautiful transformations!'
                }
            }
            
            # Match keywords
            for category, info in responses.items():
                for keyword in info['keywords']:
                    if keyword in message:
                        return jsonify({
                            'status': 'success',
                            'response': info['response']
                        }), 200
            
            # Default response
            return jsonify({
                'status': 'success',
                'response': 'Thank you for your query! For specific questions, please contact us through the form or WhatsApp. We\'re here to help you create your dream space!'
            }), 200
            
        except Exception as e:
            print(f"Chat error: {e}")
            return jsonify({
                'status': 'error',
                'response': 'Sorry, I couldn\'t process that. Please try again or contact us directly.'
            }), 500

    @app.errorhandler(429)
    def ratelimit_handler(e):
        """Handle rate limit errors"""
        return jsonify({
            'status': 'error',
            'message': 'Too many requests. Please try again later.'
        }), 429

    @app.route('/api/contact', methods=['POST'])
    @limiter.limit("5 per minute")
    def api_contact():
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        mobile_number = (data.get("mobile_number") or "").strip()

        errors = {}

        if not name:
            errors["name"] = "Name is required."

        if not mobile_number:
            errors["mobile_number"] = "Mobile number is required."
        elif not mobile_number.isdigit() or len(mobile_number) != 10:
            errors["mobile_number"] = "Mobile number must be exactly 10 digits."
        
        try:
            pool = get_db_pool()
            conn = pool.get_connection()
            with conn.cursor() as cur:
                ist_time = datetime.utcnow() + timedelta(hours=5, minutes=30)
                cur.execute(
                    "INSERT INTO contacts (name, mobile_number,submitted_at) VALUES (%s, %s, %s)",
                    (name, mobile_number,ist_time),
                )
                conn.commit()
        except MySQLError as e:
            app.logger.error(f"Database error while inserting contact: {e}")
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "There was a problem saving your inquiry. Please try again later.",
                    }
                ),
                500,
            )
        finally:
            try:
                conn.close()
            except Exception:
                pass

        return jsonify({"success": True, "message": "Thank you! We will contact you soon."})
    
    return app

app = create_app()

if __name__ == '__main__':
    # Run the app
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')