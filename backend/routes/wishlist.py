from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import get_cursor, get_db
import uuid
from datetime import datetime

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('', methods=['GET'], strict_slashes=False)
@wishlist_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_wishlist():
    """Get user's wishlist"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Get or create wishlist for user
            cursor.execute("SELECT wishlist_id FROM wishlist WHERE user_id = %s", (user_id,))
            wishlist = cursor.fetchone()
            
            if not wishlist:
                # Create wishlist if it doesn't exist
                wishlist_id = str(uuid.uuid4())
                cursor.execute(
                    "INSERT INTO wishlist (wishlist_id, user_id) VALUES (%s, %s)",
                    (wishlist_id, user_id)
                )
                db = get_db()
                db.commit()
            else:
                wishlist_id = wishlist['wishlist_id']
            
            # Get wishlist items with product details
            sql = """
                SELECT 
                    wi.wishlist_item_id, wi.date_added,
                    p.product_id, p.name, p.description, p.price, p.sale_price,
                    p.stock_quantity, p.is_featured, p.is_active,
                    c.name as category_name,
                    s.name as store_name, s.store_id,
                    pi.image_url as primary_image_url
                FROM wishlist_items wi
                JOIN products p ON wi.product_id = p.product_id
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN stores s ON p.store_id = s.store_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = true
                WHERE wi.wishlist_id = %s AND p.is_active = true
                ORDER BY wi.date_added DESC
            """
            cursor.execute(sql, (wishlist_id,))
            items = cursor.fetchall()
            
            # Convert to list of dictionaries
            wishlist_items = []
            for item in items:
                wishlist_items.append({
                    'wishlist_item_id': item['wishlist_item_id'],
                    'product_id': item['product_id'],
                    'name': item['name'],
                    'description': item['description'],
                    'price': float(item['price']),
                    'sale_price': float(item['sale_price']) if item['sale_price'] else None,
                    'stock_quantity': item['stock_quantity'],
                    'image_url': item['primary_image_url'],
                    'is_featured': item['is_featured'],
                    'category_name': item['category_name'],
                    'store_name': item['store_name'],
                    'store_id': item['store_id'],
                    'date_added': item['date_added'].isoformat() if item['date_added'] else None
                })
        
        return jsonify({
            'success': True,
            'items': wishlist_items,
            'total_items': len(wishlist_items)
        }), 200
        
    except Exception as e:
        print(f"Error fetching wishlist: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    """Add item to wishlist"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        # Validate required fields
        if 'product_id' not in data:
            return jsonify({
                'success': False,
                'message': 'Product ID is required'
            }), 400
        
        product_id = data['product_id']
        
        with get_cursor() as cursor:
            # Check if product exists and is active
            cursor.execute(
                "SELECT product_id FROM products WHERE product_id = %s AND is_active = true",
                (product_id,)
            )
            product = cursor.fetchone()
            
            if not product:
                return jsonify({
                    'success': False,
                    'message': 'Product not found or inactive'
                }), 404
            
            # Get or create wishlist for user
            cursor.execute("SELECT wishlist_id FROM wishlist WHERE user_id = %s", (user_id,))
            wishlist = cursor.fetchone()
            
            db = get_db()
            if not wishlist:
                # Create wishlist if it doesn't exist
                wishlist_id = str(uuid.uuid4())
                cursor.execute(
                    "INSERT INTO wishlist (wishlist_id, user_id) VALUES (%s, %s)",
                    (wishlist_id, user_id)
                )
                db.commit()
            else:
                wishlist_id = wishlist['wishlist_id']
            
            # Check if item is already in wishlist
            cursor.execute(
                "SELECT wishlist_item_id FROM wishlist_items WHERE wishlist_id = %s AND product_id = %s",
                (wishlist_id, product_id)
            )
            existing_item = cursor.fetchone()
            
            if existing_item:
                return jsonify({
                    'success': False,
                    'message': 'Product is already in your wishlist'
                }), 409
            
            # Add item to wishlist
            wishlist_item_id = str(uuid.uuid4())
            cursor.execute(
                "INSERT INTO wishlist_items (wishlist_item_id, wishlist_id, product_id) VALUES (%s, %s, %s)",
                (wishlist_item_id, wishlist_id, product_id)
            )
            
            db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item added to wishlist successfully',
            'wishlist_item_id': wishlist_item_id
        }), 201
        
    except Exception as e:
        db = get_db()
        db.rollback()
        print(f"Error adding to wishlist: {e}")
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
            # Verify the item belongs to the user's wishlist
            sql = """
                SELECT wi.wishlist_item_id 
                FROM wishlist_items wi
                JOIN wishlist w ON wi.wishlist_id = w.wishlist_id
                WHERE wi.wishlist_item_id = %s AND w.user_id = %s
            """
            cursor.execute(sql, (item_id, user_id))
            item = cursor.fetchone()
            
            if not item:
                return jsonify({
                    'success': False,
                    'message': 'Wishlist item not found or does not belong to you'
                }), 404
            
            # Remove the item
            cursor.execute("DELETE FROM wishlist_items WHERE wishlist_item_id = %s", (item_id,))
            
            db = get_db()
            db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item removed from wishlist successfully'
        }), 200
        
    except Exception as e:
        db = get_db()
        db.rollback()
        print(f"Error removing from wishlist: {e}")
        return jsonify({
            'success': False,
            'message': f'Error removing from wishlist: {str(e)}'
        }), 500

@wishlist_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_wishlist():
    """Clear all items from wishlist"""
    try:
        user_id = get_jwt_identity()
        
        with get_cursor() as cursor:
            # Get user's wishlist
            cursor.execute("SELECT wishlist_id FROM wishlist WHERE user_id = %s", (user_id,))
            wishlist = cursor.fetchone()
            
            if wishlist:
                # Remove all items from wishlist
                cursor.execute("DELETE FROM wishlist_items WHERE wishlist_id = %s", (wishlist['wishlist_id'],))
                
                db = get_db()
                db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Wishlist cleared successfully'
        }), 200
        
    except Exception as e:
        db = get_db()
        db.rollback()
        print(f"Error clearing wishlist: {e}")
        return jsonify({
            'success': False,
            'message': f'Error clearing wishlist: {str(e)}'
        }), 500