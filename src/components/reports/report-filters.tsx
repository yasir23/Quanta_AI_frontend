'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  Calendar, 
  Search, 
  SortAsc, 
  SortDesc,
  Bookmark,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
// import { DatePickerWithRange } from '@/components/ui/date-range-picker';
// import { DateRange } from 'react-day-picker';

export interface ReportFilters {
  search: string;
  status: 'all' | 'completed' | 'failed' | 'in_progress' | 'pending';
  dateRange: DateRange | undefined;
  bookmarkedOnly: boolean;
  sortBy: 'created_at' | 'completed_at' | 'query' | 'status';
  sortOrder: 'asc' | 'desc';
  minSources: number;
  maxSources: number;
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onReset: () => void;
  totalReports: number;
  filteredCount: number;
}

const statusOptions = [
  { value: 'all', label: 'All Status', icon: null, count: 0 },
  { value: 'completed', label: 'Completed', icon: CheckCircle, count: 0 },
  { value: 'failed', label: 'Failed', icon: XCircle, count: 0 },
  { value: 'in_progress', label: 'In Progress', icon: Loader2, count: 0 },
  { value: 'pending', label: 'Pending', icon: Clock, count: 0 },
];

const sortOptions = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'completed_at', label: 'Completed Date' },
  { value: 'query', label: 'Query (A-Z)' },
  { value: 'status', label: 'Status' },
];

export default function ReportFilters({
  filters,
  onFiltersChange,
  onReset,
  totalReports,
  filteredCount,
}: ReportFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof ReportFilters>(
    key: K,
    value: ReportFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.dateRange !== undefined ||
      filters.bookmarkedOnly ||
      filters.minSources > 0 ||
      filters.maxSources < 100
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== undefined) count++;
    if (filters.bookmarkedOnly) count++;
    if (filters.minSources > 0 || filters.maxSources < 100) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {totalReports} reports
          </span>
          {hasActiveFilters() && (
            <Badge variant="outline" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Reports</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by query or content..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.status === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('status', filters.status === 'completed' ? 'all' : 'completed')}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Button>
          
          <Button
            variant={filters.bookmarkedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('bookmarkedOnly', !filters.bookmarkedOnly)}
            className="flex items-center gap-1"
          >
            <Bookmark className="h-3 w-3" />
            Bookmarked
          </Button>
          
          <Button
            variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1"
          >
            {filters.sortOrder === 'desc' ? (
              <SortDesc className="h-3 w-3" />
            ) : (
              <SortAsc className="h-3 w-3" />
            )}
            {filters.sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </Button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value: any) => updateFilter('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-3 w-3" />}
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) => updateFilter('dateRange', dateRange)}
              />
            </div>

            {/* Source Count Range */}
            <div className="space-y-2">
              <Label>Number of Sources</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="minSources" className="text-xs">Minimum</Label>
                  <Input
                    id="minSources"
                    type="number"
                    min={0}
                    max={100}
                    value={filters.minSources}
                    onChange={(e) => updateFilter('minSources', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxSources" className="text-xs">Maximum</Label>
                  <Input
                    id="maxSources"
                    type="number"
                    min={0}
                    max={100}
                    value={filters.maxSources === 100 ? '' : filters.maxSources}
                    onChange={(e) => updateFilter('maxSources', parseInt(e.target.value) || 100)}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3">
              <Label>Advanced Options</Label>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Bookmarked Only</Label>
                  <p className="text-xs text-muted-foreground">
                    Show only bookmarked reports
                  </p>
                </div>
                <Switch
                  checked={filters.bookmarkedOnly}
                  onCheckedChange={(checked) => updateFilter('bookmarkedOnly', checked)}
                />
              </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters() && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Active Filters</Label>
                  <div className="flex flex-wrap gap-1">
                    {filters.search && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{filters.search}"
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateFilter('search', '')}
                        />
                      </Badge>
                    )}
                    {filters.status !== 'all' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Status: {filters.status}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateFilter('status', 'all')}
                        />
                      </Badge>
                    )}
                    {filters.bookmarkedOnly && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Bookmarked
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateFilter('bookmarkedOnly', false)}
                        />
                      </Badge>
                    )}
                    {filters.dateRange && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Date Range
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateFilter('dateRange', undefined)}
                        />
                      </Badge>
                    )}
                    {(filters.minSources > 0 || filters.maxSources < 100) && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Sources: {filters.minSources}-{filters.maxSources}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => {
                            updateFilter('minSources', 0);
                            updateFilter('maxSources', 100);
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

