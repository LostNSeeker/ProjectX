import os
import json
import hashlib
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import stripe
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Enable CORS for frontend
from flask_cors import CORS, cross_origin

# Simple CORS configuration
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

jwt = JWTManager(app)

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Initialize Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# User data storage (in production, use a proper database)
USERS_FILE = 'users.json'
ONBOARDING_FILE = 'onboarding_data.json'

def load_users():
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def create_admin_user():
    """Create admin user if it doesn't exist"""
    users = load_users()
    admin_email = 'admin@projectx.com'
    admin_password = 'password123'
    
    if admin_email not in users:
        users[admin_email] = {
            'id': 'admin_user_001',
            'email': admin_email,
            'password_hash': generate_password_hash(admin_password),
            'created_at': datetime.now().isoformat(),
            'payment_completed': True,
            'is_admin': True,
            'role': 'admin'
        }
        save_users(users)
        print(f"Admin user created: {admin_email} / {admin_password}")
    else:
        # Update existing admin password
        users[admin_email]['password_hash'] = generate_password_hash(admin_password)
        save_users(users)
        print(f"Admin user password updated: {admin_email} / {admin_password}")

def load_onboarding_data():
    try:
        with open(ONBOARDING_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_onboarding_data(data):
    with open(ONBOARDING_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({})
        return response
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        payment_intent_id = data.get('payment_intent_id')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Verify payment with Stripe
        if payment_intent_id:
            try:
                intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                if intent.status != 'succeeded':
                    return jsonify({'error': 'Payment not completed'}), 400
            except stripe.error.StripeError:
                return jsonify({'error': 'Invalid payment'}), 400
        
        users = load_users()
        
        if email in users:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        user_id = secrets.token_urlsafe(16)
        users[email] = {
            'id': user_id,
            'email': email,
            'password_hash': generate_password_hash(password),
            'created_at': datetime.now().isoformat(),
            'payment_completed': bool(payment_intent_id)
        }
        
        save_users(users)
        
        # Create access token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({})
        return response
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        users = load_users()
        
        if email not in users:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user = users[email]
        
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=email)
        
        response = jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': user['id']
        })
        return response, 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        email = get_jwt_identity()
        users = load_users()
        
        if email not in users:
            return jsonify({'error': 'User not found'}), 404
        
        user = users[email]
        return jsonify({
            'id': user['id'],
            'email': user['email'],
            'created_at': user['created_at'],
            'payment_completed': user['payment_completed'],
            'is_admin': user.get('is_admin', False),
            'role': user.get('role', 'user')
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/create-intent', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:5173', 'http://localhost:3000'])
def create_payment_intent():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({})
        return response
    
    try:
        data = request.get_json()
        amount = data.get('amount', 10000)  # $100 in cents
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            metadata={'service': 'job_form_autofill'}
        )
        
        response = jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        return response, 200
        
    except stripe.error.StripeError as e:
        response = jsonify({'error': str(e)})
        return response, 400
    except Exception as e:
        response = jsonify({'error': str(e)})
        return response, 500

@app.route('/api/onboarding', methods=['POST'])
@jwt_required()
def save_onboarding_data():
    try:
        email = get_jwt_identity()
        data = request.get_json()
        
        onboarding_data = load_onboarding_data()
        onboarding_data[email] = {
            'user_email': email,
            'data': data,
            'created_at': datetime.now().isoformat()
        }
        
        save_onboarding_data(onboarding_data)
        
        return jsonify({'message': 'Onboarding data saved successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/onboarding', methods=['GET'])
@jwt_required()
def get_onboarding_data():
    try:
        email = get_jwt_identity()
        onboarding_data = load_onboarding_data()
        
        if email not in onboarding_data:
            return jsonify({'error': 'Onboarding data not found'}), 404
        
        return jsonify(onboarding_data[email]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/autofill/generate', methods=['POST'])
@jwt_required()
def generate_autofill_data():
    try:
        email = get_jwt_identity()
        data = request.get_json()
        
        # Get user's onboarding data
        onboarding_data = load_onboarding_data()
        if email not in onboarding_data:
            return jsonify({'error': 'User onboarding data not found'}), 404
        
        user_data = onboarding_data[email]['data']
        form_fields = data.get('form_fields', [])
        job_description = data.get('job_description', '')
        
        # Create prompt for Gemini
        prompt = f"""
        Based on the following user profile and job application form, generate appropriate responses for each form field.
        
        User Profile:
        {json.dumps(user_data, indent=2)}
        
        Job Description:
        {job_description}
        
        Form Fields to Fill:
        {json.dumps(form_fields, indent=2)}
        
        Please generate a JSON response with appropriate values for each field based on the user's profile and the job requirements.
        Be professional, accurate, and tailor responses to match the job description.
        """
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'generated_data': response.text,
            'user_data': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin endpoints
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (admin only)"""
    try:
        email = get_jwt_identity()
        users = load_users()
        
        # Check if user is admin
        if email not in users or not users[email].get('is_admin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        # Return all users (without password hashes)
        admin_users = {}
        for user_email, user_data in users.items():
            admin_users[user_email] = {
                'id': user_data['id'],
                'email': user_data['email'],
                'created_at': user_data['created_at'],
                'payment_completed': user_data['payment_completed'],
                'is_admin': user_data.get('is_admin', False),
                'role': user_data.get('role', 'user')
            }
        
        return jsonify(admin_users), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/onboarding-data', methods=['GET'])
@jwt_required()
def get_all_onboarding_data():
    """Get all onboarding data (admin only)"""
    try:
        email = get_jwt_identity()
        users = load_users()
        
        # Check if user is admin
        if email not in users or not users[email].get('is_admin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        onboarding_data = load_onboarding_data()
        return jsonify(onboarding_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    """Get admin statistics"""
    try:
        email = get_jwt_identity()
        users = load_users()
        
        # Check if user is admin
        if email not in users or not users[email].get('is_admin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        onboarding_data = load_onboarding_data()
        
        stats = {
            'total_users': len(users),
            'admin_users': len([u for u in users.values() if u.get('is_admin', False)]),
            'paid_users': len([u for u in users.values() if u.get('payment_completed', False)]),
            'users_with_onboarding': len(onboarding_data),
            'recent_users': len([u for u in users.values() 
                               if datetime.fromisoformat(u['created_at'].replace('Z', '+00:00')) > 
                               datetime.now() - timedelta(days=7)])
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create admin user on startup
    create_admin_user()
    app.run(debug=True, port=8001)
