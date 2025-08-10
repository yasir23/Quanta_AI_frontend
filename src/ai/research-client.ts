/**
 * @fileOverview Research client that connects to the LangGraph Deep Researcher backend
 * 
 * This replaces the previous Genkit AI setup with direct integration to the
 * LangGraph multi-agent research system running on the backend.
 */

import { researchAPI, ResearchRequest, ResearchResponse } from '@/lib/api';

export interface TrendExplanationRequest {
  trend: string;
  context?: string;
}

export interface TrendExplanationResponse {
  explanation: string;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export interface ResearchProgressCallback {
  (status: 'pending' | 'in_progress' | 'completed' | 'failed', progress?: number): void;
}

/**
 * Research client for interacting with the LangGraph Deep Researcher
 */
export class ResearchClient {
  /**
   * Explain a trend using the LangGraph research system
   */
  static async explainTrend(
    request: TrendExplanationRequest,
    onProgress?: ResearchProgressCallback
  ): Promise<TrendExplanationResponse> {
    try {
      // Create a research request for trend explanation
      const researchRequest: ResearchRequest = {
        query: `Explain the trend: ${request.trend}${request.context ? `. Context: ${request.context}` : ''}`,
        research_type: 'general',
        max_results: 5,
        include_sources: true,
      };

      // Submit the research request
      onProgress?.('pending');
      const researchResponse = await researchAPI.submitResearch(researchRequest);
      
      // Poll for completion
      let currentResponse = researchResponse;
      const maxAttempts = 60; // 5 minutes with 5-second intervals
      let attempts = 0;

      while (currentResponse.status !== 'completed' && currentResponse.status !== 'failed' && attempts < maxAttempts) {
        onProgress?.(currentResponse.status, (attempts / maxAttempts) * 100);
        
        // Wait 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check status
        currentResponse = await researchAPI.getResearchStatus(currentResponse.id);
        attempts++;
      }

      if (currentResponse.status === 'failed') {
        throw new Error(currentResponse.error || 'Research request failed');
      }

      if (currentResponse.status !== 'completed') {
        throw new Error('Research request timed out');
      }

      onProgress?.('completed', 100);

      return {
        explanation: currentResponse.result || 'No explanation available',
        sources: currentResponse.sources,
      };
    } catch (error) {
      onProgress?.('failed');
      throw error;
    }
  }

  /**
   * Submit a general research query
   */
  static async submitResearch(
    query: string,
    options: {
      research_type?: 'general' | 'academic' | 'market' | 'technical';
      max_results?: number;
      include_sources?: boolean;
    } = {}
  ): Promise<ResearchResponse> {
    const researchRequest: ResearchRequest = {
      query,
      research_type: options.research_type || 'general',
      max_results: options.max_results || 10,
      include_sources: options.include_sources !== false,
    };

    return await researchAPI.submitResearch(researchRequest);
  }

  /**
   * Get research status and results
   */
  static async getResearchStatus(researchId: string): Promise<ResearchResponse> {
    return await researchAPI.getResearchStatus(researchId);
  }

  /**
   * Get research history for the current user
   */
  static async getResearchHistory(limit?: number, offset?: number): Promise<ResearchResponse[]> {
    return await researchAPI.getResearchHistory(limit, offset);
  }

  /**
   * Cancel a research request
   */
  static async cancelResearch(researchId: string): Promise<void> {
    return await researchAPI.cancelResearch(researchId);
  }

  /**
   * Poll for research completion with progress updates
   */
  static async pollForCompletion(
    researchId: string,
    onProgress?: ResearchProgressCallback,
    maxAttempts: number = 60
  ): Promise<ResearchResponse> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await this.getResearchStatus(researchId);
      
      onProgress?.(response.status, (attempts / maxAttempts) * 100);
      
      if (response.status === 'completed' || response.status === 'failed') {
        return response;
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
    
    throw new Error('Research request timed out');
  }
}

// Legacy compatibility - export the main function for trend explanation
export async function explainTrend(input: { trend: string }): Promise<{ explanation: string }> {
  const result = await ResearchClient.explainTrend({ trend: input.trend });
  return { explanation: result.explanation };
}

export default ResearchClient;
