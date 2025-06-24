from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import get_cursor, get_db
import uuid
from datetime import datetime
import json
import os
from werkzeug.utils import secure_filename

products_bp = Blueprint('products', __name__)

# Configuration for file uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'products')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_product_image(image_file):
    """Save uploaded image and return the file path"""
    if not image_file or not allowed_file(image_file.filename):
        return None
    
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Generate unique filename
    filename = secure_filename(image_file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    
    # Save the file
    image_file.save(file_path)
    
    # Return relative path for database storage
    return f"/uploads/products/{unique_filename}"

# Handle both / and without trailing slash for POST
@products_bp.route('', methods=['POST'], strict_slashes=False)
@products_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_product():
    """Create a new product"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user is a supplier
        with get_cursor() as cursor:
            cursor.execute("SELECT role FROM users WHERE user_id = %s", (user_id,))
            user = cursor.fetchone()
            
            if not user or user['role'] != 'supplier':
                return jsonify({
                    'success': False,
                    'message': 'Only suppliers can add products'
                }), 403
        
        # Get supplier's store
        with get_cursor() as cursor:
            cursor.execute("SELECT store_id FROM stores WHERE owner_id = %s", (user_id,))
            store = cursor.fetchone()
            
            if not store:
                return jsonify({
                    'success': False,
                    'message': 'You need to create a store first'
                }), 400
            
            store_id = store['store_id']
        
        # Get form data
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = request.form.get('price')
        sale_price = request.form.get('sale_price')
        category_id = request.form.get('category_id')
        stock_quantity = request.form.get('stock_quantity')
        is_featured = request.form.get('is_featured', 'false').lower() == 'true'
        is_active = request.form.get('is_active', 'true').lower() == 'true'
        loyalty_points_earned = request.form.get('loyalty_points_earned', '0')
        
        # Validate required fields
        if not all([name, description, price, category_id, stock_quantity]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # Validate numeric fields
        try:
            price = float(price)
            stock_quantity = int(stock_quantity)
            loyalty_points_earned = int(loyalty_points_earned)
            
            if sale_price:
                sale_price = float(sale_price)
                if sale_price >= price:
                    return jsonify({
                        'success': False,
                        'message': 'Sale price must be less than regular price'
                    }), 400
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Invalid numeric values'
            }), 400
        
        # Handle image upload
        image_url = None
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename:
                image_url = save_product_image(image_file)
                if not image_url:
                    return jsonify({
                        'success': False,
                        'message': 'Invalid image file'
                    }), 400
        
        # Generate product ID
        product_id = str(uuid.uuid4())
        
        # Insert product into database (without image_url column)
        db = get_db()
        with db.cursor() as cursor:
            sql = """
                INSERT INTO products (
                    product_id, store_id, category_id, name, description, 
                    price, sale_price, stock_quantity,
                    is_featured, is_active, loyalty_points_earned, date_created
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                product_id, store_id, category_id, name, description,
                price, sale_price, stock_quantity,
                is_featured, is_active, loyalty_points_earned, datetime.utcnow()
            ))
            
            # If image was uploaded, add it to product_images table
            if image_url:
                image_id = str(uuid.uuid4())
                image_sql = """
                    INSERT INTO product_images (
                        image_id, product_id, image_url, is_primary, display_order
                    ) VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(image_sql, (image_id, product_id, image_url, True, 0))
            
            db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'product': {
                'product_id': product_id,
                'name': name,
                'price': price
            }
        }), 201
        
    except Exception as e:
        # Rollback on error
        db = get_db()
        db.rollback()
        print(f"Error creating product: {e}")
        return jsonify({
            'success': False,
            'message': f'Error creating product: {str(e)}'
        }), 500

# Handle both / and without trailing slash for GET
@products_bp.route('', methods=['GET'], strict_slashes=False)
@products_bp.route('/', methods=['GET'], strict_slashes=False)
def get_products():
    """Get all products with pagination and filtering"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 12, type=int)
        category_id = request.args.get('category_id')
        store_id = request.args.get('store_id')
        search = request.args.get('search', '').strip()
        sort = request.args.get('sort', 'date_desc')
        is_featured = request.args.get('is_featured')
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Build WHERE clause
        where_conditions = ["p.is_active = true"]
        params = []
        
        if category_id:
            where_conditions.append("p.category_id = %s")
            params.append(category_id)
        
        if store_id:
            where_conditions.append("p.store_id = %s")
            params.append(store_id)
        
        if search:
            where_conditions.append("(p.name ILIKE %s OR p.description ILIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])
        
        if is_featured == 'true':
            where_conditions.append("p.is_featured = true")
        
        where_clause = " AND ".join(where_conditions)
        
        # Build ORDER BY clause
        if sort == 'price_asc':
            order_clause = "p.price ASC"
        elif sort == 'price_desc':
            order_clause = "p.price DESC"
        elif sort == 'name_asc':
            order_clause = "p.name ASC"
        elif sort == 'name_desc':
            order_clause = "p.name DESC"
        else:  # date_desc (default)
            order_clause = "p.date_created DESC"
        
        with get_cursor() as cursor:
            # Get total count
            count_sql = f"""
                SELECT COUNT(*) as total
                FROM products p
                WHERE {where_clause}
            """
            cursor.execute(count_sql, params)
            total = cursor.fetchone()['total']
            
            # Get products with store, category info, and primary image
            sql = f"""
                SELECT 
                    p.product_id, p.name, p.description, p.price, p.sale_price,
                    p.stock_quantity, p.is_featured, p.loyalty_points_earned,
                    p.date_created, p.date_updated,
                    c.name as category_name,
                    s.name as store_name, s.store_id,
                    pi.image_url as primary_image_url
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN stores s ON p.store_id = s.store_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = true
                WHERE {where_clause}
                ORDER BY {order_clause}
                LIMIT %s OFFSET %s
            """
            
            cursor.execute(sql, params + [limit, offset])
            products = cursor.fetchall()
            
            # Convert to list of dictionaries
            products_list = []
            for product in products:
                products_list.append({
                    'product_id': product['product_id'],
                    'name': product['name'],
                    'description': product['description'],
                    'price': float(product['price']),
                    'sale_price': float(product['sale_price']) if product['sale_price'] else None,
                    'stock_quantity': product['stock_quantity'],
                    'image_url': product['primary_image_url'],  # Primary image from product_images table
                    'is_featured': product['is_featured'],
                    'loyalty_points_earned': product['loyalty_points_earned'],
                    'date_created': product['date_created'],
                    'date_updated': product['date_updated'],
                    'category_name': product['category_name'],
                    'store_name': product['store_name'],
                    'store_id': product['store_id']
                })
        
        return jsonify({
            'success': True,
            'products': products_list,
            'pagination': {
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching products: {str(e)}'
        }), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        with get_cursor() as cursor:
            sql = """
                SELECT 
                    p.*, 
                    c.name as category_name,
                    s.name as store_name, s.store_id
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN stores s ON p.store_id = s.store_id
                WHERE p.product_id = %s
            """
            cursor.execute(sql, (product_id,))
            product = cursor.fetchone()
            
            if not product:
                return jsonify({
                    'success': False,
                    'message': 'Product not found'
                }), 404
            
            # Get all images for this product
            cursor.execute("""
                SELECT image_id, image_url, is_primary, display_order
                FROM product_images 
                WHERE product_id = %s 
                ORDER BY display_order
            """, (product_id,))
            images = cursor.fetchall()
            
            product_dict = dict(product)
            product_dict['images'] = [dict(img) for img in images]
            
            return jsonify({
                'success': True,
                'product': product_dict
            }), 200
            
    except Exception as e:
        print(f"Error fetching product: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching product: {str(e)}'
        }), 500

@products_bp.route('/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user owns this product
        with get_cursor() as cursor:
            sql = """
                SELECT p.*, s.owner_id 
                FROM products p
                JOIN stores s ON p.store_id = s.store_id
                WHERE p.product_id = %s
            """
            cursor.execute(sql, (product_id,))
            product = cursor.fetchone()
            
            if not product:
                return jsonify({
                    'success': False,
                    'message': 'Product not found'
                }), 404
            
            if product['owner_id'] != user_id:
                return jsonify({
                    'success': False,
                    'message': 'You can only update your own products'
                }), 403
        
        # Get update data
        data = request.json
        
        # Build update query dynamically
        update_fields = []
        values = []
        
        updatable_fields = {
            'name': 'name',
            'description': 'description',
            'price': 'price',
            'sale_price': 'sale_price',
            'stock_quantity': 'stock_quantity',
            'is_featured': 'is_featured',
            'is_active': 'is_active',
            'loyalty_points_earned': 'loyalty_points_earned'
        }
        
        for field, column in updatable_fields.items():
            if field in data:
                update_fields.append(f"{column} = %s")
                values.append(data[field])
        
        if not update_fields:
            return jsonify({
                'success': False,
                'message': 'No valid fields to update'
            }), 400
        
        # Add updated timestamp
        update_fields.append("date_updated = CURRENT_TIMESTAMP")
        values.append(product_id)  # For WHERE clause
        
        # Execute update
        db = get_db()
        with db.cursor() as cursor:
            sql = f"UPDATE products SET {', '.join(update_fields)} WHERE product_id = %s"
            cursor.execute(sql, values)
            db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully'
        }), 200
        
    except Exception as e:
        db = get_db()
        db.rollback()
        print(f"Error updating product: {e}")
        return jsonify({
            'success': False,
            'message': f'Error updating product: {str(e)}'
        }), 500

