from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    payment_completed = db.Column(db.Boolean, default=False)
    payment_intent_id = db.Column(db.String(100), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(50), default='user')
    
    # Relationships
    onboarding_data = db.relationship('OnboardingData', backref='user', uselist=False, cascade='all, delete-orphan')
    cv_metadata = db.relationship('CVMetadata', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'payment_completed': self.payment_completed,
            'is_admin': self.is_admin if hasattr(self, 'is_admin') else False,
            'role': self.role if hasattr(self, 'role') else 'user'
        }

class OnboardingData(db.Model):
    __tablename__ = 'onboarding_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Basic Information
    full_name = db.Column(db.String(120))
    email_address = db.Column(db.String(120))
    phone_number = db.Column(db.String(20))
    current_address = db.Column(db.String(255))
    nationality = db.Column(db.String(100))
    work_authorization = db.Column(db.String(100))
    
    # Education & Experience
    highest_education = db.Column(db.String(100))
    relevant_coursework = db.Column(db.Text)
    certifications = db.Column(db.Text)
    work_experience = db.Column(db.Text)
    skills = db.Column(db.Text)
    most_significant_achievement = db.Column(db.Text)
    
    # Career Goals
    interest_company = db.Column(db.Text)
    interest_role = db.Column(db.Text)
    five_year_plan = db.Column(db.Text)
    hopes_gains = db.Column(db.Text)
    availability = db.Column(db.Boolean)
    how_learned = db.Column(db.Text)
    
    # Additional Information
    accommodations_needed = db.Column(db.Boolean)
    salary_expectations = db.Column(db.String(100))
    challenge_story = db.Column(db.Text)
    strengths_weaknesses = db.Column(db.Text)
    leadership_style = db.Column(db.Text)
    motivation = db.Column(db.Text)
    proud_project = db.Column(db.Text)
    
    # US-Specific Filters
    auth_us = db.Column(db.Boolean)
    visa_sponsorship = db.Column(db.Boolean)
    protected_veteran = db.Column(db.String(100))  # Options: disabled, vietnam, recently_separated, other, no, no_answer
    disability = db.Column(db.String(20))  # yes, no, prefer_not_say
    veterans_preference = db.Column(db.Boolean)
    active_duty = db.Column(db.Boolean)
    reasonable_accommodations = db.Column(db.Boolean)
    
    # UAE-Specific Filters
    uae_residence_visa = db.Column(db.Boolean)
    uae_sponsorship_eligible = db.Column(db.Boolean)
    uae_medical_fitness = db.Column(db.Boolean)
    uae_qualifications_attested = db.Column(db.Boolean)
    uae_health_insurance = db.Column(db.Boolean)
    uae_gcc_national = db.Column(db.Boolean)
    
    # EU-Specific Filters
    eu_eea_swiss_citizen = db.Column(db.Boolean)
    eu_work_permit = db.Column(db.Boolean)
    eu_blue_card_eligible = db.Column(db.Boolean)
    eu_shortage_occupation = db.Column(db.Boolean)
    eu_regulated_profession = db.Column(db.Boolean)
    eu_employer_sponsorship = db.Column(db.Boolean)
    eu_family_reunification = db.Column(db.Boolean)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'full_name': self.full_name,
            'email_address': self.email_address,
            'phone_number': self.phone_number,
            'current_address': self.current_address,
            'nationality': self.nationality,
            'work_authorization': self.work_authorization,
            'highest_education': self.highest_education,
            'relevant_coursework': self.relevant_coursework,
            'certifications': self.certifications,
            'work_experience': self.work_experience,
            'skills': self.skills,
            'most_significant_achievement': self.most_significant_achievement,
            'interest_company': self.interest_company,
            'interest_role': self.interest_role,
            'five_year_plan': self.five_year_plan,
            'hopes_gains': self.hopes_gains,
            'availability': self.availability,
            'how_learned': self.how_learned,
            'accommodations_needed': self.accommodations_needed,
            'salary_expectations': self.salary_expectations,
            'challenge_story': self.challenge_story,
            'strengths_weaknesses': self.strengths_weaknesses,
            'leadership_style': self.leadership_style,
            'motivation': self.motivation,
            'proud_project': self.proud_project,
            'auth_us': self.auth_us,
            'visa_sponsorship': self.visa_sponsorship,
            'protected_veteran': self.protected_veteran,
            'disability': self.disability,
            'veterans_preference': self.veterans_preference,
            'active_duty': self.active_duty,
            'reasonable_accommodations': self.reasonable_accommodations,
            'uae_residence_visa': self.uae_residence_visa,
            'uae_sponsorship_eligible': self.uae_sponsorship_eligible,
            'uae_medical_fitness': self.uae_medical_fitness,
            'uae_qualifications_attested': self.uae_qualifications_attested,
            'uae_health_insurance': self.uae_health_insurance,
            'uae_gcc_national': self.uae_gcc_national,
            'eu_eea_swiss_citizen': self.eu_eea_swiss_citizen,
            'eu_work_permit': self.eu_work_permit,
            'eu_blue_card_eligible': self.eu_blue_card_eligible,
            'eu_shortage_occupation': self.eu_shortage_occupation,
            'eu_regulated_profession': self.eu_regulated_profession,
            'eu_employer_sponsorship': self.eu_employer_sponsorship,
            'eu_family_reunification': self.eu_family_reunification,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class CVMetadata(db.Model):
    __tablename__ = 'cv_metadata'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # CV File Information
    cv_filename = db.Column(db.String(255))
    cv_file_path = db.Column(db.String(500))
    cv_upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Parsed CV Data
    parsed_name = db.Column(db.String(120))
    parsed_email = db.Column(db.String(120))
    parsed_phone = db.Column(db.String(20))
    parsed_address = db.Column(db.String(255))
    parsed_linkedin = db.Column(db.String(255))
    parsed_github = db.Column(db.String(255))
    parsed_website = db.Column(db.String(255))
    
    # Professional Information
    parsed_education = db.Column(db.Text)
    parsed_experience = db.Column(db.Text)
    parsed_skills = db.Column(db.Text)
    parsed_certifications = db.Column(db.Text)
    parsed_languages = db.Column(db.Text)
    parsed_projects = db.Column(db.Text)
    parsed_achievements = db.Column(db.Text)
    
    # AI-Generated Summary
    ai_summary = db.Column(db.Text)
    ai_key_skills = db.Column(db.Text)
    ai_career_highlights = db.Column(db.Text)
    ai_strengths = db.Column(db.Text)
    
    # Metadata
    parsing_status = db.Column(db.String(50), default='pending')  # pending, completed, failed
    parsing_confidence = db.Column(db.Float)  # 0.0 to 1.0
    parsing_notes = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'cv_filename': self.cv_filename,
            'cv_upload_date': self.cv_upload_date.isoformat() if self.cv_upload_date else None,
            'parsed_name': self.parsed_name,
            'parsed_email': self.parsed_email,
            'parsed_phone': self.parsed_phone,
            'parsed_address': self.parsed_address,
            'parsed_linkedin': self.parsed_linkedin,
            'parsed_github': self.parsed_github,
            'parsed_website': self.parsed_website,
            'parsed_education': self.parsed_education,
            'parsed_experience': self.parsed_experience,
            'parsed_skills': self.parsed_skills,
            'parsed_certifications': self.parsed_certifications,
            'parsed_languages': self.parsed_languages,
            'parsed_projects': self.parsed_projects,
            'parsed_achievements': self.parsed_achievements,
            'ai_summary': self.ai_summary,
            'ai_key_skills': self.ai_key_skills,
            'ai_career_highlights': self.ai_career_highlights,
            'ai_strengths': self.ai_strengths,
            'parsing_status': self.parsing_status,
            'parsing_confidence': self.parsing_confidence,
            'parsing_notes': self.parsing_notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
