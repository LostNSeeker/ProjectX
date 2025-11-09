import os
import json
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import stripe
import google.generativeai as genai
from dotenv import load_dotenv
from models import db, User, OnboardingData, CVMetadata

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobform_autofill.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for frontend - allow any origin for testing
from flask_cors import CORS
CORS(app, 
     origins=['*'],  # Allow any origin for testing
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=False)  # Set to False when allowing any origin

# Initialize extensions
jwt = JWTManager(app)
db.init_app(app)

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Initialize Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

@app.route('/api/auth/register', methods=['POST'])
def register():
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
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        user_id = secrets.token_urlsafe(16)
        new_user = User(
            id=user_id,
            email=email,
            password_hash=generate_password_hash(password),
            payment_completed=bool(payment_intent_id),
            payment_intent_id=payment_intent_id
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': user_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user_id': user.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/create-intent', methods=['POST'])
def create_payment_intent():
    try:
        # COMMENTED OUT FOR TESTING - BYPASS STRIPE PAYMENT
        # data = request.get_json()
        # amount = data.get('amount', 10000)  # $100 in cents
        
        # intent = stripe.PaymentIntent.create(
        #     amount=amount,
        #     currency='usd',
        #     metadata={'service': 'job_form_autofill'}
        # )
        
        # Return mock payment intent for testing
        return jsonify({
            'client_secret': 'test_client_secret_123',
            'payment_intent_id': 'test_payment_intent_123'
        }), 200
        
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/onboarding', methods=['POST'])
@jwt_required()
def save_onboarding_data():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Check if onboarding data already exists
        onboarding = OnboardingData.query.filter_by(user_id=user.id).first()
        
        if onboarding:
            # Update existing data
            onboarding.set_data(data)
            onboarding.updated_at = datetime.utcnow()
        else:
            # Create new onboarding data
            onboarding = OnboardingData(
                user_id=user.id,
                data=json.dumps(data, indent=2)
            )
            db.session.add(onboarding)
        
        db.session.commit()
        
        return jsonify({'message': 'Onboarding data saved successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/onboarding', methods=['GET'])
@jwt_required()
def get_onboarding_data():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        onboarding = OnboardingData.query.filter_by(user_id=user.id).first()
        
        if not onboarding:
            return jsonify({'error': 'Onboarding data not found'}), 404
        
        return jsonify(onboarding.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/autofill/generate', methods=['POST'])
@jwt_required()
def generate_autofill_data():
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's onboarding data
        onboarding = OnboardingData.query.filter_by(user_id=user.id).first()
        if not onboarding:
            return jsonify({'error': 'User onboarding data not found'}), 404
        
        user_data = onboarding.get_data()
        form_fields = request.json.get('form_fields', [])
        job_description = request.json.get('job_description', '')
        
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Import and register onboarding API
from onboarding_api import onboarding_bp
app.register_blueprint(onboarding_bp)

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile data"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'profile': {
                'personalInfo': {
                    'firstName': user.first_name or '',
                    'lastName': user.last_name or '',
                    'email': user.email,
                    'phone': user.phone or '',
                    'location': user.location or '',
                    'linkedin': user.linkedin or '',
                    'github': user.github or '',
                    'portfolio': user.portfolio or ''
                },
                'professionalInfo': {
                    'currentRole': user.current_role or '',
                    'experience': user.experience or '',
                    'skills': user.skills.split(',') if user.skills else [],
                    'education': user.education or '',
                    'certifications': user.certifications.split(',') if user.certifications else []
                },
                'preferences': {
                    'jobTypes': user.job_types.split(',') if user.job_types else [],
                    'locations': user.locations.split(',') if user.locations else [],
                    'salaryRange': user.salary_range or '',
                    'remoteWork': user.remote_work or False,
                    'companySize': user.company_size or ''
                },
                'documents': {
                    'resume': user.resume_url or '',
                    'coverLetter': user.cover_letter or ''
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile data"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update personal info
        if 'personalInfo' in data:
            personal = data['personalInfo']
            user.first_name = personal.get('firstName', user.first_name)
            user.last_name = personal.get('lastName', user.last_name)
            user.phone = personal.get('phone', user.phone)
            user.location = personal.get('location', user.location)
            user.linkedin = personal.get('linkedin', user.linkedin)
            user.github = personal.get('github', user.github)
            user.portfolio = personal.get('portfolio', user.portfolio)
        
        # Update professional info
        if 'professionalInfo' in data:
            professional = data['professionalInfo']
            user.current_role = professional.get('currentRole', user.current_role)
            user.experience = professional.get('experience', user.experience)
            user.skills = ','.join(professional.get('skills', [])) if professional.get('skills') else user.skills
            user.education = professional.get('education', user.education)
            user.certifications = ','.join(professional.get('certifications', [])) if professional.get('certifications') else user.certifications
        
        # Update preferences
        if 'preferences' in data:
            preferences = data['preferences']
            user.job_types = ','.join(preferences.get('jobTypes', [])) if preferences.get('jobTypes') else user.job_types
            user.locations = ','.join(preferences.get('locations', [])) if preferences.get('locations') else user.locations
            user.salary_range = preferences.get('salaryRange', user.salary_range)
            user.remote_work = preferences.get('remoteWork', user.remote_work)
            user.company_size = preferences.get('companySize', user.company_size)
        
        # Update documents
        if 'documents' in data:
            documents = data['documents']
            user.cover_letter = documents.get('coverLetter', user.cover_letter)
            # Handle resume file upload if needed
            if 'resume' in documents and documents['resume']:
                # In a real implementation, you'd save the file and store the URL
                user.resume_url = documents['resume']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Admin endpoints
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (admin only)"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        # Return all users (without password hashes)
        users = User.query.all()
        users_list = [{
            'id': u.id,
            'email': u.email,
            'created_at': u.created_at.isoformat(),
            'payment_completed': u.payment_completed,
            'is_admin': u.is_admin,
            'role': u.role
        } for u in users]
        
        return jsonify(users_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    """Get admin statistics"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        total_users = User.query.count()
        admin_users = User.query.filter_by(is_admin=True).count()
        paid_users = User.query.filter_by(payment_completed=True).count()
        users_with_onboarding = db.session.query(OnboardingData).count()
        
        from datetime import timedelta
        recent_cutoff = datetime.utcnow() - timedelta(days=7)
        recent_users = User.query.filter(User.created_at >= recent_cutoff).count()
        
        stats = {
            'total_users': total_users,
            'admin_users': admin_users,
            'paid_users': paid_users,
            'users_with_onboarding': users_with_onboarding,
            'recent_users': recent_users
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/onboarding-data', methods=['GET'])
@jwt_required()
def get_all_onboarding_data():
    """Get all onboarding data (admin only)"""
    try:
        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        onboarding_data = OnboardingData.query.all()
        data_list = [od.to_dict() for od in onboarding_data]
        
        return jsonify(data_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create database tables
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Create admin user if it doesn't exist
        admin = User.query.filter_by(email='admin@projectx.com').first()
        if not admin:
            from werkzeug.security import generate_password_hash
            admin = User(
                id='admin_user_001',
                email='admin@projectx.com',
                password_hash=generate_password_hash('password123'),
                payment_completed=True,
                is_admin=True,
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin@projectx.com / password123")
        else:
            # Update admin password if needed
            from werkzeug.security import generate_password_hash, check_password_hash
            if not check_password_hash(admin.password_hash, 'password123'):
                admin.password_hash = generate_password_hash('password123')
                db.session.commit()
                print("Admin user password updated: admin@projectx.com / password123")
        
        print("Database tables created successfully")

if __name__ == '__main__':
    create_tables()
    print("Starting Flask API server on http://localhost:8001")
    app.run(host='0.0.0.0', port=8001, debug=True)