@products_bp.route('/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product (soft delete by setting is_active = false)"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user owns this product
        with get_cursor() as cursor:
            sql = """
                SELECT p.*, s.owner_id 
                FROM products p
                JOIN stores s ON p.store_id = s.store_id
                WHERE p.product_id = %s
            """
            cursor.execute(sql, (product_id,))
            product = cursor.fetchone()
            
            if not product:
                return jsonify({
                    'success': False,
                    'message': 'Product not found'
                }), 404
            
            if product['owner_id'] != user_id:
                return jsonify({
                    'success': False,
                    'message': 'You can only delete your own products'
                }), 403
        
        # Soft delete (set is_active = false)
        db = get_db()
        with db.cursor() as cursor:
            sql = "UPDATE products SET is_active = false, date_updated = CURRENT_TIMESTAMP WHERE product_id = %s"
            cursor.execute(sql, (product_id,))
            db.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        }), 200
        
    except Exception as e:
        db = get_db()
        db.rollback()
        print(f"Error deleting product: {e}")
        return jsonify({
            'success': False,
            'message': f'Error deleting product: {str(e)}'
        }), 500

@products_bp.route('/test-upload', methods=['GET'])
def test_upload_directory():
    """Test endpoint to check upload directory"""
    try:
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'products')
        
        # Check if directory exists
        dir_exists = os.path.exists(upload_dir)
        
        # List files if directory exists
        files = []
        if dir_exists:
            try:
                files = os.listdir(upload_dir)
            except:
                files = ["Error reading directory"]
        
        return jsonify({
            'success': True,
            'upload_directory': upload_dir,
            'directory_exists': dir_exists,
            'files': files
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@products_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_product_stats():
    """Get product statistics for the current user's store"""
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
                        'total_products': 0,
                        'active_products': 0,
                        'featured_products': 0,
                        'out_of_stock': 0,
                        'low_stock': 0,
                        'total_value': 0,
                        'avg_price': 0
                    }
                }), 200
            
            store_id = store['store_id']
            
            # Get comprehensive product statistics
            stats_queries = {
                'total_products': """
                    SELECT COUNT(*) as count FROM products 
                    WHERE store_id = %s
                """,
                'active_products': """
                    SELECT COUNT(*) as count FROM products 
                    WHERE store_id = %s AND is_active = true
                """,
                'featured_products': """
                    SELECT COUNT(*) as count FROM products 
                    WHERE store_id = %s AND is_featured = true AND is_active = true
                """,
                'out_of_stock': """
                    SELECT COUNT(*) as count FROM products 
                    WHERE store_id = %s AND stock_quantity = 0 AND is_active = true
                """,
                'low_stock': """
                    SELECT COUNT(*) as count FROM products 
                    WHERE store_id = %s AND stock_quantity > 0 AND stock_quantity <= 5 AND is_active = true
                """
            }
            
            stats = {}
            
            # Execute each query
            for stat_name, query in stats_queries.items():
                cursor.execute(query, (store_id,))
                result = cursor.fetchone()
                stats[stat_name] = result['count'] if result else 0
            
            # Get total inventory value and average price
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(CASE WHEN sale_price IS NOT NULL THEN sale_price ELSE price END * stock_quantity), 0) as total_value,
                    COALESCE(AVG(CASE WHEN sale_price IS NOT NULL THEN sale_price ELSE price END), 0) as avg_price
                FROM products 
                WHERE store_id = %s AND is_active = true
            """, (store_id,))
            
            financial_stats = cursor.fetchone()
            stats['total_value'] = float(financial_stats['total_value']) if financial_stats['total_value'] else 0
            stats['avg_price'] = float(financial_stats['avg_price']) if financial_stats['avg_price'] else 0
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error fetching product stats: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching product stats: {str(e)}'
        }), 500


@products_bp.route('/featured-products', methods=['GET'])
@jwt_required()
def getFeaturedProducts():
    """Get featured products for the current user's store"""
    try:
        user_id = get_jwt_identity()

        with get_cursor() as cursor:
            # Get the user's store first
            cursor.execute("SELECT store_id FROM stores WHERE owner_id = %s AND is_active = true", (user_id,))
            store = cursor.fetchone()

            if not store:
                return jsonify({
                    'success': True,
                    'featured_products': []
                }), 200

            store_id = store['store_id']

            # Get featured products
            cursor.execute("""
                SELECT * FROM products
                WHERE store_id = %s AND is_featured = true AND is_active = true
            """, (store_id,))
            featured_products = cursor.fetchall()

            return jsonify({
                'success': True,
                'featured_products': featured_products
            }), 200

    except Exception as e:
        print(f"Error fetching featured products: {e}")
        return jsonify({
            'success': False,
            'message': f'Error fetching featured products: {str(e)}'
        }), 500