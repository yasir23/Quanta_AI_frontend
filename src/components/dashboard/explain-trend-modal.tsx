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
            Explaining: {trendName}
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis of the trend based on real-time data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {explanation && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              {explanation.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


