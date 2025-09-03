from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import init_app, test_connection, close_db
from routes.auth import auth_bp
from routes.users import users_bp
from routes.stores import stores_bp
from routes.products import products_bp
from routes.categories import categories_bp
from routes.wishlist import wishlist_bp
from routes.orders import orders_bp 
from routes.cart import cart_bp
from routes.admin import admin_bp
import os, uuid
import bcrypt  # ADD
from werkzeug.security import generate_password_hash  # stays, but we will use bcrypt for seeding
from database.db import get_cursor

def ensure_superadmin():
    email = os.environ.get('SUPERADMIN_EMAIL', 'admin@example.com')
    password = os.environ.get('SUPERADMIN_PASSWORD', 'ChangeMe123!')

    try:
        with get_cursor() as cur:
            cur.execute("""
                SELECT column_name, is_nullable
                FROM information_schema.columns
                WHERE table_schema='public' AND table_name='users'
            """)
            cols = {r['column_name']: (r['is_nullable'] == 'YES') for r in cur.fetchall()}

            # Fetch existing user (also get password_hash to fix scheme)
            cur.execute("SELECT user_id, role, password_hash FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            if row:
                updates, params = [], []
                if 'role' in cols and row.get('role') != 'admin':
                    updates.append("role = 'admin'")
                if 'first_name' in cols:
                    updates.append("first_name = COALESCE(first_name, %s)")
                    params.append('Super')
                if 'last_name' in cols:
                    updates.append("last_name = COALESCE(last_name, %s)")
                    params.append('Admin')
                # Re-hash to bcrypt if not already bcrypt ($2...)
                if 'password_hash' in cols and not str(row.get('password_hash') or '').startswith('$2'):
                    bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    updates.append("password_hash = %s")
                    params.append(bcrypt_hash)

                if updates:
                    sql = f"UPDATE users SET {', '.join(updates)} WHERE email = %s"
                    cur.execute(sql, tuple(params + [email]))
                print(f"[INIT] Super admin ensured: {email}")
                return

            # Build INSERT with bcrypt hash
            insert_cols, placeholders, params = [], [], []

            def add_col(name, value=None, raw_sql=None):
                if name in cols:
                    insert_cols.append(name)
                    if raw_sql:
                        placeholders.append(raw_sql)
                    else:
                        placeholders.append('%s')
                        params.append(value)

            add_col('user_id', str(uuid.uuid4()))
            add_col('email', email)
            # bcrypt for new seed
            bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            add_col('password_hash', bcrypt_hash)
            add_col('role', 'admin')

            if 'first_name' in cols:
                add_col('first_name', 'Super')
            if 'last_name' in cols:
                add_col('last_name', 'Admin')
            if 'is_active' in cols:
                add_col('is_active', True)
            if 'login_attempts' in cols:
                add_col('login_attempts', 0)
            if 'date_created' in cols:
                add_col('date_created', raw_sql='CURRENT_TIMESTAMP')
            if 'date_updated' in cols and not cols['date_updated']:
                add_col('date_updated', raw_sql='CURRENT_TIMESTAMP')

            if not {'email','password_hash','role'}.issubset(set(insert_cols)):
                print("[INIT] Users table missing required columns for admin seed:", insert_cols)
                return

            sql = f"INSERT INTO users ({', '.join(insert_cols)}) VALUES ({', '.join(placeholders)})"
            cur.execute(sql, tuple(params))
            print(f"[INIT] Super admin created: {email}")
    except Exception as e:
        print("[INIT] Failed to ensure super admin:", e)

def create_app():
    app = Flask(__name__, static_folder=None)
    # ADD: secrets for JWT
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-flask-secret-change-me')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', app.config['SECRET_KEY'])

    CORS(app)
    JWTManager(app)
    init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(admin_bp)

    # Add static file serving for uploads
    @app.route('/uploads/<path:subfolder>/<filename>')
    def serve_uploaded_file(subfolder, filename):
        """Serve uploaded files"""
        try:
            # Construct the full path to the uploads directory
            uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
            return send_from_directory(uploads_dir, f"{subfolder}/{filename}")
        except Exception as e:
            print(f"Error serving file: {e}")
            return "File not found", 404
    
    @app.route('/')
    def home():
        return {
            'message': 'Sweet Indulgence API',
            'status': 'running'
        }
    
    @app.route('/api/health')
    def health_check():
        try:
            # Test database connection
            db_status = test_connection()
            return {
                'status': 'healthy' if db_status else 'unhealthy',
                'database': 'connected' if db_status else 'disconnected'
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e)
            }, 500
    
    # Register the function to close the database connection
    app.teardown_appcontext(close_db)

    # Optional health check or test DB
    # test_connection()

    # Ensure super admin exists
    ensure_superadmin()

    return app

if __name__ == '__main__':
    app = create_app()
    print("Starting Sweet Indulgence API...")
    app.run(debug=True, host='0.0.0.0', port=5000)