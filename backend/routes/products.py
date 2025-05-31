from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid

products_bp = Blueprint('products', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
UPLOAD_FOLDER = 'uploads/products'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@products_bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    """Add a new product"""
    try:
        # Debug: Check JWT token
        try:
            user_id = get_jwt_identity()
            print(f"JWT User ID: {user_id}")
        except Exception as jwt_error:
            print(f"JWT Error: {jwt_error}")
            return jsonify({
                'success': False,
                'message': 'Invalid or expired token'
            }), 401

        # Verify user is a supplier and get their store
        from database.db import get_cursor
        
        with get_cursor() as cursor:
            # Check if user exists and is supplier
            sql = "SELECT user_id, role, email FROM users WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            
            print(f"User found: {user}")
            
            if not user:
                return jsonify({
                    'success': False,
                    'message': 'User not found'
                }), 404
                
            if user['role'] != 'supplier':
                return jsonify({
                    'success': False,
                    'message': 'Only suppliers can add products'
                }), 403

            # Get supplier's store
            sql = "SELECT store_id, name FROM stores WHERE owner_id = %s AND is_active = TRUE"
            cursor.execute(sql, (user_id,))
            store = cursor.fetchone()
            
            print(f"Store found: {store}")
            
            if not store:
                return jsonify({
                    'success': False,
                    'message': 'No active store found for this supplier. Please create a store first.'
                }), 400

        # Get form data
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        sale_price = request.form.get('sale_price')
        category_id = request.form.get('category_id')
        stock_quantity = request.form.get('stock_quantity')
        is_featured = request.form.get('is_featured', 'false').lower() == 'true'
        is_active = request.form.get('is_active', 'true').lower() == 'true'
        loyalty_points_earned = request.form.get('loyalty_points_earned', '0')

        print(f"Form data received: name={name}, price={price}, category={category_id}, stock={stock_quantity}")

        # Validate required fields
        if not all([name, description, price, category_id, stock_quantity]):
            missing_fields = []
            if not name: missing_fields.append('name')
            if not description: missing_fields.append('description')
            if not price: missing_fields.append('price')
            if not category_id: missing_fields.append('category_id')
            if not stock_quantity: missing_fields.append('stock_quantity')
            
            return jsonify({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Validate price
        try:
            price = float(price)
            if price <= 0:
                raise ValueError
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid price'
            }), 400

        # Validate sale price if provided
        if sale_price:
            try:
                sale_price = float(sale_price)
                if sale_price >= price:
                    return jsonify({
                        'success': False,
                        'message': 'Sale price must be less than regular price'
                    }), 400
            except ValueError:
                sale_price = None
        else:
            sale_price = None

        # Validate stock quantity
        try:
            stock_quantity = int(stock_quantity)
            if stock_quantity < 0:
                raise ValueError
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid stock quantity'
            }), 400

        # Validate loyalty points
        try:
            loyalty_points_earned = int(loyalty_points_earned) if loyalty_points_earned else 0
        except ValueError:
            loyalty_points_earned = 0

        # Handle file upload
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Create upload directory if it doesn't exist
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                
                # Generate unique filename
                file_extension = file.filename.rsplit('.', 1)[1].lower()
                image_filename = f"{uuid.uuid4()}.{file_extension}"
                file_path = os.path.join(UPLOAD_FOLDER, image_filename)
                file.save(file_path)
                image_url = f"/uploads/products/{image_filename}"
                print(f"Image saved: {image_url}")

        # Generate product ID
        product_id = str(uuid.uuid4())

        # Insert product into database
        with get_cursor() as cursor:
            sql = """
                INSERT INTO products (
                    product_id, store_id, category_id, name, description, price, 
                    sale_price, stock_quantity, is_featured, is_active,
                    loyalty_points_earned, date_created, date_updated
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                product_id, store['store_id'], category_id, name, description, price,
                sale_price, stock_quantity, is_featured, is_active,
                loyalty_points_earned, datetime.utcnow(), datetime.utcnow()
            ))

            # If image was uploaded, add it to product_images table
            if image_url:
                image_id = str(uuid.uuid4())
                sql = """
                    INSERT INTO product_images (
                        image_id, product_id, image_url, is_primary, display_order
                    ) VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (image_id, product_id, image_url, True, 0))

        print(f"Product created successfully: {product_id}")

        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'product_id': product_id
        }), 201

    except Exception as e:
        print(f"Error adding product: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'An error occurred while adding the product'
        }), 500

@products_bp.route('/products', methods=['GET'])  # Changed route
def get_products():
    """Get all products with filters"""
    try:
        store_id = request.args.get('store_id')
        category_id = request.args.get('category_id')
        search = request.args.get('search')
        is_featured = request.args.get('is_featured')
        
        from database.db import get_cursor
        
        with get_cursor() as cursor:
            # Build query based on filters
            sql = """
                SELECT p.*, s.name as store_name, s.city as store_city,
                       pi.image_url, c.name as category_name
                FROM products p
                JOIN stores s ON p.store_id = s.store_id
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
                WHERE p.is_active = TRUE AND s.is_active = TRUE
            """
            params = []
            
            if store_id:
                sql += " AND p.store_id = %s"
                params.append(store_id)
            
            if category_id:
                sql += " AND p.category_id = %s"
                params.append(category_id)
            
            if search:
                sql += " AND (p.name ILIKE %s OR p.description ILIKE %s)"
                params.extend([f"%{search}%", f"%{search}%"])
            
            if is_featured:
                sql += " AND p.is_featured = %s"
                params.append(is_featured.lower() == 'true')
            
            sql += " ORDER BY p.date_created DESC"
            
            cursor.execute(sql, params)
            products = cursor.fetchall()

        return jsonify({
            'success': True,
            'products': products
        }), 200

    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while fetching products'
        }), 500