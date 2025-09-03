from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
import bcrypt
from werkzeug.security import check_password_hash as werkzeug_check_password_hash
import uuid
from database.db import get_cursor  # ADD

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """
    Supports both bcrypt ($2...) and Werkzeug PBKDF2 ('pbkdf2:sha256:...').
    """
    if not hashed_password:
        return False
    try:
        if str(hashed_password).startswith('pbkdf2:'):
            return werkzeug_check_password_hash(hashed_password, password)
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_uuid():
    """Generate a UUID"""
    return str(uuid.uuid4())

def role_required(*roles):
    """
    Usage:
      @role_required('admin') or @role_required(['admin', 'moderator'])
    """
    # Normalize roles if passed as a single list/tuple
    if len(roles) == 1 and isinstance(roles[0], (list, tuple, set)):
        allowed = set(roles[0])
    else:
        allowed = set(roles)

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({"success": False, "message": "Missing or invalid token"}), 401

            user_id = get_jwt_identity()
            # Look up role from DB
            try:
                with get_cursor() as cur:
                    cur.execute("SELECT role FROM users WHERE user_id = %s", (user_id,))
                    row = cur.fetchone()
                    if not row:
                        return jsonify({"success": False, "message": "User not found"}), 404
                    user_role = row.get('role')
            except Exception:
                return jsonify({"success": False, "message": "Role check failed"}), 500

            if user_role not in allowed:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. Role '{user_role}' not authorized."
                }), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper