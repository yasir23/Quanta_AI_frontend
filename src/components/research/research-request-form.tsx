'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, BookOpen, TrendingUp, Code } from 'lucide-react';
import { ResearchClient } from '@/ai/research-client';
import { ResearchResponse } from '@/lib/api';
import { checkCanMakeRequest, trackRequest } from '@/lib/usage-tracking';

const researchFormSchema = z.object({
  query: z.string().min(10, 'Research query must be at least 10 characters long'),
  research_type: z.enum(['general', 'academic', 'market', 'technical']),
  max_results: z.number().min(5).max(50).default(10),
  include_sources: z.boolean().default(true),
});

type ResearchFormData = z.infer<typeof researchFormSchema>;

interface ResearchRequestFormProps {
  onResearchSubmitted: (research: ResearchResponse) => void;
  isLoading?: boolean;
}

const researchTypes = [
  {
    value: 'general' as const,
    label: 'General Research',
    description: 'Comprehensive research on any topic',
    icon: Search,
    color: 'bg-blue-500',
  },
  {
    value: 'academic' as const,
    label: 'Academic Research',
    description: 'Scholarly articles and academic sources',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    value: 'market' as const,
    label: 'Market Research',
    description: 'Market trends and business intelligence',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
  {
    value: 'technical' as const,
    label: 'Technical Research',
    description: 'Technical documentation and specifications',
    icon: Code,
    color: 'bg-purple-500',
  },
];

export default function ResearchRequestForm({ onResearchSubmitted, isLoading = false }: ResearchRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResearchFormData>({
    resolver: zodResolver(researchFormSchema),
    defaultValues: {
      query: '',
      research_type: 'general',
      max_results: 10,
      include_sources: true,
    },
  });

  const onSubmit = async (data: ResearchFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Check usage limits before submitting research
      const canMakeRequest = await checkCanMakeRequest();
      if (!canMakeRequest) {
        return; // Error toast is shown by checkCanMakeRequest
      }

      const research = await ResearchClient.submitResearch(data.query, {
        research_type: data.research_type,
        max_results: data.max_results,
        include_sources: data.include_sources,
      });

      // Track the request for usage analytics
      await trackRequest();

      onResearchSubmitted(research);
      form.reset();
    } catch (err: any) {
      setError(err.message || 'Failed to submit research request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = researchTypes.find(type => type.value === form.watch('research_type'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          New Research Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Research Query */}
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to research? Be as specific as possible..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your research topic in detail. The more specific you are, the better results you'll get.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Research Type */}
            <FormField
              control={form.control}
              name="research_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select research type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {researchTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${type.color}`} />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {selectedType && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <selectedType.icon className="h-3 w-3" />
                        {selectedType.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedType.description}
                      </span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advanced Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Results</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={50}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of sources to research (5-50)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="include_sources"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include Sources</FormLabel>
                      <FormDescription>
                        Include source citations in the research report
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-destructive font-medium">Research Request Failed</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting Research Request...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Start Research
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


