from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import json
import google.generativeai as genai
from docx import Document
import PyPDF2
from PIL import Image
import io
import base64
from datetime import datetime
from models import db, User, OnboardingData, CVMetadata

onboarding_bp = Blueprint('onboarding', __name__)

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Allowed file extensions for CV upload
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""

def extract_text_from_image(file_path):
    """Extract text from image using Gemini Vision"""
    try:
        # Read and encode image
        with open(file_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Use Gemini Vision to extract text
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([
            "Extract all text from this image. Return only the text content, no additional formatting.",
            {
                "mime_type": "image/jpeg",
                "data": image_data
            }
        ])
        return response.text
    except Exception as e:
        print(f"Error extracting from image: {e}")
        return ""

def parse_cv_with_gemini(cv_text):
    """Parse CV text using Gemini AI to extract structured information"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Parse the following CV/resume text and extract structured information. Return a JSON object with the following fields:
        
        {{
            "name": "Full name",
            "email": "Email address",
            "phone": "Phone number",
            "address": "Current address",
            "linkedin": "LinkedIn profile URL",
            "github": "GitHub profile URL",
            "website": "Personal website URL",
            "education": "Education details (degrees, institutions, dates)",
            "experience": "Work experience (companies, positions, dates, descriptions)",
            "skills": "Technical and soft skills",
            "certifications": "Professional certifications",
            "languages": "Languages spoken",
            "projects": "Notable projects",
            "achievements": "Key achievements and awards"
        }}
        
        CV Text:
        {cv_text}
        
        Return only the JSON object, no additional text.
        """
        
        response = model.generate_content(prompt)
        
        # Try to parse the JSON response
        try:
            # Clean the response to extract JSON
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            parsed_data = json.loads(response_text)
            return parsed_data
        except json.JSONDecodeError:
            # If JSON parsing fails, return structured data manually
            return {
                "name": "",
                "email": "",
                "phone": "",
                "address": "",
                "linkedin": "",
                "github": "",
                "website": "",
                "education": cv_text[:500] if cv_text else "",
                "experience": cv_text[500:1000] if len(cv_text) > 500 else "",
                "skills": "",
                "certifications": "",
                "languages": "",
                "projects": "",
                "achievements": ""
            }
    except Exception as e:
        print(f"Error parsing CV with Gemini: {e}")
        return {}

def generate_ai_summary(cv_data, onboarding_data):
    """Generate AI summary combining CV and onboarding data"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Based on the following CV data and onboarding information, create a comprehensive professional summary:
        
        CV Data: {json.dumps(cv_data, indent=2)}
        Onboarding Data: {json.dumps(onboarding_data, indent=2)}
        
        Generate:
        1. A professional summary highlighting key strengths
        2. Top 5 key skills
        3. Career highlights and achievements
        4. Professional strengths
        
        Return as JSON:
        {{
            "summary": "Professional summary",
            "key_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
            "career_highlights": "Key career highlights",
            "strengths": "Professional strengths"
        }}
        """
        
        response = model.generate_content(prompt)
        
        try:
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            return json.loads(response_text)
        except json.JSONDecodeError:
            return {
                "summary": "Professional with strong background in technology and innovation",
                "key_skills": ["Problem Solving", "Team Leadership", "Technical Skills", "Communication", "Adaptability"],
                "career_highlights": "Experienced professional with diverse background",
                "strengths": "Strong analytical and communication skills"
            }
    except Exception as e:
        print(f"Error generating AI summary: {e}")
        return {
            "summary": "Professional with strong background in technology and innovation",
            "key_skills": ["Problem Solving", "Team Leadership", "Technical Skills", "Communication", "Adaptability"],
            "career_highlights": "Experienced professional with diverse background",
            "strengths": "Strong analytical and communication skills"
        }

@onboarding_bp.route('/api/onboarding/questions', methods=['GET'])
@jwt_required()
def get_onboarding_questions():
    """Get all onboarding questions"""
    questions = {
        "basic_info": [
            {
                "id": "full_name",
                "question": "What is your full name?",
                "type": "text",
                "required": True
            },
            {
                "id": "email_address",
                "question": "What is your email address?",
                "type": "email",
                "required": True
            },
            {
                "id": "phone_number",
                "question": "What is your phone number?",
                "type": "tel",
                "required": True
            },
            {
                "id": "current_address",
                "question": "What is your current address?",
                "type": "text",
                "required": True
            },
            {
                "id": "nationality",
                "question": "What is your nationality?",
                "type": "text",
                "required": True
            },
            {
                "id": "work_authorization",
                "question": "What is your work authorization status?",
                "type": "select",
                "options": ["US Citizen", "Green Card Holder", "H1B Visa", "Other Visa", "No Authorization"],
                "required": True
            }
        ],
        "education_experience": [
            {
                "id": "highest_education",
                "question": "What is your highest level of education?",
                "type": "select",
                "options": ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD", "Other"],
                "required": True
            },
            {
                "id": "relevant_coursework",
                "question": "What relevant coursework or projects have you completed?",
                "type": "textarea",
                "required": False
            },
            {
                "id": "certifications",
                "question": "Do you have any certifications or licenses?",
                "type": "textarea",
                "required": False
            },
            {
                "id": "work_experience",
                "question": "What previous work or internship experience do you have?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "skills",
                "question": "What skills do you possess that make you a good fit for this role?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "most_significant_achievement",
                "question": "What is your most significant achievement outside of academics?",
                "type": "textarea",
                "required": False
            }
        ],
        "career_goals": [
            {
                "id": "interest_company",
                "question": "Why do you want to work for this company?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "interest_role",
                "question": "Why are you interested in this specific role or industry?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "five_year_plan",
                "question": "Where do you see yourself in 5 years?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "hopes_gains",
                "question": "What do you hope to gain from this internship/job?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "availability",
                "question": "Are you available for the full duration of the internship/program?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "how_learned",
                "question": "How did you hear about this opportunity?",
                "type": "text",
                "required": False
            }
        ],
        "additional_info": [
            {
                "id": "accommodations_needed",
                "question": "Do you require any accommodations?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "salary_expectations",
                "question": "What are your salary expectations?",
                "type": "text",
                "required": False
            },
            {
                "id": "challenge_story",
                "question": "Tell us about a time you faced a challenge and how you overcame it.",
                "type": "textarea",
                "required": True
            },
            {
                "id": "strengths_weaknesses",
                "question": "How do your strengths and weaknesses align with this role?",
                "type": "textarea",
                "required": True
            },
            {
                "id": "leadership_style",
                "question": "Describe your leadership style.",
                "type": "textarea",
                "required": False
            },
            {
                "id": "motivation",
                "question": "What motivates you in your career?",
                "type": "textarea",
                "required": False
            },
            {
                "id": "proud_project",
                "question": "Tell us about a project you're proud of.",
                "type": "textarea",
                "required": False
            }
        ],
        "us_specific": [
            {
                "id": "auth_us",
                "question": "Are you legally authorized to work in the United States?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "visa_sponsorship",
                "question": "Will you now or in the future require sponsorship for an employment-based visa (e.g., H-1B)?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "protected_veteran",
                "question": "Are you a protected veteran?",
                "type": "select",
                "options": ["Yes, I am a disabled veteran", "Yes, I am a veteran of the Vietnam era", "Yes, I am a recently separated veteran", "Yes, I am an other protected veteran", "No", "I don't wish to answer"],
                "required": True
            },
            {
                "id": "disability",
                "question": "Do you have a disability, or have you ever had one?",
                "type": "select",
                "options": ["Yes", "No", "Prefer not to say"],
                "required": True
            },
            {
                "id": "veterans_preference",
                "question": "Are you eligible for Veterans' Preference?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "active_duty",
                "question": "Have you served on active duty in the U.S. Armed Forces?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "reasonable_accommodations",
                "question": "Do you require any reasonable accommodations to perform the essential functions of this job?",
                "type": "boolean",
                "required": True
            }
        ],
        "uae_specific": [
            {
                "id": "uae_residence_visa",
                "question": "Do you have a valid UAE residence visa or work permit?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "uae_sponsorship_eligible",
                "question": "Are you eligible for sponsorship under UAE labor laws?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "uae_medical_fitness",
                "question": "Do you meet the medical fitness requirements for UAE employment?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "uae_qualifications_attested",
                "question": "Are your educational/professional qualifications attested by UAE authorities?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "uae_health_insurance",
                "question": "Do you have health insurance coverage valid in the UAE?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "uae_gcc_national",
                "question": "Are you a UAE/GCC national?",
                "type": "boolean",
                "required": True
            }
        ],
        "eu_specific": [
            {
                "id": "eu_eea_swiss_citizen",
                "question": "Are you an EU/EEA/Swiss citizen?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_work_permit",
                "question": "Do you require a work permit or visa to work in EU countries?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_blue_card_eligible",
                "question": "Do you qualify for an EU Blue Card?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_shortage_occupation",
                "question": "Is your job offer in a shortage occupation for EU countries?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_regulated_profession",
                "question": "Do you have recognized qualifications for a regulated profession in the EU?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_employer_sponsorship",
                "question": "Will you need employer sponsorship for a residence permit?",
                "type": "boolean",
                "required": True
            },
            {
                "id": "eu_family_reunification",
                "question": "Are you eligible for family reunification under EU work visa rules?",
                "type": "boolean",
                "required": True
            }
        ]
    }
    
    return jsonify(questions)

@onboarding_bp.route('/api/onboarding/save', methods=['POST'])
@jwt_required()
def save_onboarding_data():
    """Save onboarding data"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if onboarding data already exists
        existing_data = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if existing_data:
            # Update existing data
            for field, value in data.items():
                if hasattr(existing_data, field):
                    setattr(existing_data, field, value)
            existing_data.updated_at = datetime.utcnow()
        else:
            # Create new onboarding data
            onboarding_data = OnboardingData(user_id=user_id)
            for field, value in data.items():
                if hasattr(onboarding_data, field):
                    setattr(onboarding_data, field, value)
            db.session.add(onboarding_data)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Onboarding data saved successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@onboarding_bp.route('/api/onboarding/get', methods=['GET'])
@jwt_required()
def get_onboarding_data():
    """Get onboarding data for current user"""
    try:
        user_id = get_jwt_identity()
        onboarding_data = OnboardingData.query.filter_by(user_id=user_id).first()
        
        if not onboarding_data:
            return jsonify({
                'success': True,
                'data': {}
            })
        
        return jsonify({
            'success': True,
            'data': onboarding_data.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@onboarding_bp.route('/api/cv/upload', methods=['POST'])
@jwt_required()
def upload_cv():
    """Upload and parse CV"""
    try:
        user_id = get_jwt_identity()
        
        if 'cv_file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['cv_file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'File type not allowed'
            }), 400
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'cv')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_dir, f"{user_id}_{filename}")
        file.save(file_path)
        
        # Extract text based on file type
        file_extension = filename.rsplit('.', 1)[1].lower()
        cv_text = ""
        
        if file_extension == 'pdf':
            cv_text = extract_text_from_pdf(file_path)
        elif file_extension in ['doc', 'docx']:
            cv_text = extract_text_from_docx(file_path)
        elif file_extension in ['png', 'jpg', 'jpeg']:
            cv_text = extract_text_from_image(file_path)
        elif file_extension == 'txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                cv_text = f.read()
        
        # Parse CV with Gemini
        parsed_data = parse_cv_with_gemini(cv_text)
        
        # Get onboarding data for AI summary
        onboarding_data = OnboardingData.query.filter_by(user_id=user_id).first()
        onboarding_dict = onboarding_data.to_dict() if onboarding_data else {}
        
        # Generate AI summary
        ai_summary = generate_ai_summary(parsed_data, onboarding_dict)
        
        # Save CV metadata
        existing_cv = CVMetadata.query.filter_by(user_id=user_id).first()
        
        if existing_cv:
            # Update existing CV metadata
            existing_cv.cv_filename = filename
            existing_cv.cv_file_path = file_path
            existing_cv.cv_upload_date = datetime.utcnow()
            existing_cv.parsed_name = parsed_data.get('name', '')
            existing_cv.parsed_email = parsed_data.get('email', '')
            existing_cv.parsed_phone = parsed_data.get('phone', '')
            existing_cv.parsed_address = parsed_data.get('address', '')
            existing_cv.parsed_linkedin = parsed_data.get('linkedin', '')
            existing_cv.parsed_github = parsed_data.get('github', '')
            existing_cv.parsed_website = parsed_data.get('website', '')
            existing_cv.parsed_education = parsed_data.get('education', '')
            existing_cv.parsed_experience = parsed_data.get('experience', '')
            existing_cv.parsed_skills = parsed_data.get('skills', '')
            existing_cv.parsed_certifications = parsed_data.get('certifications', '')
            existing_cv.parsed_languages = parsed_data.get('languages', '')
            existing_cv.parsed_projects = parsed_data.get('projects', '')
            existing_cv.parsed_achievements = parsed_data.get('achievements', '')
            existing_cv.ai_summary = ai_summary.get('summary', '')
            existing_cv.ai_key_skills = json.dumps(ai_summary.get('key_skills', []))
            existing_cv.ai_career_highlights = ai_summary.get('career_highlights', '')
            existing_cv.ai_strengths = ai_summary.get('strengths', '')
            existing_cv.parsing_status = 'completed'
            existing_cv.parsing_confidence = 0.9
            existing_cv.updated_at = datetime.utcnow()
        else:
            # Create new CV metadata
            cv_metadata = CVMetadata(
                user_id=user_id,
                cv_filename=filename,
                cv_file_path=file_path,
                parsed_name=parsed_data.get('name', ''),
                parsed_email=parsed_data.get('email', ''),
                parsed_phone=parsed_data.get('phone', ''),
                parsed_address=parsed_data.get('address', ''),
                parsed_linkedin=parsed_data.get('linkedin', ''),
                parsed_github=parsed_data.get('github', ''),
                parsed_website=parsed_data.get('website', ''),
                parsed_education=parsed_data.get('education', ''),
                parsed_experience=parsed_data.get('experience', ''),
                parsed_skills=parsed_data.get('skills', ''),
                parsed_certifications=parsed_data.get('certifications', ''),
                parsed_languages=parsed_data.get('languages', ''),
                parsed_projects=parsed_data.get('projects', ''),
                parsed_achievements=parsed_data.get('achievements', ''),
                ai_summary=ai_summary.get('summary', ''),
                ai_key_skills=json.dumps(ai_summary.get('key_skills', [])),
                ai_career_highlights=ai_summary.get('career_highlights', ''),
                ai_strengths=ai_summary.get('strengths', ''),
                parsing_status='completed',
                parsing_confidence=0.9
            )
            db.session.add(cv_metadata)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'CV uploaded and parsed successfully',
            'data': {
                'parsed_data': parsed_data,
                'ai_summary': ai_summary
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@onboarding_bp.route('/api/cv/get', methods=['GET'])
@jwt_required()
def get_cv_data():
    """Get CV data for current user"""
    try:
        user_id = get_jwt_identity()
        cv_data = CVMetadata.query.filter_by(user_id=user_id).first()
        
        if not cv_data:
            return jsonify({
                'success': True,
                'data': {}
            })
        
        return jsonify({
            'success': True,
            'data': cv_data.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@onboarding_bp.route('/api/autofill/generate', methods=['POST'])
@jwt_required()
def generate_autofill_data():
    """Generate autofill data for forms using stored user data"""
    try:
        user_id = get_jwt_identity()
        form_data = request.get_json()
        
        # Get user's onboarding and CV data
        onboarding_data = OnboardingData.query.filter_by(user_id=user_id).first()
        cv_data = CVMetadata.query.filter_by(user_id=user_id).first()
        
        if not onboarding_data and not cv_data:
            return jsonify({
                'success': False,
                'error': 'No user data found'
            }), 404
        
        # Prepare user data for Gemini
        user_data = {}
        if onboarding_data:
            user_data.update(onboarding_data.to_dict())
        if cv_data:
            user_data.update(cv_data.to_dict())
        
        # Use Gemini to generate form responses
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Based on the following user profile data, fill out the job application form fields intelligently.
        
        User Profile Data:
        {json.dumps(user_data, indent=2)}
        
        Form Fields to Fill:
        {json.dumps(form_data, indent=2)}
        
        For each form field, provide the most appropriate response based on the user's profile.
        Return a JSON object with field names as keys and appropriate responses as values.
        Be specific and professional in your responses.
        """
        
        response = model.generate_content(prompt)
        
        try:
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            autofill_data = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback to basic mapping
            autofill_data = {}
            if onboarding_data:
                autofill_data.update({
                    'name': onboarding_data.full_name or '',
                    'email': onboarding_data.email_address or '',
                    'phone': onboarding_data.phone_number or '',
                    'address': onboarding_data.current_address or '',
                    'education': onboarding_data.highest_education or '',
                    'experience': onboarding_data.work_experience or '',
                    'skills': onboarding_data.skills or ''
                })
        
        return jsonify({
            'success': True,
            'autofill_data': autofill_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
