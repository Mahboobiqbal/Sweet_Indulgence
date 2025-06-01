from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import get_cursor, get_db
import uuid
from datetime import datetime

stores_bp = Blueprint('stores', __name__)

@stores_bp.route('/stores', methods=['POST'])
@jwt_required()
def create_store():
    """Create a new store for a supplier"""
    try:
        user_id = get_jwt_identity()
        
        # Get store data from request
        data = request.json or {}
        name = data.get('name') or "My Bakery Shop"
        description = data.get('description') or "My bakery store"
        
        # Get or set default values for required fields
        address = data.get('address') or "Default Address"
        city = data.get('city') or "Default City"
        
        # Get user phone for default store phone
        from database.db import get_db
        db = get_db()
        
        try:
            store_id = str(uuid.uuid4())
            
            with db.cursor() as cursor:
                # First verify user is a supplier and get their phone
                sql = "SELECT role, phone FROM users WHERE user_id = %s"
                cursor.execute(sql, (user_id,))
                user = cursor.fetchone()
                
                if not user or user[0] != 'supplier':  # Access by index, not key
                    return jsonify({
                        'success': False,
                        'message': 'Only suppliers can create stores'
                    }), 403
                
                # Use user's phone as default store phone if available - use index 1 for phone
                phone = data.get('phone')
                if not phone and len(user) > 1 and user[1]:
                    phone = user[1]  # Access tuple by index position
                if not phone:
                    phone = "000-000-0000"
                
                # Check if supplier already has a store
                sql = "SELECT store_id FROM stores WHERE owner_id = %s"
                cursor.execute(sql, (user_id,))
                existing_store = cursor.fetchone()
                
                if existing_store:
                    return jsonify({
                        'success': False,
                        'message': 'You already have a store'
                    }), 400
                
                # Create the store with all required fields
                sql = """
                    INSERT INTO stores (
                        store_id, owner_id, name, description, 
                        address, city, phone,
                        is_active, date_created
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    store_id, user_id, name, description,
                    address, city, phone,
                    True, datetime.utcnow()
                ))
            
            # Commit transaction
            db.commit()
            
            return jsonify({
                'success': True,
                'message': 'Store created successfully',
                'store': {
                    'store_id': store_id,
                    'name': name
                }
            }), 201
            
        except Exception as e:
            # Rollback on error
            db.rollback()
            print(f"Database error creating store: {e}")
            raise e
            
    except Exception as e:
        print(f"Error creating store: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'An error occurred while creating the store: {str(e)}'
        }), 500

@stores_bp.route('/stores/check', methods=['GET'])
@jwt_required()
def check_store():
    """Check if the current supplier has a store"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Check if user is a supplier - use index access for consistency
            sql = "SELECT role FROM users WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
            
            # Make sure we access the role value correctly
            user_role = user[0] if isinstance(user, tuple) else user.get('role')
            
            if user_role != 'supplier':
                return jsonify({
                    'success': False,
                    'message': 'Not a supplier account'
                }), 403
            
            # Check if supplier has a store
            sql = "SELECT store_id, name FROM stores WHERE owner_id = %s"
            cursor.execute(sql, (user_id,))
            store = cursor.fetchone()
            
            # Convert result to dict for response
            store_data = None
            if store:
                if isinstance(store, tuple):
                    store_data = {
                        'store_id': store[0],
                        'name': store[1]
                    }
                else:
                    store_data = {
                        'store_id': store.get('store_id'),
                        'name': store.get('name')
                    }
            
            return jsonify({
                'success': True,
                'hasStore': store is not None,
                'store': store_data
            }), 200
            
    except Exception as e:
        print(f"Error checking store: {e}")
        return jsonify({
            'success': False,
            'message': f'Error checking store: {str(e)}'
        }), 500

@stores_bp.route('/stores/test', methods=['GET'])
def test_stores():
    return jsonify({
        'success': True,
        'message': 'Stores endpoint is working'
    })

@stores_bp.route('/stores/schema', methods=['GET'])
def get_store_schema():
    """Get the actual database schema for debugging"""
    try:
        from database.db import get_cursor
        
        with get_cursor() as cursor:
            # Get column information for the stores table
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'stores';
            """)
            columns = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'schema': columns
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        })