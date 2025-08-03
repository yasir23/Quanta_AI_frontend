'use server';
/**
 * @fileOverview A flow for interacting with the Deep Research Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MessageLikeRepresentation} from 'genkit/model';

const ResearchAgentInputSchema = z.object({
  messages: z.array(z.any()),
});
export type ResearchAgentInput = z.infer<typeof ResearchAgentInputSchema>;

const ResearchAgentOutputSchema = z.object({
  messages: z.array(z.any()),
  final_report: z.string().optional(),
});
export type ResearchAgentOutput = z.infer<typeof ResearchAgentOutputSchema>;

const deepResearcher = ai.flow(
  {
    name: 'deepResearcher',
    inputSchema: ResearchAgentInputSchema,
    outputSchema: ResearchAgentOutputSchema,
  },
  async (input: {messages: MessageLikeRepresentation[]}) => {
    console.log('Invoking deep researcher with messages:', input.messages);

    const langgraphUrl =
      process.env.LANGGRAPH_URL || 'http://127.0.0.1:2024';

    const threadId = Math.random().toString(36).substring(7);

    const response = await fetch(
      `${langgraphUrl}/threads/${threadId}/invoke`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {messages: input.messages},
          config: {
            configurable: {
              search_api: 'tavily',
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LangGraph invocation failed:', errorText);
      throw new Error(`LangGraph invocation failed: ${errorText}`);
    }

    const result = await response.json();
    console.log('Received from deep researcher:', result);
    return result.output;
  }
);

export async function researchAgent(
  input: ResearchAgentInput
): Promise<ResearchAgentOutput> {
  return await deepResearcher.invoke(input);
}
