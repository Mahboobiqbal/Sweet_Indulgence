from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import get_cursor, get_db
import uuid
from datetime import datetime

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('', methods=['GET'])  # Remove the trailing slash
@wishlist_bp.route('/', methods=['GET'])  # Keep this for compatibility
@jwt_required()
def get_wishlist():
    """Get user's wishlist items"""
    try:
        user_id = get_jwt_identity()
        print(f"DEBUG: Getting wishlist for user: {user_id}")
        
        with get_cursor() as cursor:
            # Simple query to get wishlist items
            cursor.execute("""
                SELECT 
                    wi.wishlist_item_id,
                    wi.product_id,
                    wi.date_added,
                    p.name,
                    p.description,
                    p.price,
                    p.sale_price,
                    p.stock_quantity,
                    p.is_featured,
                    s.name as store_name,
                    COALESCE(c.name, 'Uncategorized') as category_name,
                    COALESCE(pi.image_url, '') as image_url
                FROM wishlist w
                JOIN wishlist_items wi ON w.wishlist_id = wi.wishlist_id
                JOIN products p ON wi.product_id = p.product_id
                JOIN stores s ON p.store_id = s.store_id
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = true
                WHERE w.user_id = %s AND p.is_active = true
                ORDER BY wi.date_added DESC
            """, (user_id,))
            
            rows = cursor.fetchall()
            print(f"DEBUG: Found {len(rows)} wishlist items")
            
            items_list = []
            for row in rows:
                # Handle both tuple and dict returns
                if isinstance(row, dict):
                    item_data = row
                else:
                    # Convert tuple to dict
                    columns = [desc[0] for desc in cursor.description]
                    item_data = dict(zip(columns, row))
                
                items_list.append({
                    'wishlist_item_id': item_data['wishlist_item_id'],
                    'product_id': item_data['product_id'],
                    'name': item_data['name'],
                    'description': item_data['description'],
                    'price': float(item_data['price']),
                    'sale_price': float(item_data['sale_price']) if item_data['sale_price'] else None,
                    'stock_quantity': item_data['stock_quantity'],
                    'is_featured': item_data['is_featured'],
                    'store_name': item_data['store_name'],
                    'category_name': item_data['category_name'],
                    'image_url': item_data['image_url'],
                    'date_added': item_data['date_added'].isoformat() if item_data['date_added'] else None
                })
        
        print(f"DEBUG: Returning {len(items_list)} items")
        return jsonify({
            'success': True,
            'items': items_list,
            'count': len(items_list)
        }), 200
        
    except Exception as e:
        print(f"Error getting wishlist: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Error getting wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    """Add item to wishlist"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        print(f"DEBUG: Adding to wishlist - user_id: {user_id}, data: {data}")
        
        # Validate required fields
        if 'product_id' not in data:
            return jsonify({
                'success': False,
                'message': 'Product ID is required'
            }), 400
        
        product_id = data['product_id']
        
        # Use a simpler approach with get_cursor
        with get_cursor() as cursor:
            # Check if product exists and is active
            cursor.execute("""
                SELECT product_id, name, is_active 
                FROM products 
                WHERE product_id = %s
            """, (product_id,))
            product_row = cursor.fetchone()
            
            if not product_row:
                return jsonify({
                    'success': False,
                    'message': 'Product not found'
                }), 404
            
            # Handle both dict and tuple returns
            if isinstance(product_row, dict):
                product_name = product_row['name']
                is_active = product_row['is_active']
            else:
                product_name = product_row[1]
                is_active = product_row[2]
            
            if not is_active:
                return jsonify({
                    'success': False,
                    'message': 'Product is not available'
                }), 400
            
            # Get or create user's wishlist
            cursor.execute("""
                SELECT wishlist_id FROM wishlist WHERE user_id = %s
            """, (user_id,))
            wishlist_row = cursor.fetchone()
            
            if wishlist_row:
                wishlist_id = wishlist_row[0] if isinstance(wishlist_row, tuple) else wishlist_row['wishlist_id']
            else:
                # Create wishlist for user
                wishlist_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO wishlist (wishlist_id, user_id, date_created)
                    VALUES (%s, %s, %s)
                """, (wishlist_id, user_id, datetime.utcnow()))
                print(f"DEBUG: Created new wishlist {wishlist_id} for user {user_id}")
            
            # Check if item already exists in wishlist
            cursor.execute("""
                SELECT wishlist_item_id 
                FROM wishlist_items 
                WHERE wishlist_id = %s AND product_id = %s
            """, (wishlist_id, product_id))
            existing_item = cursor.fetchone()
            
            if existing_item:
                print(f"DEBUG: Product already in wishlist")
                return jsonify({
                    'success': True,  # Changed to True since it's already added
                    'message': f'{product_name} is already in your wishlist',
                    'already_exists': True
                }), 200  # Changed to 200 instead of 409
            
            # Add new item to wishlist
            wishlist_item_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO wishlist_items (wishlist_item_id, wishlist_id, product_id, date_added)
                VALUES (%s, %s, %s, %s)
            """, (wishlist_item_id, wishlist_id, product_id, datetime.utcnow()))
            
            print(f"DEBUG: Wishlist item added successfully")
        
        # get_cursor() automatically commits, so we don't need manual commit
        
        return jsonify({
            'success': True,
            'message': f'{product_name} added to wishlist successfully!',
            'wishlist_item_id': wishlist_item_id
        }), 201
        
    except Exception as e:
        print(f"Error adding to wishlist: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Error adding to wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/remove/<item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(item_id):
    """Remove item from wishlist"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Verify user owns this wishlist item and get product name
            cursor.execute("""
                SELECT wi.wishlist_item_id, p.name
                FROM wishlist w
                JOIN wishlist_items wi ON w.wishlist_id = wi.wishlist_id
                JOIN products p ON wi.product_id = p.product_id
                WHERE wi.wishlist_item_id = %s AND w.user_id = %s
            """, (item_id, user_id))
            
            wishlist_item = cursor.fetchone()
            
            if not wishlist_item:
                return jsonify({
                    'success': False,
                    'message': 'Wishlist item not found'
                }), 404
            
            # Get product name
            product_name = wishlist_item[1] if isinstance(wishlist_item, tuple) else wishlist_item['name']
            
            # Remove item
            cursor.execute("DELETE FROM wishlist_items WHERE wishlist_item_id = %s", (item_id,))
        
        return jsonify({
            'success': True,
            'message': f'{product_name} removed from wishlist successfully'
        }), 200
        
    except Exception as e:
        print(f"Error removing from wishlist: {e}")
        return jsonify({
            'success': False,
            'message': f'Error removing from wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_wishlist():
    """Clear entire wishlist"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Remove all items from user's wishlist
            cursor.execute("""
                DELETE FROM wishlist_items 
                WHERE wishlist_id IN (
                    SELECT wishlist_id FROM wishlist WHERE user_id = %s
                )
            """, (user_id,))
        
        return jsonify({
            'success': True,
            'message': 'Wishlist cleared successfully'
        }), 200
        
    except Exception as e:
        print(f"Error clearing wishlist: {e}")
        return jsonify({
            'success': False,
            'message': f'Error clearing wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/count', methods=['GET'])
@jwt_required()
def get_wishlist_count():
    """Get total number of items in wishlist"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) as total_items
                FROM wishlist w
                JOIN wishlist_items wi ON w.wishlist_id = wi.wishlist_id
                JOIN products p ON wi.product_id = p.product_id
                WHERE w.user_id = %s AND p.is_active = true
            """, (user_id,))
            
            result = cursor.fetchone()
            total_items = result[0] if isinstance(result, tuple) else result['total_items']
        
        return jsonify({
            'success': True,
            'count': total_items
        }), 200
        
    except Exception as e:
        print(f"Error getting wishlist count: {e}")
        return jsonify({
            'success': False,
            'message': f'Error getting wishlist count: {str(e)}'
        }), 500