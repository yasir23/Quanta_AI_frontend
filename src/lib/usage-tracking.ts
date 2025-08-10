import { authAPI } from './api';
import { getPlanByTier, isWithinLimits, SubscriptionTier } from './stripe';
import { toast } from '@/hooks/use-toast';

export interface UsageData {
  current_month_requests: number;
  total_requests: number;
  tokens_used: number;
  subscription_tier: SubscriptionTier;
  monthly_limit: number;
  remaining_requests: number;
  concurrent_units_used: number;
}

export interface UsageLimits {
  canMakeRequest: boolean;
  canUseConcurrentUnit: boolean;
  hasTokensRemaining: boolean;
  requestsRemaining: number;
  tokensRemaining: number;
  concurrentUnitsAvailable: number;
  limitReasons: string[];
}

/**
 * Usage tracking and limits enforcement utility
 */
export class UsageTracker {
  private static instance: UsageTracker;
  private usageData: UsageData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  /**
   * Get current usage data with caching
   */
  async getUsageData(forceRefresh = false): Promise<UsageData | null> {
    const now = Date.now();
    
    if (!forceRefresh && this.usageData && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.usageData;
    }

    try {
      const usage = await authAPI.getUsageStats();
      this.usageData = usage as UsageData;
      this.lastFetch = now;
      return this.usageData;
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
      return null;
    }
  }

  /**
   * Check if user can perform a research request
   */
  async checkUsageLimits(): Promise<UsageLimits> {
    const usage = await this.getUsageData();
    
    if (!usage) {
      return {
        canMakeRequest: false,
        canUseConcurrentUnit: false,
        hasTokensRemaining: false,
        requestsRemaining: 0,
        tokensRemaining: 0,
        concurrentUnitsAvailable: 0,
        limitReasons: ['Unable to fetch usage data'],
      };
    }

    const plan = getPlanByTier(usage.subscription_tier);
    if (!plan) {
      return {
        canMakeRequest: false,
        canUseConcurrentUnit: false,
        hasTokensRemaining: false,
        requestsRemaining: 0,
        tokensRemaining: 0,
        concurrentUnitsAvailable: 0,
        limitReasons: ['Invalid subscription plan'],
      };
    }

    const limits = isWithinLimits(
      {
        monthlyRequests: usage.current_month_requests,
        concurrentUnits: usage.concurrent_units_used || 0,
        tokensUsed: usage.tokens_used,
      },
      plan
    );

    const requestsRemaining = plan.limits.monthlyRequests === -1 
      ? Infinity 
      : Math.max(0, plan.limits.monthlyRequests - usage.current_month_requests);

    const tokensRemaining = plan.limits.tokensPerMonth === -1 
      ? Infinity 
      : Math.max(0, plan.limits.tokensPerMonth - usage.tokens_used);

    const concurrentUnitsAvailable = Math.max(0, plan.limits.concurrentUnits - (usage.concurrent_units_used || 0));

    const limitReasons: string[] = [];
    if (!limits.requests) {
      limitReasons.push(`Monthly request limit reached (${plan.limits.monthlyRequests})`);
    }
    if (!limits.concurrent) {
      limitReasons.push(`Concurrent unit limit reached (${plan.limits.concurrentUnits})`);
    }
    if (!limits.tokens) {
      limitReasons.push(`Token limit reached (${plan.limits.tokensPerMonth.toLocaleString()})`);
    }

    return {
      canMakeRequest: limits.requests,
      canUseConcurrentUnit: limits.concurrent,
      hasTokensRemaining: limits.tokens,
      requestsRemaining: requestsRemaining === Infinity ? -1 : requestsRemaining,
      tokensRemaining: tokensRemaining === Infinity ? -1 : tokensRemaining,
      concurrentUnitsAvailable,
      limitReasons,
    };
  }

  /**
   * Enforce usage limits before making a research request
   */
  async enforceUsageLimits(): Promise<boolean> {
    const limits = await this.checkUsageLimits();

    if (!limits.canMakeRequest) {
      const reason = limits.limitReasons.join(', ');
      toast({
        title: "Usage Limit Reached",
        description: `Cannot start research: ${reason}. Please upgrade your plan or wait for the next billing cycle.`,
        variant: "destructive",
      });
      return false;
    }

    if (!limits.canUseConcurrentUnit) {
      toast({
        title: "Concurrent Limit Reached",
        description: "You have reached your concurrent research limit. Please wait for current research to complete.",
        variant: "destructive",
      });
      return false;
    }

    // Warning for low remaining requests
    if (limits.requestsRemaining !== -1 && limits.requestsRemaining <= 5) {
      toast({
        title: "Usage Warning",
        description: `You have ${limits.requestsRemaining} research requests remaining this month.`,
        variant: "default",
      });
    }

    // Warning for low remaining tokens
    if (limits.tokensRemaining !== -1 && limits.tokensRemaining <= 10000) {
      toast({
        title: "Token Warning",
        description: `You have ${limits.tokensRemaining.toLocaleString()} tokens remaining this month.`,
        variant: "default",
      });
    }

    return true;
  }

  /**
   * Track a research request (increment usage)
   */
  async trackResearchRequest(): Promise<void> {
    // Invalidate cache to force refresh on next fetch
    this.usageData = null;
    this.lastFetch = 0;
  }

  /**
   * Get usage percentage for display
   */
  async getUsagePercentages(): Promise<{
    requests: number;
    tokens: number;
    requestsUsed: number;
    tokensUsed: number;
    requestsLimit: number;
    tokensLimit: number;
  }> {
    const usage = await this.getUsageData();
    
    if (!usage) {
      return {
        requests: 0,
        tokens: 0,
        requestsUsed: 0,
        tokensUsed: 0,
        requestsLimit: 0,
        tokensLimit: 0,
      };
    }

    const plan = getPlanByTier(usage.subscription_tier);
    if (!plan) {
      return {
        requests: 0,
        tokens: 0,
        requestsUsed: usage.current_month_requests,
        tokensUsed: usage.tokens_used,
        requestsLimit: 0,
        tokensLimit: 0,
      };
    }

    const requestsPercentage = plan.limits.monthlyRequests === -1 
      ? 0 
      : Math.min(100, (usage.current_month_requests / plan.limits.monthlyRequests) * 100);

    const tokensPercentage = plan.limits.tokensPerMonth === -1 
      ? 0 
      : Math.min(100, (usage.tokens_used / plan.limits.tokensPerMonth) * 100);

    return {
      requests: requestsPercentage,
      tokens: tokensPercentage,
      requestsUsed: usage.current_month_requests,
      tokensUsed: usage.tokens_used,
      requestsLimit: plan.limits.monthlyRequests,
      tokensLimit: plan.limits.tokensPerMonth,
    };
  }

  /**
   * Clear cached usage data
   */
  clearCache(): void {
    this.usageData = null;
    this.lastFetch = 0;
  }
}

// Export singleton instance
export const usageTracker = UsageTracker.getInstance();

// Helper functions for components
export const checkCanMakeRequest = async (): Promise<boolean> => {
  return await usageTracker.enforceUsageLimits();
};

export const trackRequest = async (): Promise<void> => {
  await usageTracker.trackResearchRequest();
};

export const getUsageStats = async () => {
  return await usageTracker.getUsagePercentages();
};

export const refreshUsageData = async () => {
  return await usageTracker.getUsageData(true);
};
