import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration with lazy initialization to prevent build-time errors
const getSupabaseConfig = (): { url: string; anonKey: string } | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    // During build time or when env vars are missing, provide helpful error message
    if (typeof window === 'undefined') {
      // Server-side/build-time: log warning but don't throw to prevent build failures
      console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are not set. Supabase functionality will be disabled.');
      return null;
    } else {
      // Client-side: throw error for runtime debugging
      throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY). Please check your environment configuration.');
    }
  }
  
  return { url, anonKey };
};

// Create Supabase client with lazy initialization
let supabaseClient: SupabaseClient | null = null;

const createSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  
  if (!config) {
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(config.url, config.anonKey);
  }
  
  return supabaseClient;
};

// Export a getter function instead of direct client to handle missing env vars gracefully
export const getSupabase = (): SupabaseClient | null => {
  return createSupabaseClient();
};

// For backward compatibility, export supabase but with null fallback
export const supabase = createSupabaseClient();

// Types for our database schema
export interface UserProfile {
  user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  subscription_status?: {
    tier: string;
    status: string;
    current_period_end: string;
  };
}

export interface Subscription {
  id: string;
  user_id: string;
  customer_id: string;
  status: string;
  tier: string;
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  subscription_id?: string;
  usage_type: string;
  quantity: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

