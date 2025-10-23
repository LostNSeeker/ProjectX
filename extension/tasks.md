You are an expert browser extension developer with deep knowledge of Chrome Extensions (Manifest V3), JavaScript, web scraping, DOM manipulation, LLM integrations, and best practices for security, performance, and privacy. Your task is to generate the complete, functional code for a Chrome browser extension based on the following detailed specifications. Think step-by-step before writing any code: First, outline the extension's architecture (manifest, content scripts, background scripts, storage). Second, ensure adaptability to different sites by scraping full pages and using LLMs for extraction and form mapping. Third, incorporate error handling, user consent for privacy, and optimizations for API usage. Fourth, structure the output with clear sections, comments in code, and explanations.
Extension Specifications:

Name: JobFormAutoFiller
Description: A Chrome extension that scrapes entire web pages for job-related data (e.g., job role, description, requirements), stores it securely, and uses an LLM to generate personalized answers for job application forms on various sites, then auto-fills them.
Key Features:

On job listing pages: Scrape the full page content, clean it (using libraries like @mozilla/readability and Turndown.js for Markdown conversion), send to LLM to extract structured job data (e.g., {title, company, description, requirements}), and store in Chrome local storage.
On application form pages: Scrape the form HTML, use LLM to identify and map fields (e.g., [{label, type, purpose}]), retrieve stored job data, generate answers for each field via LLM (e.g., "Why are you a good fit?" based on job requirements), and fill the fields dynamically.
Handle varying site structures: No hard-coded selectors; rely on LLM for semantic understanding.
UI: A popup with buttons like "Scrape Job Page", "Auto-Fill Form", and a display of stored data for review. Use basic HTML/CSS or a simple framework like React if needed (but keep lightweight).
LLM Integration: Use a configurable API (default to OpenAI GPT-4o-mini; allow xAI Grok API as alternative). Include placeholders for API keys (prompt user to input via popup).
Storage: Use Chrome.storage.local for job data as JSON. Limit to recent jobs (e.g., last 5) to manage size.
Permissions: "activeTab", "storage", "scripting". No unnecessary ones.
Security/Privacy: Sanitize all inputs/outputs, get user consent before scraping, encrypt sensitive data if possible, comply with site TOS (advise in code comments).
Libraries: Include via npm/CDN where possible: @mozilla/readability, turndown, lodash, axios. Bundle with Webpack or Vite.


Tech Stack Details:

JavaScript (ES6+), HTML/CSS for popup.
Manifest V3.
Content scripts for scraping and filling.
Background service worker for LLM API calls and storage (to handle CORS and async).
Error Handling: Graceful failures (e.g., API errors show alerts), logging to console.
Testing: Include sample usage comments.


Assumptions: User provides resume/CV data manually via popup (as a text input) to personalize answers. Extension is for personal use; warn about legal issues with scraping.

Prompting Techniques to Apply in Generation:

Use chain-of-thought in your internal reasoning, but output clean code.
Provide few-shot examples: Include inline code snippets for key parts (e.g., a sample LLM prompt for extraction).
Ensure zero-shot capability for edge cases, but guide with structured prompts.
Output Format:

manifest.json
popup.html (with script tags or linked JS)
popup.js
content.js (for scraping and filling)
background.js (for LLM and storage)
Any other files (e.g., styles.css, package.json for dependencies)
Installation/Usage Instructions


Make the code modular, readable, and extensible. Comment extensively.
Optimize for performance: Limit LLM calls, cache responses, handle token limits by summarizing content.
Edge Cases: Handle large pages (chunk content), no data found, form variations, API rate limits.
Generate the complete extension code now. Do not include any placeholders or incomplete sections—make it ready to zip and load as an unpacked extension. If using external libraries, specify how to install