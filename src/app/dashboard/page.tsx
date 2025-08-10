'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  FileText, 
  Search, 
  TrendingUp, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { researchAPI } from '@/lib/api';
import { getUsageStats } from '@/lib/usage-tracking';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface DashboardStats {
  totalResearch: number;
  completedResearch: number;
  pendingResearch: number;
  monthlyRequests: number;
  tokensUsed: number;
  recentReports: any[];
}

interface UsageStats {
  requests: number;
  tokens: number;
  requestsUsed: number;
  tokensUsed: number;
  requestsLimit: number;
  tokensLimit: number;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalResearch: 0,
    completedResearch: 0,
    pendingResearch: 0,
    monthlyRequests: 0,
    tokensUsed: 0,
    recentReports: [],
  });
  const [usageStats, setUsageStats] = useState<UsageStats>({
    requests: 0,
    tokens: 0,
    requestsUsed: 0,
    tokensUsed: 0,
    requestsLimit: 0,
    tokensLimit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load usage statistics
      const usage = await getUsageStats();
      setUsageStats(usage);

      // Load recent reports
      const reportsResponse = await researchAPI.getResearchHistory(5);
      
      // Mock research statistics for now
      const stats = {
        total: reportsResponse.length || 0,
        completed: reportsResponse.filter((r: any) => r.status === 'completed').length || 0,
        pending: reportsResponse.filter((r: any) => r.status === 'in_progress').length || 0,
      };
      
      setDashboardStats({
        totalResearch: stats.total || 0,
        completedResearch: stats.completed || 0,
        pendingResearch: stats.pending || 0,
        monthlyRequests: usage.requestsUsed,
        tokensUsed: usage.tokensUsed,
        recentReports: reportsResponse || [],
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionTier = () => {
    return (profile as any)?.subscription_tier || 'free';
  };

  const getSubscriptionStatus = () => {
    return (profile as any)?.subscription_status || 'inactive';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your research activity and usage analytics.
        </p>
      </div>

      {/* Usage Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Monthly Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Requests</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.requestsUsed}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>of {usageStats.requestsLimit === -1 ? '∞' : usageStats.requestsLimit}</span>
              <Badge variant={getSubscriptionTier() === 'free' ? 'secondary' : 'default'} className="text-xs">
                {getSubscriptionTier().toUpperCase()}
              </Badge>
            </div>
            {usageStats.requestsLimit !== -1 && (
              <Progress 
                value={usageStats.requests} 
                className="mt-2" 
                aria-label={`${usageStats.requests}% of monthly requests used`}
              />
            )}
          </CardContent>
        </Card>

        {/* Token Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.tokensUsed.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>of {usageStats.tokensLimit === -1 ? '∞' : usageStats.tokensLimit.toLocaleString()}</span>
            </div>
            {usageStats.tokensLimit !== -1 && (
              <Progress 
                value={usageStats.tokens} 
                className="mt-2"
                aria-label={`${usageStats.tokens}% of monthly tokens used`}
              />
            )}
          </CardContent>
        </Card>

        {/* Completed Research */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Research</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.completedResearch}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.pendingResearch > 0 && `${dashboardStats.pendingResearch} in progress`}
            </p>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{getSubscriptionTier()}</div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={getSubscriptionStatus() === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {getSubscriptionStatus().toUpperCase()}
              </Badge>
              {getSubscriptionTier() === 'free' && (
                <Link href="/pricing">
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Research Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Research Activity
            </CardTitle>
            <CardDescription>
              Your latest research reports and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats.recentReports.length > 0 ? (
              <div className="space-y-4">
                {dashboardStats.recentReports.map((report: any, index: number) => (
                  <div key={report.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.title || report.query || 'Research Report'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                        {report.status || 'completed'}
                      </Badge>
                      <Link href={`/dashboard/reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/reports">
                    <Button variant="outline">View All Reports</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No research reports yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first research to see activity here
                </p>
                <Link href="/dashboard/explorer">
                  <Button>Start Research</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/explorer">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  New Research
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Usage Warnings */}
          {(usageStats.requests > 80 || usageStats.tokens > 80) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Usage Warning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700">
                {usageStats.requests > 80 && (
                  <p className="mb-2">
                    You've used {usageStats.requests.toFixed(0)}% of your monthly research requests.
                  </p>
                )}
                {usageStats.tokens > 80 && (
                  <p className="mb-2">
                    You've used {usageStats.tokens.toFixed(0)}% of your monthly token allowance.
                  </p>
                )}
                {getSubscriptionTier() === 'free' && (
                  <Link href="/pricing">
                    <Button size="sm" className="mt-2">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Research Engine</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Sources</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}





