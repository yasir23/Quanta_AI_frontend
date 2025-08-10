'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LoaderCircle, Sparkles, ExternalLink } from 'lucide-react';
import { ResearchClient } from '@/ai/research-client';
import { Button } from '../ui/button';

interface ExplainTrendModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trendName: string | null;
}

export default function ExplainTrendModal({
  isOpen,
  setIsOpen,
  trendName,
}: ExplainTrendModalProps) {
  const [explanation, setExplanation] = useState('');
  const [sources, setSources] = useState<Array<{ title: string; url: string; snippet: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    if (isOpen && trendName) {
      const getExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation('');
        setSources([]);
        setProgress(0);
        setStatus('pending');
        
        try {
          const result = await ResearchClient.explainTrend(
            { trend: trendName },
            (newStatus, newProgress) => {
              setStatus(newStatus);
              if (newProgress !== undefined) {
                setProgress(newProgress);
              }
            }
          );
          
          setExplanation(result.explanation);
          setSources(result.sources || []);
          setStatus('completed');
        } catch (e: any) {
          setError(e.message || 'Failed to generate explanation. Please try again.');
          setStatus('failed');
          console.error('Research error:', e);
        } finally {
          setIsLoading(false);
        }
      };
      getExplanation();
    }
  }, [isOpen, trendName]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Research Analysis: {trendName}
          </DialogTitle>
          <DialogDescription>
            Deep research analysis powered by LangGraph multi-agent system.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {status === 'pending' && 'Initializing research...'}
                  {status === 'in_progress' && 'Research agents are working...'}
                </p>
                {progress > 0 && (
                  <div className="w-64 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {error && (
            <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-medium">Research Failed</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          )}
          {explanation && (
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                {explanation.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {sources && sources.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Research Sources ({sources.length})
                  </h4>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm truncate">{source.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {source.snippet}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0"
                            onClick={() => window.open(source.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}



