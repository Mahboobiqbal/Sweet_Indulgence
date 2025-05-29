from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.auth import check_password, hash_password
from models.user import User
from models.supplier import Supplier
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register/customer', methods=['POST'])
def register_customer():
    """Register a new customer account"""
    data = request.json
    
    # Validate required fields
    required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Check if user already exists
    existing_user = User.get_by_email(data['email'])
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'User with this email already exists'
        }), 409
    
    # Create user with customer role
    try:
        user_data = {
            'email': data['email'],
            'password': data['password'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'phone': data.get('phone'),
            'address': data.get('address'),
            'city': data.get('city'),
            'role': 'customer'
        }
        
        user_id = User.create(user_data)
        
        # Generate JWT token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'success': True,
            'message': 'Customer account registered successfully',
            'token': access_token,
            'user': {
                'user_id': user_id,
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'role': 'customer'
            }
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/register/supplier', methods=['POST'])
def register_supplier():
    """Register a new supplier account"""
    data = request.json
    
    # Validate required fields for user
    user_required_fields = ['email', 'password', 'first_name', 'last_name']
    for field in user_required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Validate required fields for supplier
    supplier_required_fields = ['business_name', 'business_address', 'business_phone']
    for field in supplier_required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Check if user already exists
    existing_user = User.get_by_email(data['email'])
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'User with this email already exists'
        }), 409
    
    try:
        # Begin database transaction
        from database.db import get_db
        db = get_db()
        
        try:
            # Create user with supplier role
            user_data = {
                'email': data['email'],
                'password': data['password'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'phone': data.get('phone'),
                'address': data.get('address'),
                'city': data.get('city'),
                'role': 'supplier'
            }
            
            user_id = User.create(user_data)
            
            # Create supplier record
            supplier_data = {
                'user_id': user_id,
                'business_name': data['business_name'],
                'business_address': data['business_address'],
                'business_phone': data['business_phone'],
                'tax_id': data.get('tax_id'),
                'verification_documents': data.get('verification_documents')
            }
            
            supplier_id = Supplier.create(supplier_data)
            
            # Commit transaction
            db.commit()
            
            # Generate JWT token
            access_token = create_access_token(identity=user_id)
            
            return jsonify({
                'success': True,
                'message': 'Supplier account registered successfully',
                'token': access_token,
                'user': {
                    'user_id': user_id,
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'supplier',
                    'business_name': data['business_name']
                }
            }), 201
            
        except Exception as e:
            # Rollback transaction on error
            db.rollback()
            raise e
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Supplier registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user (customer or supplier)"""
    data = request.json
    
    # Validate required fields
    if 'email' not in data or 'password' not in data:
        return jsonify({
            'success': False,
            'message': 'Email and password are required'
        }), 400
    
    # Check if user exists
    from database.db import get_cursor
    
    with get_cursor() as cursor:
        sql = """
            SELECT user_id, email, first_name, last_name, password_hash, 
                   role, loyalty_points, is_active
            FROM users
            WHERE email = %s
        """
        cursor.execute(sql, (data['email'],))
        user = cursor.fetchone()
    
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Check if account is active
    if not user['is_active']:
        return jsonify({
            'success': False,
            'message': 'Account is deactivated'
        }), 401
    
    # Verify password
    from utils.auth import check_password
    
    if not check_password(data['password'], user['password_hash']):
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Update last login
    from database.db import get_db
    
    with get_db() as conn:
        with conn.cursor() as cursor:
            sql = "UPDATE users SET last_login = NOW() WHERE user_id = %s"
            cursor.execute(sql, (user['user_id'],))
        conn.commit()
    
    # Generate JWT token
    from flask_jwt_extended import create_access_token
    
    access_token = create_access_token(identity=user['user_id'])
    
    # Build response
    response_data = {
        'success': True,
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'user_id': user['user_id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'role': user['role'],
            'loyalty_points': user['loyalty_points'] if user['role'] == 'customer' else None
        }
    }
    
    # If user is a supplier, add business info
    if user['role'] == 'supplier':
        with get_cursor() as cursor:
            sql = """
                SELECT business_name, is_verified
                FROM suppliers
                WHERE user_id = %s
            """
            cursor.execute(sql, (user['user_id'],))
            supplier = cursor.fetchone()
            
        if supplier:
            response_data['user']['business_name'] = supplier['business_name']
            response_data['user']['is_verified'] = supplier['is_verified']
    
    return jsonify(response_data), 200

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify JWT token and return user details"""
    user_id = get_jwt_identity()
    
    # Get user details
    from database.db import get_cursor
    
    with get_cursor() as cursor:
        sql = """
            SELECT user_id, email, first_name, last_name, role, loyalty_points
            FROM users
            WHERE user_id = %s AND is_active = TRUE
        """
        cursor.execute(sql, (user_id,))
        user = cursor.fetchone()
    
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid or expired token'
        }), 401
    
    # Build response
    response_data = {
        'success': True,
        'isAuthenticated': True,
        'user': {
            'user_id': user['user_id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'role': user['role'],
            'loyalty_points': user['loyalty_points'] if user['role'] == 'customer' else None
        }
    }
    
    # If user is a supplier, add business info
    if user['role'] == 'supplier':
        with get_cursor() as cursor:
            sql = """
                SELECT business_name, is_verified
                FROM suppliers
                WHERE user_id = %s
            """
            cursor.execute(sql, (user['user_id'],))
            supplier = cursor.fetchone()
            
        if supplier:
            response_data['user']['business_name'] = supplier['business_name']
            response_data['user']['is_verified'] = supplier['is_verified']
    
    return jsonify(response_data), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset token to user's email"""
    data = request.json
    
    if 'email' not in data:
        return jsonify({
            'success': False,
            'message': 'Email is required'
        }), 400
    
    # Check if user exists
    user = User.get_by_email(data['email'])
    if not user:
        # Don't reveal if email exists for security reasons
        return jsonify({
            'success': True,
            'message': 'If your email is registered, you will receive a password reset link'
        }), 200
    
    # Generate reset token
    reset_token = str(uuid.uuid4())
    
    # Store token in database with expiration
    User.set_reset_token(user['user_id'], reset_token)
    
    # TODO: Send email with reset token
    # For now, just return the token in response (for development)
    
    return jsonify({
        'success': True,
        'message': 'If your email is registered, you will receive a password reset link',
        'dev_token': reset_token  # Remove in production
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token"""
    data = request.json
    
    if 'token' not in data or 'password' not in data:
        return jsonify({
            'success': False,
            'message': 'Token and new password are required'
        }), 400
    
    # Validate token and get user
    user = User.get_by_reset_token(data['token'])
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid or expired token'
        }), 400
    
    # Update password
    User.update_password(user['user_id'], data['password'])
    
    # Clear reset token
    User.clear_reset_token(user['user_id'])
    
    return jsonify({
        'success': True,
        'message': 'Password has been reset successfully'
    }), 200