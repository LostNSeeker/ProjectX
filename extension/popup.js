// Popup script for JobFormAutoFiller extension
class PopupManager {
    constructor() {
        this.initializeElements();
        this.loadSettings();
        this.loadStoredJobs();
        this.setupEventListeners();
        this.updateStatus('Ready');
    }

    initializeElements() {
        // API Configuration
        this.apiProvider = document.getElementById('apiProvider');
        this.apiKey = document.getElementById('apiKey');
        this.saveConfigBtn = document.getElementById('saveConfig');

        // Resume Data
        this.resumeData = document.getElementById('resumeData');
        this.saveResumeBtn = document.getElementById('saveResume');

        // Actions
        this.scrapeJobBtn = document.getElementById('scrapeJob');
        this.autoFillFormBtn = document.getElementById('autoFillForm');

        // Storage
        this.storedJobsContainer = document.getElementById('storedJobs');
        this.clearJobsBtn = document.getElementById('clearJobs');

        // Logs
        this.logsContainer = document.getElementById('logs');
        this.clearLogsBtn = document.getElementById('clearLogs');

        // Status
        this.statusIndicator = document.getElementById('statusIndicator');
    }

    setupEventListeners() {
        this.saveConfigBtn.addEventListener('click', () => this.saveConfiguration());
        this.saveResumeBtn.addEventListener('click', () => this.saveResume());
        this.scrapeJobBtn.addEventListener('click', () => this.scrapeCurrentPage());
        this.autoFillFormBtn.addEventListener('click', () => this.autoFillCurrentForm());
        this.clearJobsBtn.addEventListener('click', () => this.clearStoredJobs());
        this.clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['apiProvider', 'apiKey', 'resumeData']);
            
            if (result.apiProvider) {
                this.apiProvider.value = result.apiProvider;
            }
            if (result.apiKey) {
                this.apiKey.value = result.apiKey;
            }
            if (result.resumeData) {
                this.resumeData.value = result.resumeData;
            }
        } catch (error) {
            this.log('Error loading settings: ' + error.message, 'error');
        }
    }

    async saveConfiguration() {
        const config = {
            apiProvider: this.apiProvider.value,
            apiKey: this.apiKey.value
        };

        if (!config.apiKey.trim()) {
            this.log('Please enter an API key', 'warning');
            return;
        }

        try {
            await chrome.storage.local.set(config);
            this.log('Configuration saved successfully', 'success');
            this.updateStatus('Configured');
        } catch (error) {
            this.log('Error saving configuration: ' + error.message, 'error');
        }
    }

    async saveResume() {
        const resumeData = this.resumeData.value.trim();
        
        if (!resumeData) {
            this.log('Please enter your resume/CV data', 'warning');
            return;
        }

        try {
            await chrome.storage.local.set({ resumeData });
            this.log('Resume data saved successfully', 'success');
        } catch (error) {
            this.log('Error saving resume: ' + error.message, 'error');
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
            
            // Check if we have stored jobs
            const result = await chrome.storage.local.get(['storedJobs']);
            if (!result.storedJobs || result.storedJobs.length === 0) {
                this.log('No jobs stored. Please scrape a job page first.', 'warning');
                this.updateStatus('No Jobs Stored', 'warning');
                return;
            }

            // Check if we have resume data
            const resumeResult = await chrome.storage.local.get(['resumeData']);
            if (!resumeResult.resumeData) {
                this.log('Please add your resume/CV data first', 'warning');
                this.updateStatus('Resume Required', 'warning');
                return;
            }

            // Send message to content script to fill the form
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'autoFillForm',
                config: await chrome.storage.local.get(['apiProvider', 'apiKey']),
                resumeData: resumeResult.resumeData,
                jobs: result.storedJobs
            });

            if (response.success) {
                this.log('Form filled successfully', 'success');
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
