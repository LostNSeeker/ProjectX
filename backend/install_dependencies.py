#!/usr/bin/env python3
"""
Install script for Job Form Auto-Fill Backend Dependencies
"""

import subprocess
import sys
import os
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_system_dependencies():
    """Install system-level dependencies"""
    system = platform.system().lower()
    
    if system == "darwin":  # macOS
        print("🍎 Detected macOS")
        # Check if Homebrew is installed
        if not run_command("which brew", "Checking for Homebrew"):
            print("📦 Installing Homebrew...")
            run_command('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', "Installing Homebrew")
        
        # Install system dependencies
        dependencies = [
            "libmagic",
            "poppler"  # For PDF processing
        ]
        
        for dep in dependencies:
            run_command(f"brew install {dep}", f"Installing {dep}")
    
    elif system == "linux":
        print("🐧 Detected Linux")
        # Try to detect package manager
        if run_command("which apt-get", "Checking for apt-get"):
            run_command("sudo apt-get update", "Updating package list")
            run_command("sudo apt-get install -y libmagic1 poppler-utils", "Installing system dependencies")
        elif run_command("which yum", "Checking for yum"):
            run_command("sudo yum install -y file-libs poppler-utils", "Installing system dependencies")
        elif run_command("which pacman", "Checking for pacman"):
            run_command("sudo pacman -S --noconfirm libmagic poppler", "Installing system dependencies")
    
    elif system == "windows":
        print("🪟 Detected Windows")
        print("⚠️  Please install the following manually:")
        print("   - Python 3.8+ from python.org")
        print("   - Git from git-scm.com")
        print("   - Visual Studio Build Tools (for compiling packages)")

def create_virtual_environment():
    """Create and activate virtual environment"""
    if not os.path.exists("venv"):
        run_command("python -m venv venv", "Creating virtual environment")
    
    # Determine activation script based on OS
    if platform.system().lower() == "windows":
        activate_script = "venv\\Scripts\\activate"
        pip_path = "venv\\Scripts\\pip"
    else:
        activate_script = "venv/bin/activate"
        pip_path = "venv/bin/pip"
    
    return activate_script, pip_path

def install_python_dependencies(pip_path):
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    
    # Upgrade pip first
    run_command(f"{pip_path} install --upgrade pip", "Upgrading pip")
    
    # Install requirements
    run_command(f"{pip_path} install -r requirements.txt", "Installing requirements")
    
    # Install additional dependencies that might be needed
    additional_deps = [
        "python-magic-bin",  # Windows alternative to python-magic
        "pdfplumber",       # Alternative PDF parser
        "pytesseract",      # OCR for image text extraction
    ]
    
    for dep in additional_deps:
        run_command(f"{pip_path} install {dep}", f"Installing {dep}")

def setup_environment():
    """Set up environment variables"""
    env_file = ".env"
    if not os.path.exists(env_file):
        print("🔧 Creating .env file...")
        with open(env_file, "w") as f:
            f.write("""# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this-in-production

# Database
SQLALCHEMY_DATABASE_URI=sqlite:///jobform_autofill.db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216  # 16MB
""")
        print("✅ .env file created. Please update with your actual API keys.")
    else:
        print("✅ .env file already exists")

def create_directories():
    """Create necessary directories"""
    directories = [
        "uploads",
        "uploads/cv",
        "logs"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"📁 Created directory: {directory}")

def main():
    """Main installation process"""
    print("🚀 Job Form Auto-Fill Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install system dependencies
    install_system_dependencies()
    
    # Create virtual environment
    activate_script, pip_path = create_virtual_environment()
    
    # Install Python dependencies
    install_python_dependencies(pip_path)
    
    # Set up environment
    setup_environment()
    
    # Create directories
    create_directories()
    
    print("\n🎉 Installation completed successfully!")
    print("\n📋 Next steps:")
    print("1. Update the .env file with your actual API keys")
    print("2. Activate the virtual environment:")
    if platform.system().lower() == "windows":
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("3. Run the application:")
    print("   python auth_db.py")
    
    print("\n🔑 Required API Keys:")
    print("- Stripe API keys (for payment processing)")
    print("- Gemini API key (for AI form filling)")
    
    print("\n📚 Documentation:")
    print("- Backend API: http://localhost:8001")
    print("- Health check: http://localhost:8001/api/health")

if __name__ == "__main__":
    main()
