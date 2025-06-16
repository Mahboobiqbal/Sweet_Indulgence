from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import get_cursor, get_db
import uuid
from datetime import datetime
import json

stores_bp = Blueprint('stores', __name__)

@stores_bp.route('/', methods=['POST'])  # Changed from '/stores'
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

@stores_bp.route('/check', methods=['GET'])  # Changed from '/stores/check'
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
            user_role = user['role']  # Since we're using get_cursor(), this should work
            
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
                store_data = {
                    'store_id': store['store_id'],
                    'name': store['name']
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

@stores_bp.route('/<store_id>', methods=['GET'])  # This stays the same
@jwt_required()
def get_store_details(store_id):
    """Get detailed store information by store ID"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # First check if the store exists and user has access
            sql = """
                SELECT s.*, u.role 
                FROM stores s
                JOIN users u ON u.user_id = %s
                WHERE s.store_id = %s
            """
            cursor.execute(sql, (user_id, store_id))
            result = cursor.fetchone()
            
            if not result:
                return jsonify({
                    'success': False,
                    'message': 'Store not found'
                }), 404
            
            # Check if user is the owner or has permission to view
            user_role = result['role']
            store_owner_id = result['owner_id']
            
            if user_role == 'supplier' and store_owner_id != user_id:
                return jsonify({
                    'success': False,
                    'message': 'You can only view your own store'
                }), 403
            
            # Prepare store data
            store_data = {
                'store_id': result['store_id'],
                'owner_id': result['owner_id'],
                'name': result['name'],
                'description': result['description'],
                'address': result['address'],
                'city': result['city'],
                'phone': result['phone'],
                'email': result['email'],
                'logo_url': result['logo_url'],
                'hero_image_url': result['hero_image_url'],
                'opening_hours': result['opening_hours'] or {
                    "Monday": "9:00 AM - 5:00 PM",
                    "Tuesday": "9:00 AM - 5:00 PM",
                    "Wednesday": "9:00 AM - 5:00 PM",
                    "Thursday": "9:00 AM - 5:00 PM",
                    "Friday": "9:00 AM - 5:00 PM",
                    "Saturday": "10:00 AM - 3:00 PM",
                    "Sunday": "Closed"
                },
                'is_active': result['is_active'],
                'date_created': result['date_created'],
                'avg_rating': float(result['avg_rating']) if result['avg_rating'] else 0.0
            }
            
            return jsonify({
                'success': True,
                'store': store_data
            }), 200
            
    except Exception as e:
        print(f"Error fetching store details: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching store details: {str(e)}'
        }), 500

@stores_bp.route('/<store_id>', methods=['PUT'])  # This stays the same
@jwt_required()
def update_store(store_id):
    """Update store information"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        with get_cursor() as cursor:
            # First verify the user owns this store
            sql = "SELECT owner_id FROM stores WHERE store_id = %s"
            cursor.execute(sql, (store_id,))
            store = cursor.fetchone()
            
            if not store:
                return jsonify({
                    'success': False,
                    'message': 'Store not found'
                }), 404
            
            if store['owner_id'] != user_id:
                return jsonify({
                    'success': False,
                    'message': 'You can only update your own store'
                }), 403
            
            # Build update query dynamically
            update_fields = []
            values = []
            
            # Fields that can be updated
            updatable_fields = {
                'name': 'name',
                'description': 'description',
                'address': 'address',
                'city': 'city',
                'phone': 'phone',
                'email': 'email',
                'logo_url': 'logo_url',
                'hero_image_url': 'hero_image_url',
                'opening_hours': 'opening_hours'
            }
            
            for field, column in updatable_fields.items():
                if field in data:
                    update_fields.append(f"{column} = %s")
                    if field == 'opening_hours':
                        # Convert to JSON for PostgreSQL JSONB field
                        values.append(json.dumps(data[field]))
                    else:
                        values.append(data[field])
            
            if not update_fields:
                return jsonify({
                    'success': False,
                    'message': 'No valid fields to update'
                }), 400
            
            # Add updated timestamp
            update_fields.append("date_updated = CURRENT_TIMESTAMP")
            values.append(store_id)  # For WHERE clause
            
            # Execute update
            sql = f"UPDATE stores SET {', '.join(update_fields)} WHERE store_id = %s"
            cursor.execute(sql, values)
            
            # Get the database connection for commit
            db = get_db()
            db.commit()
            
            return jsonify({
                'success': True,
                'message': 'Store updated successfully'
            }), 200
            
    except Exception as e:
        # Rollback on error
        db = get_db()
        db.rollback()
        print(f"Error updating store: {e}")
        return jsonify({
            'success': False,
            'message': f'Error updating store: {str(e)}'
        }), 500

@stores_bp.route('/test', methods=['GET'])  # Changed from '/stores/test'
def test_stores():
    return jsonify({
        'success': True,
        'message': 'Stores endpoint is working'
    })

@stores_bp.route('/schema', methods=['GET'])  # Changed from '/stores/schema'
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