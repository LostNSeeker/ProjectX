// Content script for JobFormAutoFiller extension
class ContentScript {
    constructor() {
        this.setupMessageListener();
        this.setupTokenSync();
        this.detectPageType();
    }

    setupTokenSync() {
        // Listen for token updates from the web app
        window.addEventListener('message', (event) => {
            if (event.data.type === 'AUTH_TOKEN_UPDATE') {
                this.storeAuthToken(event.data.token);
            }
        });
    }

    async storeAuthToken(token) {
        try {
            await chrome.storage.local.set({ auth_token: token });
            console.log('Auth token synced with extension');
        } catch (error) {
            console.error('Failed to store auth token:', error);
        }
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

            // Scrape form fields for intelligent analysis
            const formFields = this.scrapeFormFields();
            
            // Get intelligent form filling data from backend
            const intelligentData = await this.getIntelligentFormData(formFields);
            
            // Fill the form with intelligent data
            const fillResult = await this.fillFormWithIntelligentData(intelligentData, forms[0]);

            return fillResult;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    scrapeFormFields() {
        const formFields = [];
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, formIndex) => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach((input, inputIndex) => {
                const fieldInfo = {
                    name: input.name || input.id || `field_${inputIndex}`,
                    type: input.type || input.tagName.toLowerCase(),
                    placeholder: input.placeholder || '',
                    label: this.getFieldLabel(input),
                    required: input.required || false,
                    formIndex: formIndex,
                    inputIndex: inputIndex
                };
                
                formFields.push(fieldInfo);
            });
        });
        
        return formFields;
    }

    getFieldLabel(input) {
        // Try to find associated label
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return label.textContent.trim();
        }
        
        // Try to find parent label
        const parentLabel = input.closest('label');
        if (parentLabel) return parentLabel.textContent.trim();
        
        // Try to find nearby text
        const nearbyText = input.previousElementSibling?.textContent?.trim();
        if (nearbyText) return nearbyText;
        
        return '';
    }

    async getIntelligentFormData(formFields) {
        try {
            const token = await this.getAuthToken();
            if (!token) {
                console.log('No auth token found, using basic form data');
                return {};
            }

            const response = await fetch('http://localhost:8001/api/autofill/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    form_fields: formFields
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.autofill_data || {};
            } else {
                console.error('Failed to get intelligent form data:', response.statusText);
                return {};
            }
        } catch (error) {
            console.error('Error getting intelligent form data:', error);
            return {};
        }
    }

    async getAuthToken() {
        try {
            const result = await chrome.storage.local.get(['auth_token']);
            return result.auth_token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    async fillFormWithIntelligentData(intelligentData, form) {
        try {
            let filled = 0;
            const errors = [];

            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach((input, index) => {
                try {
                    const fieldName = this.getFieldName(input);
                    const value = this.getIntelligentValue(fieldName, input, intelligentData);
                    
                    if (value && this.shouldFillField(input, value)) {
                        this.fillField(input, value);
                        filled++;
                    }
                } catch (error) {
                    errors.push(`Input ${index + 1}: ${error.message}`);
                }
            });

            return {
                success: true,
                filled: filled,
                errors: errors
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getFieldName(input) {
        // Try multiple ways to identify the field
        if (input.name) return input.name.toLowerCase();
        if (input.id) return input.id.toLowerCase();
        if (input.placeholder) return input.placeholder.toLowerCase();
        if (input.getAttribute('data-testid')) return input.getAttribute('data-testid').toLowerCase();
        
        // Try to get from label
        const label = this.getFieldLabel(input);
        if (label) return label.toLowerCase();
        
        return '';
    }

    getIntelligentValue(fieldName, input, intelligentData) {
        // Direct field name match
        if (intelligentData[fieldName]) {
            return intelligentData[fieldName];
        }

        // Try to match by common field patterns
        const fieldPatterns = {
            'name': ['name', 'fullname', 'full_name', 'firstname', 'lastname'],
            'email': ['email', 'e-mail', 'mail'],
            'phone': ['phone', 'telephone', 'mobile', 'cell'],
            'address': ['address', 'street', 'location'],
            'experience': ['experience', 'work', 'employment', 'background'],
            'education': ['education', 'degree', 'school', 'university'],
            'skills': ['skills', 'abilities', 'competencies'],
            'cover': ['cover', 'letter', 'message', 'additional'],
            'resume': ['resume', 'cv', 'curriculum']
        };

        for (const [key, patterns] of Object.entries(fieldPatterns)) {
            for (const pattern of patterns) {
                if (fieldName.includes(pattern) && intelligentData[key]) {
                    return intelligentData[key];
                }
            }
        }

        return null;
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

    extractJobDescription() {
        // Extract job description from various common selectors
        const selectors = [
            '.job-description',
            '.job-details',
            '.description',
            '.content',
            '[data-testid*="description"]',
            '[class*="description"]',
            '[class*="content"]'
        ];
        
        let description = '';
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                description = element.textContent || element.innerText || '';
                if (description.length > 100) break; // Found substantial content
            }
        }
        
        // Fallback to page title and meta description
        if (!description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            description = metaDesc ? metaDesc.getAttribute('content') : '';
            if (!description) {
                description = document.title;
            }
        }
        
        return description.substring(0, 2000); // Limit description length
    }

    async fillFormWithData(generatedData, form) {
        try {
            const filledFields = [];
            const skippedFields = [];
            
            // Get all form inputs
            const inputs = form.querySelectorAll('input, textarea, select');
            
            for (const input of inputs) {
                const fieldName = this.getFieldName(input);
                const fieldType = input.type || input.tagName.toLowerCase();
                
                // Skip hidden fields and submit buttons
                if (fieldType === 'hidden' || fieldType === 'submit' || fieldType === 'button') {
                    continue;
                }
                
                // Find matching data from generated response
                const value = this.findMatchingValue(fieldName, generatedData);
                
                if (value) {
                    try {
                        this.fillInput(input, value);
                        filledFields.push({
                            name: fieldName,
                            type: fieldType,
                            value: value
                        });
                    } catch (error) {
                        skippedFields.push({
                            name: fieldName,
                            type: fieldType,
                            error: error.message
                        });
                    }
                } else {
                    skippedFields.push({
                        name: fieldName,
                        type: fieldType,
                        reason: 'No matching data found'
                    });
                }
            }
            
            return {
                success: true,
                filledFields: filledFields,
                skippedFields: skippedFields,
                message: `Successfully filled ${filledFields.length} fields`
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getFieldName(input) {
        // Try various ways to identify the field name
        return input.name || 
               input.id || 
               input.placeholder || 
               input.getAttribute('data-testid') ||
               input.getAttribute('aria-label') ||
               'unknown';
    }

    findMatchingValue(fieldName, generatedData) {
        // Simple matching logic - in a real implementation, this would be more sophisticated
        const lowerFieldName = fieldName.toLowerCase();
        
        // Look for exact matches first
        for (const [key, value] of Object.entries(generatedData)) {
            if (key.toLowerCase().includes(lowerFieldName) || 
                lowerFieldName.includes(key.toLowerCase())) {
                return value;
            }
        }
        
        // Look for common field patterns
        if (lowerFieldName.includes('email')) {
            return generatedData.email || generatedData.email_address;
        }
        if (lowerFieldName.includes('phone')) {
            return generatedData.phone || generatedData.phone_number;
        }
        if (lowerFieldName.includes('name') && !lowerFieldName.includes('last')) {
            return generatedData.first_name || generatedData.full_name;
        }
        if (lowerFieldName.includes('last')) {
            return generatedData.last_name;
        }
        if (lowerFieldName.includes('address')) {
            return generatedData.address;
        }
        
        return null;
    }

    fillInput(input, value) {
        const fieldType = input.type || input.tagName.toLowerCase();
        
        switch (fieldType) {
            case 'text':
            case 'email':
            case 'tel':
            case 'url':
            case 'password':
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                break;
                
            case 'textarea':
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                break;
                
            case 'select':
                const option = Array.from(input.options).find(opt => 
                    opt.value.toLowerCase() === value.toLowerCase() ||
                    opt.text.toLowerCase() === value.toLowerCase()
                );
                if (option) {
                    input.value = option.value;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                break;
                
            case 'radio':
                const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
                for (const radio of radioGroup) {
                    if (radio.value.toLowerCase() === value.toLowerCase()) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
                break;
                
            case 'checkbox':
                if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                break;
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
