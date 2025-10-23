#!/usr/bin/env python3
"""
Startup script for the authentication server with SQLite database
"""

import os
import sys
from auth_db import app, create_tables

def main():
    print("🚀 Starting Job Form Auto-Fill Authentication Server")
    print("=" * 50)
    
    # Check for required environment variables
    required_vars = ['JWT_SECRET_KEY', 'STRIPE_SECRET_KEY', 'GEMINI_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var) == f'your_{var.lower()}_here':
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set up your .env file with the required values.")
        print("See setup.md for instructions.")
        sys.exit(1)
    
    # Create database tables
    print("📊 Creating database tables...")
    create_tables()
    
    print("✅ Database initialized successfully")
    print("🌐 Starting server on http://localhost:8001")
    print("📝 API Documentation:")
    print("   - POST /api/auth/register - Register new user")
    print("   - POST /api/auth/login - Login user")
    print("   - GET /api/auth/me - Get current user")
    print("   - POST /api/payment/create-intent - Create payment")
    print("   - POST /api/onboarding - Save onboarding data")
    print("   - GET /api/onboarding - Get onboarding data")
    print("   - POST /api/autofill/generate - Generate form fill data")
    print("   - GET /api/health - Health check")
    print("\n" + "=" * 50)
    
    # Start the server
    app.run(host='0.0.0.0', port=8001, debug=True)

if __name__ == '__main__':
    main()
