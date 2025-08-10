import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSupabase } from './supabase';

// API Configuration
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:2024';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } else {
        console.warn('Supabase client not available. API requests will be made without authentication.');
      }
    } catch (error) {
      console.error('Error getting session for API request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to sign-in
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface ResearchRequest {
  query: string;
  research_type?: 'general' | 'academic' | 'market' | 'technical';
  max_results?: number;
  include_sources?: boolean;
}

export interface ResearchResponse {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  query: string;
  result?: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface UsageStats {
  current_month_requests: number;
  total_requests: number;
  tokens_used: number;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  monthly_limit: number;
  remaining_requests: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// API Functions

/**
 * Authentication API
 */
export const authAPI = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put('/auth/profile', profile);
    return response.data;
  },

  // Get usage statistics
  getUsageStats: async (): Promise<UsageStats> => {
    const response = await apiClient.get('/auth/usage');
    return response.data;
  },
};

/**
 * Research API
 */
export const researchAPI = {
  // Submit a new research request
  submitResearch: async (request: ResearchRequest): Promise<ResearchResponse> => {
    const response = await apiClient.post('/research', request);
    return response.data;
  },

  // Get research status by ID
  getResearchStatus: async (researchId: string): Promise<ResearchResponse> => {
    const response = await apiClient.get(`/research/${researchId}`);
    return response.data;
  },

  // Get all research requests for the user
  getResearchHistory: async (limit?: number, offset?: number): Promise<ResearchResponse[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await apiClient.get(`/research?${params.toString()}`);
    return response.data;
  },

  // Cancel a research request
  cancelResearch: async (researchId: string): Promise<void> => {
    await apiClient.delete(`/research/${researchId}`);
  },
};

/**
 * Reports API
 */
export const reportsAPI = {
  // Get all reports for the user
  getReports: async (limit?: number, offset?: number): Promise<ResearchResponse[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await apiClient.get(`/reports?${params.toString()}`);
    return response.data;
  },

  // Get a specific report by ID
  getReport: async (reportId: string): Promise<ResearchResponse> => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  // Export report in different formats
  exportReport: async (reportId: string, format: 'pdf' | 'markdown' | 'json'): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${reportId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Share a report (get shareable link)
  shareReport: async (reportId: string): Promise<{ share_url: string }> => {
    const response = await apiClient.post(`/reports/${reportId}/share`);
    return response.data;
  },

  // Bookmark/unbookmark a report
  toggleBookmark: async (reportId: string): Promise<{ bookmarked: boolean }> => {
    const response = await apiClient.post(`/reports/${reportId}/bookmark`);
    return response.data;
  },

  // Search reports
  searchReports: async (query: string, limit?: number): Promise<ResearchResponse[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    
    const response = await apiClient.get(`/reports/search?${params.toString()}`);
    return response.data;
  },
};

/**
 * Subscription API
 */
export const subscriptionAPI = {
  // Get current subscription details
  getSubscription: async () => {
    const response = await apiClient.get('/subscription');
    return response.data;
  },

  // Create Stripe checkout session
  createCheckoutSession: async (priceId: string) => {
    const response = await apiClient.post('/subscription/checkout', { price_id: priceId });
    return response.data;
  },

  // Create customer portal session
  createPortalSession: async () => {
    const response = await apiClient.post('/subscription/portal');
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await apiClient.post('/subscription/cancel');
    return response.data;
  },
};

/**
 * Health check API
 */
export const healthAPI = {
  // Check if backend is healthy
  checkHealth: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if backend is available
  isBackendAvailable: async (): Promise<boolean> => {
    try {
      await healthAPI.checkHealth();
      return true;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  },

  // Format API errors for display
  formatError: (error: any): string => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Handle rate limiting
  handleRateLimit: (error: any): boolean => {
    return error.response?.status === 429;
  },
};

export default apiClient;


