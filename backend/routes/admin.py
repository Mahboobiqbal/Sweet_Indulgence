from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.auth import role_required
from database.db import get_cursor

# FIX: pass __name__ as the import_name
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def paginate():
    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = max(1, min(100, int(request.args.get('limit', 20))))
    except:
        page, limit = 1, 20
    return page, limit, (page-1)*limit

@admin_bp.route('/overview', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def overview():
    try:
        with get_cursor() as cur:
            cur.execute("SELECT COUNT(*) AS total_users FROM users")
            total_users = cur.fetchone()['total_users']

            cur.execute("SELECT COUNT(*) AS total_stores FROM stores")
            total_stores = cur.fetchone()['total_stores']

            cur.execute("SELECT COUNT(*) AS total_products FROM products")
            total_products = cur.fetchone()['total_products']

            cur.execute("SELECT COUNT(*) AS total_orders FROM orders")
            total_orders = cur.fetchone()['total_orders']

            cur.execute("""
                SELECT COALESCE(SUM(oi.total_price), 0) AS revenue_total
                FROM orders o
                JOIN order_items oi ON oi.order_id = o.order_id
                WHERE o.payment_status = 'paid'
            """)
            revenue_total = float(cur.fetchone()['revenue_total'] or 0)

            cur.execute("""
                SELECT s.store_id, s.name AS store_name, s.city,
                       COALESCE(SUM(oi.total_price), 0) AS revenue,
                       COUNT(DISTINCT o.order_id) AS orders_count
                FROM stores s
                LEFT JOIN orders o ON o.store_id = s.store_id AND o.payment_status = 'paid'
                LEFT JOIN order_items oi ON oi.order_id = o.order_id
                GROUP BY s.store_id
                ORDER BY revenue DESC
                LIMIT 5
            """)
            top_stores = cur.fetchall()

            cur.execute("""
                SELECT TO_CHAR(DATE(o.date_created), 'YYYY-MM-DD') AS day,
                       COALESCE(SUM(oi.total_price), 0) AS revenue,
                       COUNT(DISTINCT o.order_id) AS orders
                FROM orders o
                JOIN order_items oi ON oi.order_id = o.order_id
                WHERE o.payment_status = 'paid'
                  AND o.date_created >= (CURRENT_DATE - INTERVAL '6 day')
                GROUP BY day
                ORDER BY day ASC
            """)
            sales_7d = cur.fetchall()

            return jsonify({
                'success': True,
                'totals': {
                    'users': total_users,
                    'stores': total_stores,
                    'products': total_products,
                    'orders': total_orders,
                    'revenue': revenue_total
                },
                'top_stores': top_stores,
                'sales_7d': sales_7d
            })
    except Exception as e:
        print("Admin overview error:", e)
        return jsonify({'success': False, 'message': 'Failed to load overview'}), 500

@admin_bp.route('/products', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def products():
    try:
        page, limit, offset = paginate()
        search = request.args.get('search', '').strip()
        sort = request.args.get('sort', 'date')
        order = request.args.get('order', 'desc').lower()
        order = 'asc' if order == 'asc' else 'desc'

        sort_map = {
            'date': 'p.date_created',
            'name': 'p.name',
            'price': 'p.price',
            'sale_price': 'p.sale_price',
            'stock': 'p.stock_quantity'
        }
        sort_col = sort_map.get(sort, 'p.date_created')

        where = []
        params = []
        if search:
            like = f"%{search}%"
            where.append("(p.name ILIKE %s OR s.name ILIKE %s)")
            params.extend([like, like])
        where_sql = f"WHERE {' AND '.join(where)}" if where else ""

        with get_cursor() as cur:
            cur.execute(f"""
                SELECT COUNT(*) AS total
                FROM products p
                JOIN stores s ON s.store_id = p.store_id
                {where_sql}
            """, tuple(params))
            total = cur.fetchone()['total']

            cur.execute(f"""
                SELECT 
                    p.product_id,
                    p.name AS product_name,
                    p.price,
                    p.sale_price,
                    p.stock_quantity,
                    p.is_active,
                    p.is_featured,
                    p.date_created,
                    s.name AS store_name,
                    s.city AS store_city
                FROM products p
                JOIN stores s ON s.store_id = p.store_id
                {where_sql}
                ORDER BY {sort_col} {order}
                LIMIT %s OFFSET %s
            """, tuple(params + [limit, offset]))
            rows = cur.fetchall()

            return jsonify({'success': True, 'total': total, 'products': rows})
    except Exception as e:
        print("Admin products error:", e)
        return jsonify({'success': False, 'message': 'Failed to load products'}), 500