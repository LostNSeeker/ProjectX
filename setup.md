# Setup Instructions

## Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get API Keys:**
   - **Stripe:** Sign up at https://stripe.com and get your test keys
   - **Gemini AI:** Get your API key from https://makersuite.google.com/app/apikey

4. **Run the authentication server (with SQLite database):**
   ```bash
   python start_auth.py
   ```
   The auth server will run on http://localhost:8001

5. **Run the main backend (in another terminal):**
   ```bash
   python main.py
   ```
   The main server will run on http://localhost:8000

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

## Extension Setup

1. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension` folder

2. **Update the extension to use your auth token:**
   - After logging in to the web app, the extension will automatically get your auth token
   - The extension will use this token to access your profile data for form filling

## Usage Flow

1. **User Registration:**
   - User visits the frontend
   - Sees payment screen ($100)
   - Completes payment with Stripe
   - Registers with email/password
   - Fills out onboarding questions (40 questions from the list)

2. **Extension Usage:**
   - User installs the extension
   - Visits a job application page
   - Extension detects the form
   - User clicks "Auto Fill" button
   - Extension uses stored profile data + Gemini AI to fill the form intelligently

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment intent

### Onboarding
- `POST /api/onboarding` - Save onboarding data
- `GET /api/onboarding` - Get onboarding data

### Auto-fill
- `POST /api/autofill/generate` - Generate form fill data using Gemini AI

## Security Notes

- Change the JWT secret key in production
- Use environment variables for all sensitive data
- Implement proper CORS settings for production
- Add rate limiting and input validation
- Use HTTPS in production
