'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play, 
  Pause, 
  X,
  Eye,
  Calendar,
  Timer
} from 'lucide-react';
import { ResearchClient } from '@/ai/research-client';
import { ResearchResponse } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface ResearchProgressTrackerProps {
  activeResearch: ResearchResponse[];
  onResearchCompleted: (research: ResearchResponse) => void;
  onResearchCancelled: (researchId: string) => void;
  onViewResults: (research: ResearchResponse) => void;
}

interface ResearchProgress {
  id: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedTimeRemaining?: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    label: 'Pending',
  },
  in_progress: {
    icon: Loader2,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    label: 'In Progress',
  },
  completed: {
    icon: CheckCircle,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    label: 'Failed',
  },
};

export default function ResearchProgressTracker({
  activeResearch,
  onResearchCompleted,
  onResearchCancelled,
  onViewResults,
}: ResearchProgressTrackerProps) {
  const [progressMap, setProgressMap] = useState<Map<string, ResearchProgress>>(new Map());
  const [isPolling, setIsPolling] = useState(true);

  // Initialize progress tracking for new research items
  useEffect(() => {
    const newProgressMap = new Map(progressMap);
    
    activeResearch.forEach(research => {
      if (!newProgressMap.has(research.id)) {
        newProgressMap.set(research.id, {
          id: research.id,
          progress: research.status === 'completed' ? 100 : research.status === 'failed' ? 0 : 25,
          status: research.status,
        });
      }
    });
    
    setProgressMap(newProgressMap);
  }, [activeResearch]);

  // Polling for research updates
  useEffect(() => {
    if (!isPolling || activeResearch.length === 0) return;

    const pollInterval = setInterval(async () => {
      const updatedProgressMap = new Map(progressMap);
      
      for (const research of activeResearch) {
        if (research.status === 'completed' || research.status === 'failed') continue;
        
        try {
          const updatedResearch = await ResearchClient.getResearchStatus(research.id);
          const currentProgress = progressMap.get(research.id);
          
          // Update progress based on status
          let newProgress = currentProgress?.progress || 0;
          if (updatedResearch.status === 'in_progress') {
            newProgress = Math.min(90, newProgress + 5); // Gradually increase progress
          } else if (updatedResearch.status === 'completed') {
            newProgress = 100;
            onResearchCompleted(updatedResearch);
          } else if (updatedResearch.status === 'failed') {
            newProgress = 0;
          }
          
          updatedProgressMap.set(research.id, {
            id: research.id,
            progress: newProgress,
            status: updatedResearch.status,
            estimatedTimeRemaining: updatedResearch.status === 'in_progress' ? 
              Math.max(30, 300 - (newProgress * 3)) : undefined,
          });
          
        } catch (error) {
          console.error(`Failed to update research ${research.id}:`, error);
        }
      }
      
      setProgressMap(updatedProgressMap);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [isPolling, activeResearch, progressMap, onResearchCompleted]);

  const handleCancelResearch = async (researchId: string) => {
    try {
      await ResearchClient.cancelResearch(researchId);
      onResearchCancelled(researchId);
      
      // Update progress map
      const updatedProgressMap = new Map(progressMap);
      updatedProgressMap.delete(researchId);
      setProgressMap(updatedProgressMap);
    } catch (error) {
      console.error('Failed to cancel research:', error);
    }
  };

  const togglePolling = () => {
    setIsPolling(!isPolling);
  };

  if (activeResearch.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-muted-foreground" />
            Research Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Clock className="h-8 w-8 mb-2" />
            <p>No active research requests</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Research Progress ({activeResearch.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePolling}
              className="flex items-center gap-1"
            >
              {isPolling ? (
                <>
                  <Pause className="h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activeResearch.map((research) => {
              const progress = progressMap.get(research.id);
              const config = statusConfig[research.status];
              const Icon = config.icon;
              
              return (
                <div
                  key={research.id}
                  className={`p-4 rounded-lg border ${config.bgColor} transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      <Badge variant="secondary" className={`${config.textColor} bg-white/50`}>
                        <Icon className={`h-3 w-3 mr-1 ${research.status === 'in_progress' ? 'animate-spin' : ''}`} />
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {research.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewResults(research)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      {(research.status === 'pending' || research.status === 'in_progress') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelResearch(research.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium line-clamp-2">
                      {research.query}
                    </p>
                    
                    {progress && (research.status === 'pending' || research.status === 'in_progress') && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round(progress.progress)}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                        {progress.estimatedTimeRemaining && (
                          <p className="text-xs text-muted-foreground">
                            Est. {Math.round(progress.estimatedTimeRemaining / 60)} min remaining
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(research.created_at), { addSuffix: true })}
                      </div>
                      {research.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed {formatDistanceToNow(new Date(research.completed_at), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                    
                    {research.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        <strong>Error:</strong> {research.error}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
