'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OverviewChart from '@/components/dashboard/overview-chart';
import TrendCard from '@/components/dashboard/trend-card';
import SentimentMap from '@/components/dashboard/sentiment-map';
import { trends } from '@/lib/constants';
import ExplainTrendModal from '@/components/dashboard/explain-trend-modal';

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
