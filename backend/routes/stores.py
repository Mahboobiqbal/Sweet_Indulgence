from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.store import Store
from models.user import User
from utils.auth import role_required

stores_bp = Blueprint('stores', __name__)

@stores_bp.route('/', methods=['GET'])
def get_stores():
    """Get all stores"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    stores, total = Store.get_all(page, limit)
    
    return jsonify({
        'success': True,
        'stores': stores,
        'pagination': {
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        }
    }), 200

@stores_bp.route('/<store_id>', methods=['GET'])
def get_store(store_id):
    """Get store by ID"""
    store = Store.get_by_id(store_id)
    if not store:
        return jsonify({
            'success': False,
            'message': 'Store not found'
        }), 404
    
    return jsonify({
        'success': True,
        'store': store
    }), 200

@stores_bp.route('/my-stores', methods=['GET'])
@jwt_required()
def get_my_stores():
    """Get stores owned by the current user"""
    user_id = get_jwt_identity()
    
    stores = Store.get_by_owner(user_id)
    
    return jsonify({
        'success': True,
        'stores': stores
    }), 200

@stores_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('supplier', 'admin')
def create_store():
    """Create a new store"""
    user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'address', 'city', 'phone']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Add owner_id to data
    data['owner_id'] = user_id
    
    try:
        store_id = Store.create(data)
        
        return jsonify({
            'success': True,
            'message': 'Store created successfully',
            'store_id': store_id
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create store',
            'error': str(e)
        }), 500

@stores_bp.route('/<store_id>', methods=['PUT'])
@jwt_required()
def update_store(store_id):
    """Update a store"""
    user_id = get_jwt_identity()
    data = request.json
    
    # Check if store exists
    store = Store.get_by_id(store_id)
    if not store:
        return jsonify({
            'success': False,
            'message': 'Store not found'
        }), 404
    
    # Check if user owns the store or is admin
    user = User.get_by_id(user_id)
    if store['owner_id'] != user_id and user['role'] != 'admin':
        return jsonify({
            'success': False,
            'message': 'You are not authorized to update this store'
        }), 403
    
    try:
        success = Store.update(store_id, data)
        if not success:
            return jsonify({
                'success': False,
                'message': 'No changes made to store'
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Store updated successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update store',
            'error': str(e)
        }), 500

@stores_bp.route('/<store_id>', methods=['DELETE'])
@jwt_required()
def delete_store(store_id):
    """Delete a store"""
    user_id = get_jwt_identity()
    
    # Check if store exists
    store = Store.get_by_id(store_id)
    if not store:
        return jsonify({
            'success': False,
            'message': 'Store not found'
        }), 404
    
    # Check if user owns the store or is admin
    user = User.get_by_id(user_id)
    if store['owner_id'] != user_id and user['role'] != 'admin':
        return jsonify({
            'success': False,
            'message': 'You are not authorized to delete this store'
        }), 403
    
    try:
        success = Store.delete(store_id)
        if not success:
            return jsonify({
                'success': False,
                'message': 'Failed to delete store'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Store deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete store',
            'error': str(e)
        }), 500