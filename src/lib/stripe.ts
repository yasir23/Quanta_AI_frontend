import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Subscription tiers and pricing
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  monthlyPriceId: string | null;
  yearlyPriceId: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    monthlyRequests: number;
    concurrentUnits: number;
    tokensPerMonth: number;
  };
  isPopular?: boolean;
}

// Subscription plans configuration
// Note: These price IDs should match the ones configured in your Stripe dashboard
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with AI research',
    tier: SUBSCRIPTION_TIERS.FREE,
    monthlyPriceId: null,
    yearlyPriceId: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '10 research requests per month',
      '1 concurrent research unit',
      '50,000 tokens per month',
      'Basic research types',
      'Community support',
      'Export to PDF/Markdown',
    ],
    limits: {
      monthlyRequests: 10,
      concurrentUnits: 1,
      tokensPerMonth: 50000,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals who need comprehensive research capabilities',
    tier: SUBSCRIPTION_TIERS.PRO,
    monthlyPriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    yearlyPriceId: 'price_pro_yearly',   // Replace with actual Stripe price ID
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    features: [
      '500 research requests per month',
      '5 concurrent research units',
      '1,000,000 tokens per month',
      'All research types (Academic, Market, Technical)',
      'Priority support',
      'Advanced export options',
      'Research history & bookmarks',
      'Share research reports',
    ],
    limits: {
      monthlyRequests: 500,
      concurrentUnits: 5,
      tokensPerMonth: 1000000,
    },
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations that need unlimited research power',
    tier: SUBSCRIPTION_TIERS.ENTERPRISE,
    monthlyPriceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    yearlyPriceId: 'price_enterprise_yearly',   // Replace with actual Stripe price ID
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    features: [
      'Unlimited research requests',
      '20 concurrent research units',
      'Unlimited tokens',
      'All research types + Custom prompts',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration features',
      'Advanced analytics',
      'Priority processing',
    ],
    limits: {
      monthlyRequests: -1, // -1 indicates unlimited
      concurrentUnits: 20,
      tokensPerMonth: -1,  // -1 indicates unlimited
    },
  },
];

// Helper functions
export const getPlanByTier = (tier: SubscriptionTier): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.tier === tier);
};

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === id);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  const yearlyMonthlyEquivalent = monthlyPrice * 12;
  return yearlyMonthlyEquivalent - yearlyPrice;
};

export const getYearlySavingsPercentage = (monthlyPrice: number, yearlyPrice: number): number => {
  const savings = calculateYearlySavings(monthlyPrice, yearlyPrice);
  const yearlyMonthlyEquivalent = monthlyPrice * 12;
  return Math.round((savings / yearlyMonthlyEquivalent) * 100);
};

// Usage tracking helpers
export const isWithinLimits = (
  currentUsage: {
    monthlyRequests: number;
    concurrentUnits: number;
    tokensUsed: number;
  },
  plan: SubscriptionPlan
): {
  requests: boolean;
  concurrent: boolean;
  tokens: boolean;
  overall: boolean;
} => {
  const requestsOk = plan.limits.monthlyRequests === -1 || currentUsage.monthlyRequests < plan.limits.monthlyRequests;
  const concurrentOk = currentUsage.concurrentUnits <= plan.limits.concurrentUnits;
  const tokensOk = plan.limits.tokensPerMonth === -1 || currentUsage.tokensUsed < plan.limits.tokensPerMonth;
  
  return {
    requests: requestsOk,
    concurrent: concurrentOk,
    tokens: tokensOk,
    overall: requestsOk && concurrentOk && tokensOk,
  };
};

export const getUsagePercentage = (used: number, limit: number): number => {
  if (limit === -1) return 0; // Unlimited
  return Math.min(100, Math.round((used / limit) * 100));
};

export default getStripe;
