// Content script for JobFormAutoFiller extension
class ContentScript {
    constructor() {
        this.setupMessageListener();
        this.detectPageType();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'scrapeJobPage':
                    const scrapeResult = await this.scrapeJobPage(request.config);
                    sendResponse(scrapeResult);
                    break;
                case 'autoFillForm':
                    const fillResult = await this.autoFillForm(request);
                    sendResponse(fillResult);
                    break;
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    detectPageType() {
        // Simple heuristics to detect page type
        const url = window.location.href;
        const title = document.title.toLowerCase();
        
        if (this.isJobListingPage(url, title)) {
            this.addPageIndicator('job-listing');
        } else if (this.isApplicationFormPage(url, title)) {
            this.addPageIndicator('application-form');
        }
    }

    isJobListingPage(url, title) {
        const jobKeywords = ['job', 'career', 'position', 'opening', 'hiring', 'employment'];
        const urlKeywords = ['jobs', 'careers', 'positions', 'hiring'];
        
        return jobKeywords.some(keyword => title.includes(keyword)) ||
               urlKeywords.some(keyword => url.includes(keyword));
    }

    isApplicationFormPage(url, title) {
        const formKeywords = ['apply', 'application', 'submit', 'form'];
        const hasForm = document.querySelector('form') !== null;
        
        return formKeywords.some(keyword => 
            title.includes(keyword) || url.includes(keyword)
        ) && hasForm;
    }

    addPageIndicator(type) {
        const indicator = document.createElement('div');
        indicator.id = 'jobformautofiller-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #3b82f6;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        indicator.textContent = type === 'job-listing' ? '📄 Job Page Detected' : '✏️ Application Form Detected';
        document.body.appendChild(indicator);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 3000);
    }

    async scrapeJobPage(config) {
        try {
            // Get user consent
            if (!this.getUserConsent('scrape')) {
                return { success: false, error: 'User consent required for scraping' };
            }

            // Clean and extract page content
            const pageContent = this.extractPageContent();
            
            if (!pageContent) {
                return { success: false, error: 'No content found on page' };
            }

            // Send to background script for LLM processing
            const response = await chrome.runtime.sendMessage({
                action: 'extractJobData',
                content: pageContent,
                url: window.location.href,
                config: config
            });

            if (response.success) {
                // Store the extracted job data
                await this.storeJobData(response.jobData);
                return { success: true, jobData: response.jobData };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    extractPageContent() {
        // Remove script and style elements
        const elementsToRemove = document.querySelectorAll('script, style, nav, header, footer, .ad, .advertisement');
        elementsToRemove.forEach(el => el.remove());

        // Get main content areas
        const contentSelectors = [
            'main',
            '[role="main"]',
            '.content',
            '.main-content',
            '.job-description',
            '.job-details',
            '.posting',
            'article'
        ];

        let mainContent = '';
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                mainContent = element.innerText || element.textContent;
                break;
            }
        }

        // Fallback to body content if no main content found
        if (!mainContent) {
            mainContent = document.body.innerText || document.body.textContent;
        }

        // Clean and limit content
        return this.cleanContent(mainContent);
    }

    cleanContent(content) {
        // Remove extra whitespace and normalize
        return content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
            .substring(0, 10000); // Limit to 10k characters
    }

    async autoFillForm(request) {
        try {
            // Get user consent
            if (!this.getUserConsent('fill')) {
                return { success: false, error: 'User consent required for form filling' };
            }

            // Find all forms on the page
            const forms = document.querySelectorAll('form');
            if (forms.length === 0) {
                return { success: false, error: 'No forms found on page' };
            }

            // Analyze form structure
            const formAnalysis = await this.analyzeForm(forms[0], request.config);
            
            if (!formAnalysis.success) {
                return { success: false, error: formAnalysis.error };
            }

            // Generate and fill form data
            const fillResult = await this.generateAndFillForm(
                formAnalysis.fields, 
                request.jobs, 
                request.resumeData, 
                request.config
            );

            return fillResult;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async analyzeForm(form, config) {
        try {
            const formHtml = form.outerHTML;
            
            // Send to background script for LLM analysis
            const response = await chrome.runtime.sendMessage({
                action: 'analyzeForm',
                formHtml: formHtml,
                config: config
            });

            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateAndFillForm(fields, jobs, resumeData, config) {
        try {
            const mostRecentJob = jobs[0]; // Use most recent job
            
            // Generate answers for each field
            const filledFields = [];
            for (const field of fields) {
                const answer = await this.generateFieldAnswer(field, mostRecentJob, resumeData, config);
                if (answer) {
                    filledFields.push({ ...field, answer });
                }
            }

            // Fill the form
            let filledCount = 0;
            for (const field of filledFields) {
                if (this.fillField(field)) {
                    filledCount++;
                }
            }

            return { 
                success: true, 
                filledCount: filledCount,
                totalFields: fields.length 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateFieldAnswer(field, job, resumeData, config) {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'generateAnswer',
                field: field,
                job: job,
                resumeData: resumeData,
                config: config
            });

            return response.answer;
        } catch (error) {
            console.error('Error generating answer:', error);
            return null;
        }
    }

    fillField(field) {
        try {
            const element = document.querySelector(field.selector);
            if (!element) return false;

            // Handle different input types
            if (element.tagName === 'INPUT') {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = true;
                } else {
                    element.value = field.answer;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else if (element.tagName === 'TEXTAREA') {
                element.value = field.answer;
                element.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (element.tagName === 'SELECT') {
                // Try to find matching option
                const options = element.querySelectorAll('option');
                for (const option of options) {
                    if (option.textContent.toLowerCase().includes(field.answer.toLowerCase()) ||
                        option.value.toLowerCase().includes(field.answer.toLowerCase())) {
                        element.value = option.value;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }

            // Add visual feedback
            this.highlightField(element);
            return true;
        } catch (error) {
            console.error('Error filling field:', error);
            return false;
        }
    }

    highlightField(element) {
        const originalBorder = element.style.border;
        element.style.border = '2px solid #10b981';
        
        setTimeout(() => {
            element.style.border = originalBorder;
        }, 2000);
    }

    async storeJobData(jobData) {
        try {
            const result = await chrome.storage.local.get(['storedJobs']);
            const jobs = result.storedJobs || [];
            
            // Add new job to beginning of array
            jobs.unshift({
                ...jobData,
                scrapedAt: new Date().toISOString(),
                url: window.location.href
            });

            // Keep only last 5 jobs
            const limitedJobs = jobs.slice(0, 5);
            
            await chrome.storage.local.set({ storedJobs: limitedJobs });
        } catch (error) {
            console.error('Error storing job data:', error);
        }
    }

    getUserConsent(action) {
        const message = action === 'scrape' 
            ? 'This extension wants to scrape job information from this page. Continue?'
            : 'This extension wants to auto-fill the form on this page. Continue?';
        
        return confirm(message);
    }
}

// Initialize content script
if (typeof window !== 'undefined') {
    new ContentScript();
}
