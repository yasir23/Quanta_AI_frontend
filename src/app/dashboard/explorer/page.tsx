'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Activity, FileText, TrendingUp } from "lucide-react";
import { ResearchResponse } from '@/lib/api';
import { ResearchClient } from '@/ai/research-client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

// Import research components
import ResearchRequestForm from '@/components/research/research-request-form';
import ResearchProgressTracker from '@/components/research/research-progress-tracker';
import ResearchResultsViewer from '@/components/research/research-results-viewer';

export default function ExplorerPage() {
  const { user } = useAuth();
  const [activeResearch, setActiveResearch] = useState<ResearchResponse[]>([]);
  const [completedResearch, setCompletedResearch] = useState<ResearchResponse[]>([]);
  const [selectedResearch, setSelectedResearch] = useState<ResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new-research');

  // Load research history on component mount
  useEffect(() => {
    if (user) {
      loadResearchHistory();
    }
  }, [user]);

  const loadResearchHistory = async () => {
    try {
      setIsLoading(true);
      const history = await ResearchClient.getResearchHistory(50); // Get last 50 research requests
      
      // Separate active and completed research
      const active = history.filter(r => r.status === 'pending' || r.status === 'in_progress');
      const completed = history.filter(r => r.status === 'completed' || r.status === 'failed');
      
      setActiveResearch(active);
      setCompletedResearch(completed);
    } catch (error) {
      console.error('Failed to load research history:', error);
      toast({
        title: "Error",
        description: "Failed to load research history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResearchSubmitted = (research: ResearchResponse) => {
    setActiveResearch(prev => [research, ...prev]);
    setActiveTab('progress'); // Switch to progress tab
    
    toast({
      title: "Research Started",
      description: "Your research request has been submitted and is being processed",
    });
  };

  const handleResearchCompleted = (research: ResearchResponse) => {
    // Move from active to completed
    setActiveResearch(prev => prev.filter(r => r.id !== research.id));
    setCompletedResearch(prev => [research, ...prev]);
    
    toast({
      title: "Research Completed",
      description: `Research "${research.query.substring(0, 50)}..." has been completed`,
    });
  };

  const handleResearchCancelled = (researchId: string) => {
    setActiveResearch(prev => prev.filter(r => r.id !== researchId));
    
    toast({
      title: "Research Cancelled",
      description: "Research request has been cancelled",
    });
  };

  const handleViewResults = (research: ResearchResponse) => {
    setSelectedResearch(research);
    setActiveTab('results');
  };

  const handleBookmarkToggle = (researchId: string, bookmarked: boolean) => {
    // Update the research item in completed list
    setCompletedResearch(prev => 
      prev.map(r => r.id === researchId ? { ...r, bookmarked } : r)
    );
  };

  const getTabCounts = () => {
    return {
      active: activeResearch.length,
      completed: completedResearch.length,
      total: activeResearch.length + completedResearch.length,
    };
  };

  const counts = getTabCounts();

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please sign in to access the research interface</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Explorer</h1>
          <p className="text-muted-foreground">
            Submit research queries and track progress with our LangGraph multi-agent system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {counts.active} Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {counts.completed} Completed
          </Badge>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new-research" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            New Research
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Progress {counts.active > 0 && `(${counts.active})`}
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            History {counts.completed > 0 && `(${counts.completed})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-research" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResearchRequestForm
                onResearchSubmitted={handleResearchSubmitted}
                isLoading={isLoading}
              />
            </div>
            <div className="space-y-4">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Research</span>
                    <Badge variant="secondary">{counts.total}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Badge variant="default">{counts.active}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <Badge variant="outline">{counts.completed}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {completedResearch.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {completedResearch.slice(0, 3).map((research) => (
                        <div
                          key={research.id}
                          className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleViewResults(research)}
                        >
                          <p className="text-sm font-medium line-clamp-1">
                            {research.query}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {research.status === 'completed' ? 'Completed' : 'Failed'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ResearchProgressTracker
            activeResearch={activeResearch}
            onResearchCompleted={handleResearchCompleted}
            onResearchCancelled={handleResearchCancelled}
            onViewResults={handleViewResults}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResearchResultsViewer
                research={selectedResearch}
                onClose={() => setSelectedResearch(null)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Research</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedResearch.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {completedResearch.map((research) => (
                        <div
                          key={research.id}
                          className={`p-3 border rounded cursor-pointer transition-colors ${
                            selectedResearch?.id === research.id
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedResearch(research)}
                        >
                          <p className="text-sm font-medium line-clamp-2 mb-1">
                            {research.query}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={research.status === 'completed' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {research.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {research.sources?.length || 0} sources
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      <p className="text-sm">No completed research yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Research History</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadResearchHistory}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : completedResearch.length > 0 ? (
                <div className="space-y-3">
                  {completedResearch.map((research) => (
                    <div
                      key={research.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewResults(research)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium line-clamp-2">{research.query}</h4>
                        <Badge
                          variant={research.status === 'completed' ? 'default' : 'destructive'}
                        >
                          {research.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(research.created_at).toLocaleDateString()}
                        </span>
                        <span>{research.sources?.length || 0} sources</span>
                        {research.completed_at && (
                          <span>
                            Completed {new Date(research.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <p>No research history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

