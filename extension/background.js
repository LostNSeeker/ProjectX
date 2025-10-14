// Background service worker for JobFormAutoFiller extension
class BackgroundService {
    constructor() {
        this.setupMessageListener();
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
                case 'extractJobData':
                    const extractResult = await this.extractJobData(request);
                    sendResponse(extractResult);
                    break;
                case 'analyzeForm':
                    const analyzeResult = await this.analyzeForm(request);
                    sendResponse(analyzeResult);
                    break;
                case 'generateAnswer':
                    const answerResult = await this.generateAnswer(request);
                    sendResponse(answerResult);
                    break;
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    async extractJobData(request) {
        try {
            const { content, url, config } = request;
            
            const prompt = this.createJobExtractionPrompt(content, url);
            const response = await this.callLLM(prompt, config);
            
            if (!response.success) {
                return { success: false, error: response.error };
            }

            // Parse the LLM response
            const jobData = this.parseJobData(response.content);
            
            return { success: true, jobData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async analyzeForm(request) {
        try {
            const { formHtml, config } = request;
            
            const prompt = this.createFormAnalysisPrompt(formHtml);
            const response = await this.callLLM(prompt, config);
            
            if (!response.success) {
                return { success: false, error: response.error };
            }

            // Parse the LLM response
            const fields = this.parseFormFields(response.content);
            
            return { success: true, fields };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateAnswer(request) {
        try {
            const { field, job, resumeData, config } = request;
            
            const prompt = this.createAnswerGenerationPrompt(field, job, resumeData);
            const response = await this.callLLM(prompt, config);
            
            if (!response.success) {
                return { success: false, error: response.error };
            }

            return { success: true, answer: response.content.trim() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    createJobExtractionPrompt(content, url) {
        return `Extract job information from the following content and return it as a JSON object. Focus on the most important details.

Content:
${content}

URL: ${url}

Please extract and return a JSON object with the following structure:
{
  "title": "Job title",
  "company": "Company name",
  "description": "Job description (first 500 characters)",
  "requirements": ["requirement1", "requirement2", "requirement3"],
  "location": "Job location",
  "employmentType": "Full-time/Part-time/Contract",
  "salary": "Salary range if mentioned",
  "technologies": ["tech1", "tech2", "tech3"]
}

Only return the JSON object, no additional text.`;
    }

    createFormAnalysisPrompt(formHtml) {
        return `Analyze the following HTML form and identify all input fields. Return a JSON array of field objects.

Form HTML:
${formHtml}

For each field, return an object with:
{
  "selector": "CSS selector to find the field",
  "label": "Field label or placeholder text",
  "type": "Field type (text, email, textarea, select, checkbox, radio)",
  "purpose": "What this field is asking for (name, email, cover_letter, experience, etc.)",
  "required": true/false
}

Only return the JSON array, no additional text.`;
    }

    createAnswerGenerationPrompt(field, job, resumeData) {
        return `Generate a personalized answer for a job application form field based on the job requirements and resume data.

Field Information:
- Label: ${field.label}
- Type: ${field.type}
- Purpose: ${field.purpose}

Job Information:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Requirements: ${job.requirements ? job.requirements.join(', ') : 'Not specified'}
- Technologies: ${job.technologies ? job.technologies.join(', ') : 'Not specified'}

Resume/CV Data:
${resumeData}

Generate a concise, professional answer (1-3 sentences) that:
1. Directly addresses what the field is asking for
2. Highlights relevant experience from the resume
3. Shows how your skills match the job requirements
4. Is specific and personalized

Only return the answer text, no additional formatting or explanation.`;
    }

    async callLLM(prompt, config) {
        try {
            const { apiProvider, apiKey } = config;
            
            if (!apiKey) {
                return { success: false, error: 'API key not configured' };
            }

            if (apiProvider === 'openai') {
                return await this.callOpenAI(prompt, apiKey);
            } else if (apiProvider === 'xai') {
                return await this.callXAI(prompt, apiKey);
            } else {
                return { success: false, error: 'Unknown API provider' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async callOpenAI(prompt, apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;
            
            if (!content) {
                throw new Error('No content received from OpenAI API');
            }

            return { success: true, content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async callXAI(prompt, apiKey) {
        try {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'grok-beta',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`xAI API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;
            
            if (!content) {
                throw new Error('No content received from xAI API');
            }

            return { success: true, content };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    parseJobData(content) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback parsing if JSON extraction fails
            return this.fallbackJobParsing(content);
        } catch (error) {
            console.error('Error parsing job data:', error);
            return this.fallbackJobParsing(content);
        }
    }

    fallbackJobParsing(content) {
        // Simple fallback parsing
        return {
            title: 'Job Title',
            company: 'Company Name',
            description: content.substring(0, 500),
            requirements: [],
            location: 'Not specified',
            employmentType: 'Full-time',
            salary: 'Not specified',
            technologies: []
        };
    }

    parseFormFields(content) {
        try {
            // Try to extract JSON array from the response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback parsing
            return [];
        } catch (error) {
            console.error('Error parsing form fields:', error);
            return [];
        }
    }
}

// Initialize background service
new BackgroundService();
