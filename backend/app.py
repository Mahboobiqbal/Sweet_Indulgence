from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from database.db import init_app

# Import routes
from routes.auth import auth_bp
from routes.users import users_bp
from routes.stores import stores_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.cart import cart_bp
from routes.wishlist import wishlist_bp
from routes.reviews import reviews_bp
from routes.loyalty import loyalty_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    # Initialize extensions
    CORS(app)
    JWTManager(app)
    init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(loyalty_bp, url_prefix='/api/loyalty')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'message': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'OK', 'message': 'Server is running'}), 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)