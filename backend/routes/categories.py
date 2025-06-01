from flask import Blueprint, jsonify
from database.db import get_cursor

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT category_id, name, description, image_url 
                FROM categories
                ORDER BY name
            """)
            categories = cursor.fetchall()
            
            # Convert to a list of dictionaries for JSON response
            result = []
            for cat in categories:
                if isinstance(cat, tuple):
                    # If result is tuple, build dict
                    result.append({
                        'category_id': cat[0],
                        'name': cat[1],
                        'description': cat[2],
                        'image_url': cat[3]
                    })
                else:
                    # If result is already a dict-like object
                    result.append(cat)
            
            return jsonify({
                'success': True,
                'categories': result
            }), 200
            
    except Exception as e:
        import traceback
        print(f"Error fetching categories: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False, 
            'message': f'Error fetching categories: {str(e)}'
        }), 500