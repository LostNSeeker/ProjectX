# JobFormAutoFiller Chrome Extension

A Chrome extension that automatically scrapes job pages and fills application forms using AI (LLM) integration.

## Features

- **Smart Job Scraping**: Automatically detects and scrapes job listing pages
- **AI-Powered Form Filling**: Uses LLM to analyze forms and generate personalized answers
- **Multiple LLM Support**: Works with OpenAI GPT-4o-mini and xAI Grok
- **Privacy-Focused**: All data stored locally, user consent required for all actions
- **Responsive UI**: Clean, modern popup interface

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Clone or download this extension**
2. **Install dependencies**:
   ```bash
   cd extension
   npm install
   ```
3. **Build the extension**:
   ```bash
   npm run build
   ```
4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this extension
   - The extension should now appear in your extensions list

### Method 2: Package and Install

1. **Package the extension**:
   ```bash
   npm run package
   ```
2. **Install the .zip file**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Drag and drop the `jobformautofiller.zip` file

## Setup

1. **Get API Keys**:
   - For OpenAI: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - For xAI: Get your API key from [xAI Console](https://console.x.ai/)

2. **Configure the Extension**:
   - Click the extension icon in your browser toolbar
   - Select your preferred LLM provider
   - Enter your API key
   - Click "Save Configuration"

3. **Add Your Resume**:
   - Paste your resume/CV text in the "Resume/CV Data" section
   - Click "Save Resume"

## Usage

### Scraping Job Pages

1. Navigate to a job listing page (LinkedIn, Indeed, company career pages, etc.)
2. Click the extension icon
3. Click "Scrape Job Page"
4. Confirm the scraping action when prompted
5. The job data will be extracted and stored locally

### Auto-Filling Forms

1. Navigate to a job application form
2. Click the extension icon
3. Click "Auto-Fill Form"
4. Confirm the form filling action when prompted
5. The form will be automatically filled with personalized answers

## Supported Sites

The extension works on most job sites including:
- LinkedIn Jobs
- Indeed
- Glassdoor
- Company career pages
- Remote job boards
- And many more!

## Privacy & Security

- **Local Storage**: All job data is stored locally in your browser
- **User Consent**: The extension asks for permission before scraping or filling forms
- **API Keys**: Your API keys are stored locally and never shared
- **No Tracking**: The extension doesn't collect or transmit personal data

## Troubleshooting

### Common Issues

1. **"API Key Required" Error**:
   - Make sure you've entered a valid API key in the configuration
   - Check that your API key has sufficient credits

2. **"No Jobs Stored" Error**:
   - Scrape a job page first before trying to auto-fill forms
   - Make sure the page contains job information

3. **Form Not Filling**:
   - Ensure you're on a page with a form
   - Check that your resume data is saved
   - Some forms may have anti-automation measures

4. **LLM API Errors**:
   - Check your internet connection
   - Verify your API key is correct
   - Check your API usage limits

### Debug Mode

To see detailed logs:
1. Open Chrome DevTools (F12)
2. Go to the Console tab
3. Look for messages from the extension

## Development

### Project Structure

```
extension/
├── manifest.json          # Extension manifest
├── popup.html            # Popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── content.js            # Content script for scraping/filling
├── background.js         # Background service worker
├── package.json          # Dependencies
├── webpack.config.js     # Build configuration
└── icons/                # Extension icons
```

### Building

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Package for distribution
npm run package
```

## Legal Notice

⚠️ **Important**: This extension is for personal use only. Please respect website terms of service and rate limits. The authors are not responsible for any misuse of this tool.

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please create an issue in the project repository.
