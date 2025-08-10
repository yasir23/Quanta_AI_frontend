'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResearchResponse } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';

interface ReportCardProps {
  report: ResearchResponse;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onBookmark: () => void;
  onExport: (format: 'pdf' | 'markdown' | 'json') => void;
  onShare: () => void;
  isBookmarked: boolean;
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    variant: 'default' as const,
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    variant: 'destructive' as const,
    label: 'Failed',
  },
  in_progress: {
    icon: Loader2,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    variant: 'secondary' as const,
    label: 'In Progress',
  },
  pending: {
    icon: Clock,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    variant: 'outline' as const,
    label: 'Pending',
  },
};

export default function ReportCard({
  report,
  viewMode,
  onView,
  onBookmark,
  onExport,
  onShare,
  isBookmarked,
}: ReportCardProps) {
  const config = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={config.variant} className="flex items-center gap-1">
                  <Icon className={`h-3 w-3 ${report.status === 'in_progress' ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
                {isBookmarked && (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                )}
              </div>
              
              <h3 
                className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary cursor-pointer"
                onClick={onView}
              >
                {report.query}
              </h3>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(report.created_at), 'MMM d, yyyy')}
                </div>
                {report.completed_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(report.completed_at), { addSuffix: true })}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {report.sources?.length || 0} sources
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onView}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onBookmark}>
                    {isBookmarked ? (
                      <>
                        <Bookmark className="h-3 w-3 mr-2" />
                        Remove Bookmark
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="h-3 w-3 mr-2" />
                        Bookmark
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShare}>
                    <Share2 className="h-3 w-3 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('pdf')}>
                    <Download className="h-3 w-3 mr-2" />
                    Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('markdown')}>
                    <Download className="h-3 w-3 mr-2" />
                    Export Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport('json')}>
                    <Download className="h-3 w-3 mr-2" />
                    Export JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="flex items-center gap-1">
              <Icon className={`h-3 w-3 ${report.status === 'in_progress' ? 'animate-spin' : ''}`} />
              {config.label}
            </Badge>
            {isBookmarked && (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBookmark}>
                {isBookmarked ? (
                  <>
                    <Bookmark className="h-3 w-3 mr-2" />
                    Remove Bookmark
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="h-3 w-3 mr-2" />
                    Bookmark
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-3 w-3 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')}>
                <Download className="h-3 w-3 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('markdown')}>
                <Download className="h-3 w-3 mr-2" />
                Export Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                <Download className="h-3 w-3 mr-2" />
                Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle 
          className="text-sm line-clamp-3 hover:text-primary cursor-pointer"
          onClick={onView}
        >
          {report.query}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Report Preview */}
          {report.result && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {report.result.substring(0, 150)}...
              </p>
            </div>
          )}
          
          {/* Error Display */}
          {report.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 line-clamp-2">
                <strong>Error:</strong> {report.error}
              </p>
            </div>
          )}
          
          {/* Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(report.created_at), 'MMM d')}
              </div>
              {report.completed_at && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(report.completed_at), { addSuffix: true })}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                {report.sources?.length || 0} sources
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onView}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
