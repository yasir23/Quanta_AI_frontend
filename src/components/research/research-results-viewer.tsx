'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  Clock,
  Search,
  Copy,
  CheckCircle
} from 'lucide-react';
import { ResearchResponse } from '@/lib/api';
import { reportsAPI } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ResearchResultsViewerProps {
  research: ResearchResponse | null;
  onClose: () => void;
  onBookmarkToggle?: (researchId: string, bookmarked: boolean) => void;
}

export default function ResearchResultsViewer({ 
  research, 
  onClose, 
  onBookmarkToggle 
}: ResearchResultsViewerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!research) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <FileText className="h-16 w-16 mb-4" />
          <p>Select a research report to view results</p>
        </CardContent>
      </Card>
    );
  }

  const handleBookmarkToggle = async () => {
    try {
      const result = await reportsAPI.toggleBookmark(research.id);
      setIsBookmarked(result.bookmarked);
      onBookmarkToggle?.(research.id, result.bookmarked);
      
      toast({
        title: result.bookmarked ? "Report Bookmarked" : "Bookmark Removed",
        description: result.bookmarked 
          ? "Report has been added to your bookmarks" 
          : "Report has been removed from your bookmarks",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'markdown' | 'json') => {
    setIsExporting(true);
    try {
      const blob = await reportsAPI.exportReport(research.id, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `research-${research.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await reportsAPI.shareReport(research.id);
      setShareUrl(result.share_url);
      
      toast({
        title: "Share Link Generated",
        description: "Report share link has been created",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, color: 'bg-green-500' },
      failed: { variant: 'destructive' as const, color: 'bg-red-500' },
      in_progress: { variant: 'secondary' as const, color: 'bg-blue-500' },
      pending: { variant: 'outline' as const, color: 'bg-yellow-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Research Results
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(research.status)}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(research.created_at), 'MMM d, yyyy')}
              </div>
              {research.completed_at && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(research.completed_at), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmarkToggle}
              className="flex items-center gap-1"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="results" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="sources">Sources ({research.sources?.length || 0})</TabsTrigger>
            <TabsTrigger value="export">Export & Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="mt-4">
            <div className="space-y-4">
              {/* Research Query */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Research Query
                </h4>
                <p className="text-sm">{research.query}</p>
              </div>
              
              {/* Research Results */}
              {research.result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Research Report</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(research.result || '')}
                      className="flex items-center gap-1"
                    >
                      {copiedText ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedText ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-96 border rounded-lg p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {research.result.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2" />
                  <p>No results available</p>
                </div>
              )}
              
              {/* Error Display */}
              {research.error && (
                <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Research Error</h4>
                  <p className="text-sm text-destructive/80">{research.error}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-4">
            {research.sources && research.sources.length > 0 ? (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {research.sources.map((source, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm mb-1 line-clamp-2">
                            {source.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                            {source.snippet}
                          </p>
                          <p className="text-xs text-blue-600 truncate">
                            {source.url}
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
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ExternalLink className="h-8 w-8 mb-2" />
                <p>No sources available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <div className="space-y-6">
              {/* Export Options */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('markdown')}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    Markdown
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    JSON
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Share Options */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Report
                </h4>
                
                {shareUrl ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Share this link to give others access to this report:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(shareUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {isSharing ? 'Generating Link...' : 'Generate Share Link'}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
