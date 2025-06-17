from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth import role_required
from database.db import get_cursor

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_my_orders():
    """Get orders for the current user"""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Placeholder response until Order model is implemented
    return jsonify({
        'success': True,
        'message': 'Orders endpoint - Get my orders',
        'orders': [],
        'pagination': {
            'total': 0,
            'page': page,
            'limit': limit,
            'pages': 0
        }
    }), 200

@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get order by ID"""
    user_id = get_jwt_identity()
    
    # Placeholder response until Order model is implemented
    return jsonify({
        'success': True,
        'message': f'Order endpoint - Get order {order_id}',
        'order': None
    }), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """Create a new order"""
    user_id = get_jwt_identity()
    data = request.json
    
    # Placeholder response until Order model is implemented
    return jsonify({
        'success': True,
        'message': 'Order created successfully (placeholder)',
        'order_id': 'sample-id'
    }), 201

@orders_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
@role_required('supplier', 'admin')
def update_order_status(order_id):
    """Update order status"""
    user_id = get_jwt_identity()
    data = request.json
    
    # Check if status is provided
    if 'status' not in data:
        return jsonify({
            'success': False,
            'message': 'Status is required'
        }), 400
        
    # Placeholder response until Order model is implemented
    return jsonify({
        'success': True,
        'message': f'Order {order_id} status updated successfully (placeholder)'
    }), 200

@orders_bp.route('/store/<store_id>', methods=['GET'])
@jwt_required()
@role_required('supplier', 'admin')
def get_store_orders(store_id):
    """Get all orders for a store"""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Placeholder response until Order model is implemented
    return jsonify({
        'success': True,
        'message': f'Orders for store {store_id}',
        'orders': [],
        'pagination': {
            'total': 0,
            'page': page,
            'limit': limit,
            'pages': 0
        }
    }), 200

@orders_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_order_stats():
    """Get order statistics for the current user's store"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Get the user's store first
            cursor.execute("SELECT store_id FROM stores WHERE owner_id = %s AND is_active = true", (user_id,))
            store = cursor.fetchone()
            
            if not store:
                return jsonify({
                    'success': True,
                    'stats': {
                        'total_orders': 0,
                        'pending_orders': 0,
                        'processing_orders': 0,
                        'completed_orders': 0,
                        'cancelled_orders': 0,
                        'total_revenue': 0,
                        'orders_today': 0
                    }
                }), 200
            
            store_id = store['store_id']
            
            # Get order statistics - FIXED: using date_created instead of order_date
            stats_queries = {
                'total_orders': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s
                """,
                'pending_orders': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s AND o.status = 'pending'
                """,
                'processing_orders': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s AND o.status = 'processing'
                """,
                'completed_orders': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s AND o.status = 'delivered'
                """,
                'cancelled_orders': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s AND o.status = 'cancelled'
                """,
                'orders_today': """
                    SELECT COUNT(DISTINCT o.order_id) as count FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE p.store_id = %s AND DATE(o.date_created) = CURRENT_DATE
                """
            }
            
            stats = {}
            
            # Execute each query
            for stat_name, query in stats_queries.items():
                cursor.execute(query, (store_id,))
                result = cursor.fetchone()
                stats[stat_name] = result['count'] if result else 0
            
            # Get total revenue - FIXED: using unit_price from order_items instead of price
            cursor.execute("""
                SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total_revenue
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                WHERE p.store_id = %s AND o.status IN ('delivered', 'processing')
            """, (store_id,))
            
            revenue_result = cursor.fetchone()
            stats['total_revenue'] = float(revenue_result['total_revenue']) if revenue_result['total_revenue'] else 0
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error fetching order stats: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching order stats: {str(e)}'
        }), 500