'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Calendar,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Archive,
  Star
} from "lucide-react";
import { ResearchResponse } from '@/lib/api';
import { reportsAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

// Import report management components
import ReportCard from '@/components/reports/report-card';
import ReportViewer from '@/components/reports/report-viewer';
import ReportFilters from '@/components/reports/report-filters';

type ViewMode = 'grid' | 'list';
type SortBy = 'created_at' | 'completed_at' | 'query' | 'status';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'completed' | 'failed';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ResearchResponse[]>([]);
  const [filteredReports, setFilteredReports] = useState<ResearchResponse[]>([]);
  const [selectedReport, setSelectedReport] = useState<ResearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all-reports');

  // Load reports on component mount
  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  // Filter and sort reports when dependencies change
  useEffect(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(report =>
        report.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.result && report.result.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus);
    }

    // Apply bookmark filter
    if (bookmarkedOnly) {
      filtered = filtered.filter(report => (report as any).bookmarked === true);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'completed_at':
          aValue = a.completed_at ? new Date(a.completed_at) : new Date(0);
          bValue = b.completed_at ? new Date(b.completed_at) : new Date(0);
          break;
        case 'query':
          aValue = a.query.toLowerCase();
          bValue = b.query.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
  }, [reports, searchQuery, filterStatus, bookmarkedOnly, sortBy, sortOrder]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const reportsData = await reportsAPI.getReports(100); // Get last 100 reports
      setReports(reportsData);
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        const searchResults = await reportsAPI.searchReports(query, 50);
        setFilteredReports(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        // Fall back to local filtering
        setSearchQuery(query);
      }
    } else {
      setSearchQuery(query);
    }
  };

  const handleBookmarkToggle = async (reportId: string) => {
    try {
      const result = await reportsAPI.toggleBookmark(reportId);
      
      // Update the report in the list
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, bookmarked: result.bookmarked } as any
            : report
        )
      );

      toast({
        title: result.bookmarked ? "Report Bookmarked" : "Bookmark Removed",
        description: result.bookmarked 
          ? "Report has been added to your bookmarks" 
          : "Report has been removed from your bookmarks",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (reportId: string, format: 'pdf' | 'markdown' | 'json') => {
    try {
      const blob = await reportsAPI.exportReport(reportId, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `report-${reportId}.${format}`;
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
    }
  };

  const handleShare = async (reportId: string) => {
    try {
      const result = await reportsAPI.shareReport(reportId);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(result.share_url);
      
      toast({
        title: "Share Link Copied",
        description: "Report share link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    }
  };

  const getReportCounts = () => {
    const completed = reports.filter(r => r.status === 'completed').length;
    const failed = reports.filter(r => r.status === 'failed').length;
    const bookmarked = reports.filter(r => (r as any).bookmarked === true).length;
    
    return { total: reports.length, completed, failed, bookmarked };
  };

  const counts = getReportCounts();

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please sign in to access your reports</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Reports</h1>
          <p className="text-muted-foreground">
            Manage, organize, and export your research reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {counts.total} Total
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {counts.bookmarked} Bookmarked
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadReports}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by query or content..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created</SelectItem>
                  <SelectItem value="completed_at">Completed</SelectItem>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
              </Button>

              <Button
                variant={bookmarkedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className="flex items-center gap-1"
              >
                <Bookmark className="h-3 w-3" />
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All Reports ({filteredReports.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarked ({counts.bookmarked})
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Report Viewer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredReports.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-3"
            }>
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  viewMode={viewMode}
                  onView={() => {
                    setSelectedReport(report);
                    setActiveTab('viewer');
                  }}
                  onBookmark={() => handleBookmarkToggle(report.id)}
                  onExport={(format) => handleExport(report.id, format)}
                  onShare={() => handleShare(report.id)}
                  isBookmarked={(report as any).bookmarked || false}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">No reports found</p>
                <p className="text-sm">
                  {searchQuery || filterStatus !== 'all' || bookmarkedOnly
                    ? "Try adjusting your search or filters"
                    : "Complete some research to see reports here"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4">
          {(() => {
            const bookmarkedReports = filteredReports.filter(r => (r as any).bookmarked === true);
            return bookmarkedReports.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-3"
              }>
                {bookmarkedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    viewMode={viewMode}
                    onView={() => {
                      setSelectedReport(report);
                      setActiveTab('viewer');
                    }}
                    onBookmark={() => handleBookmarkToggle(report.id)}
                    onExport={(format) => handleExport(report.id, format)}
                    onShare={() => handleShare(report.id)}
                    isBookmarked={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Bookmark className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">No bookmarked reports</p>
                  <p className="text-sm">Bookmark reports to access them quickly</p>
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          <ReportViewer
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onBookmarkToggle={handleBookmarkToggle}
            onExport={handleExport}
            onShare={handleShare}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

