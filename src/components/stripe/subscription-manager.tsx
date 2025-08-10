'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { subscriptionAPI, authAPI } from '@/lib/api';
import { SUBSCRIPTION_PLANS, getPlanByTier, formatPrice, getUsagePercentage, isWithinLimits, SubscriptionTier } from '@/lib/stripe';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

interface SubscriptionData {
  id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  tier: SubscriptionTier;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface UsageData {
  current_month_requests: number;
  total_requests: number;
  tokens_used: number;
  subscription_tier: SubscriptionTier;
  monthly_limit: number;
  remaining_requests: number;
}

export default function SubscriptionManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const [subscriptionData, usageData] = await Promise.all([
        subscriptionAPI.getSubscription(),
        authAPI.getUsageStats(),
      ]);
      
      setSubscription(subscriptionData);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const { url } = await subscriptionAPI.createPortalSession();
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    } finally {
      setIsManaging(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      await subscriptionAPI.cancelSubscription();
      await loadSubscriptionData(); // Refresh data
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled and will end at the current billing period",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !usage) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <CreditCard className="h-16 w-16 mb-4" />
          <p>No subscription information available</p>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = getPlanByTier(subscription.tier);
  if (!currentPlan) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <AlertTriangle className="h-16 w-16 mb-4" />
          <p>Invalid subscription plan</p>
        </CardContent>
      </Card>
    );
  }

  const usageLimits = isWithinLimits(
    {
      monthlyRequests: usage.current_month_requests,
      concurrentUnits: 1, // This would come from actual usage data
      tokensUsed: usage.tokens_used,
    },
    currentPlan
  );

  const requestsPercentage = getUsagePercentage(usage.current_month_requests, currentPlan.limits.monthlyRequests);
  const tokensPercentage = getUsagePercentage(usage.tokens_used, currentPlan.limits.tokensPerMonth);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active', icon: CheckCircle },
      inactive: { variant: 'secondary' as const, label: 'Inactive', icon: AlertTriangle },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', icon: AlertTriangle },
      past_due: { variant: 'destructive' as const, label: 'Past Due', icon: AlertTriangle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
              <p className="text-muted-foreground">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(subscription.status)}
              {currentPlan.monthlyPrice > 0 && (
                <p className="text-2xl font-bold mt-2">
                  {formatPrice(currentPlan.monthlyPrice)}<span className="text-sm font-normal">/month</span>
                </p>
              )}
            </div>
          </div>

          {subscription.status === 'active' && subscription.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {subscription.cancel_at_period_end ? (
                <span>Expires on {format(new Date(subscription.current_period_end), 'PPP')}</span>
              ) : (
                <span>Renews on {format(new Date(subscription.current_period_end), 'PPP')}</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleManageSubscription}
              disabled={isManaging}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isManaging ? 'Loading...' : 'Manage Subscription'}
            </Button>
            
            {subscription.status === 'active' && !subscription.cancel_at_period_end && currentPlan.tier !== 'free' && (
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                className="flex items-center gap-2"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Research Requests */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Research Requests</span>
              <span className="text-sm text-muted-foreground">
                {usage.current_month_requests} / {currentPlan.limits.monthlyRequests === -1 ? '∞' : currentPlan.limits.monthlyRequests}
              </span>
            </div>
            <Progress 
              value={requestsPercentage} 
              className={`h-2 ${!usageLimits.requests ? 'bg-red-100' : ''}`}
            />
            {!usageLimits.requests && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                You've reached your monthly limit
              </p>
            )}
          </div>

          {/* Token Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token Usage</span>
              <span className="text-sm text-muted-foreground">
                {usage.tokens_used.toLocaleString()} / {currentPlan.limits.tokensPerMonth === -1 ? '∞' : currentPlan.limits.tokensPerMonth.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={tokensPercentage} 
              className={`h-2 ${!usageLimits.tokens ? 'bg-red-100' : ''}`}
            />
            {!usageLimits.tokens && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                You've reached your token limit
              </p>
            )}
          </div>

          <Separator />

          {/* Usage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{usage.total_requests}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{currentPlan.limits.concurrentUnits}</p>
              <p className="text-sm text-muted-foreground">Concurrent Units</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{usage.remaining_requests}</p>
              <p className="text-sm text-muted-foreground">Remaining This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Plan Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {currentPlan.tier === 'free' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to unlock more research power?</h3>
              <p className="text-muted-foreground">
                Upgrade to Pro for 500 monthly requests, advanced research types, and priority support.
              </p>
              <Button asChild>
                <a href="/pricing" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Plans
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
