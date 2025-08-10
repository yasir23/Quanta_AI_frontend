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

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  const handleExplainTrend = (trendName: string) => {
    setSelectedTrend(trendName);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trends.map((trend) => (
          <TrendCard
            key={trend.name}
            trend={trend}
            onExplain={handleExplainTrend}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Trend Overview</CardTitle>
            <CardDescription>
              Mention volume for key emerging trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Global Sentiment</CardTitle>
            <CardDescription>
              Geographical sentiment for 'Autonomous AI Agents'.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentMap />
          </CardContent>
        </Card>
      </div>
      <ExplainTrendModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        trendName={selectedTrend}
      />
    </>
  );
}

