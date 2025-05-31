from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from dotenv import load_dotenv
from database.db import init_app
import os
from flask import request, make_response
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

def create_app():
    app = Flask(__name__)
    
    # Load environment variables
    load_dotenv()
    
    # Configure CORS with specific settings
    CORS(app, 
         origins=["http://localhost:5173"],  # Your frontend URL
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True)
    
    # Handle preflight requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
            response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
            response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
            return response

    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    # Initialize extensions
    jwt = JWTManager(app)
    init_app(app)
    
    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token has expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Invalid token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Authorization token is required'
        }), 401
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(products_bp, url_prefix='/api')  # Changed this
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