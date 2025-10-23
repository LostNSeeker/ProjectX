import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  created_at: string;
  payment_completed: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  payment_intent_id?: string;
}

export interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
}

export interface OnboardingData {
  [key: string]: any;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    this.syncTokenWithExtension(access_token);
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await api.post('/auth/register', credentials);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    this.syncTokenWithExtension(access_token);
    return response.data;
  },

  syncTokenWithExtension(token: string) {
    // Try to sync with extension via postMessage
    window.postMessage({
      type: 'AUTH_TOKEN_UPDATE',
      token: token
    }, '*');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async createPaymentIntent(amount: number = 10000): Promise<PaymentIntent> {
    const response = await api.post('/payment/create-intent', { amount });
    return response.data;
  },

  async saveOnboardingData(data: OnboardingData) {
    const response = await api.post('/onboarding', data);
    return response.data;
  },

  async getOnboardingData(): Promise<OnboardingData> {
    const response = await api.get('/onboarding');
    return response.data;
  },

  async generateAutofillData(formFields: any[], jobDescription: string) {
    const response = await api.post('/autofill/generate', {
      form_fields: formFields,
      job_description: jobDescription
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Admin methods
  async getAdminUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAdminStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAdminOnboardingData() {
    const response = await api.get('/admin/onboarding-data');
    return response.data;
  },

  // Profile methods
  async updateProfile(profileData: any) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Onboarding methods
  async getOnboardingQuestions() {
    const response = await api.get('/onboarding/questions');
    return response.data;
  }
};
