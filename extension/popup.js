// Popup script for JobFormAutoFiller extension
class PopupManager {
    constructor() {
        this.initializeElements();
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateStatus('Checking authentication...');
    }

    initializeElements() {
        // Authentication
        this.authStatus = document.getElementById('authStatus');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Actions
        this.autoFillFormBtn = document.getElementById('autoFillForm');

        // Logs
        this.logsContainer = document.getElementById('logs');
        this.clearLogsBtn = document.getElementById('clearLogs');

        // Status
        this.statusIndicator = document.getElementById('statusIndicator');
    }

    setupEventListeners() {
        this.loginBtn.addEventListener('click', () => this.openWebApp());
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.autoFillFormBtn.addEventListener('click', () => this.autoFillCurrentForm());
        this.clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }

    async checkAuthStatus() {
        try {
            const result = await chrome.storage.local.get(['auth_token']);
            
            if (result.auth_token) {
                // Verify token is still valid
                const response = await chrome.runtime.sendMessage({
                    action: 'getUserData'
                });
                
                if (response.success) {
                    this.showAuthenticatedState();
                    this.log('Authenticated with web app', 'success');
                } else {
                    this.showUnauthenticatedState();
                    this.log('Authentication expired', 'warning');
                }
            } else {
                this.showUnauthenticatedState();
                this.log('Not authenticated', 'info');
            }
        } catch (error) {
            this.log('Error checking authentication: ' + error.message, 'error');
            this.showUnauthenticatedState();
        }
    }

    showAuthenticatedState() {
        this.authStatus.textContent = '✅ Connected to web app';
        this.authStatus.className = 'auth-status authenticated';
        this.loginBtn.style.display = 'none';
        this.logoutBtn.style.display = 'block';
        this.autoFillFormBtn.disabled = false;
        this.updateStatus('Ready to auto-fill forms');
    }

    showUnauthenticatedState() {
        this.authStatus.textContent = '❌ Not connected to web app';
        this.authStatus.className = 'auth-status unauthenticated';
        this.loginBtn.style.display = 'block';
        this.logoutBtn.style.display = 'none';
        this.autoFillFormBtn.disabled = true;
        this.updateStatus('Please log in to web app first');
    }

    openWebApp() {
        chrome.tabs.create({ url: 'http://localhost:5173' });
    }

    async logout() {
        try {
            await chrome.storage.local.remove(['auth_token']);
            this.showUnauthenticatedState();
            this.log('Logged out successfully', 'info');
        } catch (error) {
            this.log('Error logging out: ' + error.message, 'error');
        }
    }

    async scrapeCurrentPage() {
        this.updateStatus('Scraping...', 'warning');
        this.scrapeJobBtn.classList.add('loading');
        this.scrapeJobBtn.disabled = true;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Check if we have API configuration
            const config = await chrome.storage.local.get(['apiProvider', 'apiKey']);
            if (!config.apiKey) {
                this.log('Please configure your API key first', 'error');
                this.updateStatus('API Key Required', 'error');
                return;
            }

            // Send message to content script to scrape the page
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'scrapeJobPage',
                config: config
            });

            if (response.success) {
                this.log('Job page scraped successfully', 'success');
                this.loadStoredJobs();
                this.updateStatus('Scraped', 'success');
            } else {
                this.log('Failed to scrape job page: ' + response.error, 'error');
                this.updateStatus('Scrape Failed', 'error');
            }
        } catch (error) {
            this.log('Error scraping page: ' + error.message, 'error');
            this.updateStatus('Error', 'error');
        } finally {
            this.scrapeJobBtn.classList.remove('loading');
            this.scrapeJobBtn.disabled = false;
        }
    }

    async autoFillCurrentForm() {
        this.updateStatus('Filling Form...', 'warning');
        this.autoFillFormBtn.classList.add('loading');
        this.autoFillFormBtn.disabled = true;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Check authentication
            const authResult = await chrome.storage.local.get(['auth_token']);
            if (!authResult.auth_token) {
                this.log('Please log in to the web app first', 'warning');
                this.updateStatus('Authentication Required', 'warning');
                return;
            }

            // Send message to content script to fill the form
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'autoFillForm'
            });

            if (response.success) {
                this.log(`Form filled successfully: ${response.message}`, 'success');
                this.updateStatus('Form Filled', 'success');
            } else {
                this.log('Failed to fill form: ' + response.error, 'error');
                this.updateStatus('Fill Failed', 'error');
            }
        } catch (error) {
            this.log('Error filling form: ' + error.message, 'error');
            this.updateStatus('Error', 'error');
        } finally {
            this.autoFillFormBtn.classList.remove('loading');
            this.autoFillFormBtn.disabled = false;
        }
    }

    async loadStoredJobs() {
        try {
            const result = await chrome.storage.local.get(['storedJobs']);
            const jobs = result.storedJobs || [];
            
            if (jobs.length === 0) {
                this.storedJobsContainer.innerHTML = '<p class="no-jobs">No jobs stored yet</p>';
                return;
            }

            this.storedJobsContainer.innerHTML = jobs.map(job => `
                <div class="job-item">
                    <div class="job-title">${this.escapeHtml(job.title)}</div>
                    <div class="job-company">${this.escapeHtml(job.company)}</div>
                    <div class="job-date">${new Date(job.scrapedAt).toLocaleDateString()}</div>
                </div>
            `).join('');
        } catch (error) {
            this.log('Error loading stored jobs: ' + error.message, 'error');
        }
    }

    async clearStoredJobs() {
        try {
            await chrome.storage.local.remove(['storedJobs']);
            this.loadStoredJobs();
            this.log('All stored jobs cleared', 'info');
        } catch (error) {
            this.log('Error clearing jobs: ' + error.message, 'error');
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        // Remove "no logs" message if it exists
        const noLogs = this.logsContainer.querySelector('.no-logs');
        if (noLogs) {
            noLogs.remove();
        }
        
        this.logsContainer.appendChild(logEntry);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
    }

    clearLogs() {
        this.logsContainer.innerHTML = '<p class="no-logs">No logs yet</p>';
    }

    updateStatus(text, type = 'ready') {
        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        statusText.textContent = text;
        statusDot.className = `status-dot ${type}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});
