'use server';
/**
 * @fileOverview An AI agent that explains a given trend.
 *
 * - explainTrend - A function that handles the trend explanation process.
 * - ExplainTrendInput - The input type for the explainTrend function.
 * - ExplainTrendOutput - The return type for the explainTrend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTrendInputSchema = z.object({
  trend: z.string().describe('The trend to explain.'),
});
export type ExplainTrendInput = z.infer<typeof ExplainTrendInputSchema>;

const ExplainTrendOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the trend.'),
});
export type ExplainTrendOutput = z.infer<typeof ExplainTrendOutputSchema>;

export async function explainTrend(input: ExplainTrendInput): Promise<ExplainTrendOutput> {
  return explainTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTrendPrompt',
  input: {schema: ExplainTrendInputSchema},
  output: {schema: ExplainTrendOutputSchema},
  prompt: `You are an expert trend analyst. Please explain the following trend in a concise and informative manner:

Trend: {{{trend}}}`,
});

const explainTrendFlow = ai.defineFlow(
  {
    name: 'explainTrendFlow',
    inputSchema: ExplainTrendInputSchema,
    outputSchema: ExplainTrendOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
