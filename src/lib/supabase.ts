import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
