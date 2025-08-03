'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trend = {
  name: string;
  description: string;
  value: string;
  changeType: 'increase' | 'decrease';
};

interface TrendCardProps {
  trend: Trend;
  onExplain: (trendName: string) => void;
}

export default function TrendCard({ trend, onExplain }: TrendCardProps) {
  const isIncrease = trend.changeType === 'increase';

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{trend.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-[40px]">{trend.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div
          className={cn(
            'text-2xl font-bold flex items-center',
            isIncrease ? 'text-green-500' : 'text-red-500'
          )}
        >
          {trend.value}
          {isIncrease ? (
            <ArrowUpRight className="ml-2 h-5 w-5" />
          ) : (
            <ArrowDownRight className="ml-2 h-5 w-5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">vs. last month</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onExplain(trend.name)}
        >
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Explain this trend
        </Button>
      </CardFooter>
    </Card>
  );
}
