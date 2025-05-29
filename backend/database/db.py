import psycopg2
import psycopg2.extras
from flask import g
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    """Get the database connection"""
    if 'db' not in g:
        g.db = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=int(os.getenv('DB_PORT', 5433)),  # Convert to int and use 5433
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            dbname=os.getenv('DB_NAME'),
            # Use a reasonable timeout (in seconds)
            connect_timeout=5
        )
        # Enable autocommit for better transaction control
        g.db.autocommit = False
        
        # Set cursor factory to return dictionaries instead of tuples
        g.cursor_factory = psycopg2.extras.RealDictCursor
        
    return g.db

def get_cursor():
    """Get a database cursor that returns dictionaries"""
    db = get_db()
    # Always use RealDictCursor to ensure dictionary-like access
    return db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

def close_db(e=None):
    """Close the database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    """Initialize database connection"""
    app.teardown_appcontext(close_db)

# Examples of how to use these functions (comment these out or remove them in production)
"""
def get_some_data(id):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM table WHERE id = %s", (id,))
        return cursor.fetchone()

def insert_some_data(data):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO table (col1, col2) VALUES (%s, %s) RETURNING id",
                (data['col1'], data['col2'])
            )
            # PostgreSQL can return values from inserts
            new_id = cursor.fetchone()['id']
        conn.commit()
        return new_id
    except Exception as e:
        conn.rollback()
        raise e

def perform_transaction():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            # Do multiple operations
            cursor.execute("INSERT INTO table1 VALUES (%s)", ("value",))
            cursor.execute("UPDATE table2 SET col = %s WHERE id = %s", ("value", 1))
        # If no exceptions, commit the transaction
        conn.commit()
    except Exception as e:
        # If any error occurs, roll back the transaction
        conn.rollback()
        raise e
"""