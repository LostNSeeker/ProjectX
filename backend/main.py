import requests
from bs4 import BeautifulSoup
import schedule
import time
import hashlib
import json
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

# Configuration
WEBSITES = [
    {"url": "https://www.linkedin.com/jobs/search/?keywords=full%20stack%20engineer&location=Remote", "selector": "li.jobs-search-results__list-item"},
    {"url": "https://remote.co/remote-jobs/developer/", "selector": "div.job-listing"},
    {"url": "https://weworkremotely.com/categories/remote-full-stack-programming-jobs", "selector": "li.feature"},
    # Sample IT company career pages
    {"url": "https://careers.google.com/jobs/results/?distance=50&employment_type=FULL_TIME&q=full%20stack%20engineer", "selector": "div.job-listing"},
    {"url": "https://www.amazon.jobs/en/search?base_query=full+stack+engineer", "selector": "div.job"},
    # Add more websites (up to 50), e.g.,
    # {"url": "https://company.com/careers", "selector": "div.job-card"},
]  # Replace with your 50 IT-focused websites
OUTPUT_JSON = "filtered_job_postings.json"  # Output JSON file
HASH_FILE = "website_hashes.json"  # File to store hashes
EMAIL_ADDRESS = "your_email@example.com"  # Your email for notifications
EMAIL_PASSWORD = "your_password"  # Your email password or app-specific password
RECIPIENT_EMAIL = "recipient@example.com"  # Email to receive notifications
SEND_EMAILS = True  # Set to False to disable emails

# Filter keywords
REMOTE_KEYWORDS = ["remote", "work from home", "wfh", "telecommute"]
FULL_STACK_KEYWORDS = ["full stack", "full-stack", "software engineer", "web developer"]
TECH_KEYWORDS = ["react", "node.js", "next.js", "fastapi", "express", "typescript", "javascript", "python"]  # Based on your skills

def get_page_content(url, selector):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, timeout=15, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        job_listings = soup.select(selector)
        jobs = []
        for job in job_listings:
            title_elem = job.find('h2') or job.find('h3') or job.find('h4') or job
            title = title_elem.get_text(strip=True).lower() if title_elem else ""
            link = job.find('a', href=True)
            link = link['href'] if link else ""
            if link and not link.startswith('http'):
                link = url.rstrip('/') + '/' + link.lstrip('/')
            description_elem = job.find('p') or job.find('div', class_='description') or job
            description = description_elem.get_text(strip=True).lower() if description_elem else ""
            
            # Apply filters
            is_remote = any(keyword in title or keyword in description for keyword in REMOTE_KEYWORDS)
            is_full_stack = any(keyword in title for keyword in FULL_STACK_KEYWORDS)
            if not (is_remote and is_full_stack):
                continue
            
            # Extract technologies mentioned
            techs = [tech for tech in TECH_KEYWORDS if tech in description]
            
            jobs.append({
                "title": title_elem.get_text(strip=True) if title_elem else "No title",
                "link": link,
                "technologies": techs,
                "is_remote": is_remote,
                "scraped_at": datetime.now().isoformat()
            })
        return jobs
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

def hash_content(jobs):
    content = json.dumps(jobs, sort_keys=True)
    return hashlib.md5(content.encode('utf-8')).hexdigest()

def send_email(subject, body):
    if not SEND_EMAILS:
        return
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = RECIPIENT_EMAIL
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, RECIPIENT_EMAIL, msg.as_string())
        print(f"Email sent for {subject}")
    except Exception as e:
        print(f"Error sending email: {e}")

def load_hashes():
    try:
        with open(HASH_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_hashes(hashes):
    with open(HASH_FILE, 'w') as f:
        json.dump(hashes, f, indent=2)

def load_existing_jobs():
    try:
        with open(OUTPUT_JSON, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_jobs(jobs):
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(jobs, f, indent=2)

def check_websites():
    print(f"Checking websites at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    previous_hashes = load_hashes()
    current_jobs = load_existing_jobs()
    new_hashes = {}

    for site in WEBSITES:
        url = site['url']
        selector = site['selector']
        print(f"Scraping {url}...")
        jobs = get_page_content(url, selector)
        
        if not jobs:
            print(f"No filtered jobs found or error at {url}")
            continue

        current_hash = hash_content(jobs)
        new_hashes[url] = current_hash

        # Check for changes
        if url in previous_hashes and current_hash != previous_hashes[url]:
            send_email(f"New Full Stack Jobs on {url}", f"New/updated remote Full Stack jobs:\n{json.dumps(jobs[:3], indent=2)}...")
            print(f"Changes detected on {url}")
        elif url not in previous_hashes:
            print(f"Initial fetch for {url}")

        # Update job postings
        current_jobs[url] = jobs

    # Save updated hashes and jobs
    save_hashes(new_hashes)
    save_jobs(current_jobs)

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """API endpoint to get all job postings"""
    try:
        jobs = load_existing_jobs()
        return jsonify(jobs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/refresh', methods=['POST'])
def refresh_jobs():
    """API endpoint to manually refresh job postings"""
    try:
        check_websites()
        jobs = load_existing_jobs()
        return jsonify(jobs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# Schedule the task every 30 minutes
schedule.every(30).minutes.do(check_websites)

def run_scheduler():
    """Run the scheduler in a separate thread"""
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute for pending tasks

if __name__ == "__main__":
    print("Starting monitoring for remote Full Stack Engineer jobs...")
    check_websites()  # Run once immediately
    
    # Start scheduler in a separate thread
    import threading
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    # Start Flask app
    print("Starting Flask API server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=False)