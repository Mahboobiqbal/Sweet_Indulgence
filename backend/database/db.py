import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'sweet_indulgence'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'your_password'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db():
    """Get a database connection"""
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        return connection
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        raise

@contextmanager
def get_cursor():
    """Get a cursor with RealDictCursor that returns results as dictionaries"""
    connection = get_db()
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            yield cursor
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        connection.close()

def init_app(app):
    """Initialize database with Flask app"""
    try:
        # Test the database connection when the app starts
        print("Testing database connection...")
        if test_connection():
            print("Database connection successful!")
        else:
            print("Database connection failed!")
            
        # You can add any app-specific database initialization here
        app.teardown_appcontext(close_db)
        
    except Exception as e:
        print(f"Error initializing database with app: {e}")
        raise

def close_db(error):
    """Close database connection at the end of request"""
    # This is called automatically by Flask
    pass

def test_connection():
    """Test database connection"""
    try:
        with get_cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"Database connection test: {result}")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def init_db():
    """Initialize the database with schema"""
    try:
        # Read schema file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
            schema = f.read()
        
        # Execute schema
        with get_cursor() as cursor:
            cursor.execute(schema)
            print("Database initialized successfully")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def create_tables():
    """Create database tables if they don't exist"""
    try:
        print("Creating database tables...")
        init_db()
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
        raise

# Test the connection when the module is imported
if __name__ == "__main__":
    print("Testing database connection...")
    test_connection()