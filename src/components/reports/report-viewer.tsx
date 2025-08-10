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
  CheckCircle,
  X,
  ArrowLeft
} from 'lucide-react';
import { ResearchResponse } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ReportViewerProps {
  report: ResearchResponse | null;
  onClose: () => void;
  onBookmarkToggle: (reportId: string) => void;
  onExport: (reportId: string, format: 'pdf' | 'markdown' | 'json') => void;
  onShare: (reportId: string) => void;
}

export default function ReportViewer({ 
  report, 
  onClose, 
  onBookmarkToggle,
  onExport,
  onShare
}: ReportViewerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  if (!report) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <FileText className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">No report selected</p>
          <p className="text-sm">Select a report from the list to view its details</p>
        </CardContent>
      </Card>
    );
  }

  const handleBookmarkToggle = () => {
    onBookmarkToggle(report.id);
    setIsBookmarked(!isBookmarked);
  };

  const handleExport = (format: 'pdf' | 'markdown' | 'json') => {
    onExport(report.id, format);
  };

  const handleShare = async () => {
    try {
      onShare(report.id);
      // Simulate getting share URL (this would come from the parent component)
      const mockShareUrl = `${window.location.origin}/shared/report/${report.id}`;
      setShareUrl(mockShareUrl);
    } catch (error) {
      console.error('Share failed:', error);
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
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </Button>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Research Report
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(report.status)}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(report.created_at), 'MMM d, yyyy')}
              </div>
              {report.completed_at && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(report.completed_at), { addSuffix: true })}
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
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sources">Sources ({report.sources?.length || 0})</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-4 space-y-4">
            {/* Research Query */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Research Query
              </h4>
              <p className="text-sm">{report.query}</p>
            </div>
            
            {/* Research Results */}
            {report.result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Research Report</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyToClipboard(report.result || '')}
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
                    {report.result.split('\n').map((paragraph, index) => (
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
                <p>No content available</p>
              </div>
            )}
            
            {/* Error Display */}
            {report.error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <h4 className="font-semibold text-destructive mb-2">Research Error</h4>
                <p className="text-sm text-destructive/80">{report.error}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sources" className="mt-4">
            {report.sources && report.sources.length > 0 ? (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {report.sources.map((source, index) => (
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
          
          <TabsContent value="actions" className="mt-4">
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
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('markdown')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    Markdown
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('json')}
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
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Generate Share Link
                  </Button>
                )}
              </div>
              
              <Separator />
              
              {/* Bookmark Options */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmark Management
                </h4>
                
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={handleBookmarkToggle}
                  className="flex items-center gap-2"
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      Remove from Bookmarks
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Add to Bookmarks
                    </>
                  )}
                </Button>
              </div>
              
              <Separator />
              
              {/* Report Metadata */}
              <div className="space-y-4">
                <h4 className="font-semibold">Report Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Report ID:</span>
                    <span className="font-mono text-xs">{report.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(report.created_at), 'PPP')}</span>
                  </div>
                  {report.completed_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span>{format(new Date(report.completed_at), 'PPP')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{report.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sources:</span>
                    <span>{report.sources?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
