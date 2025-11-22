'use server';

/**
 * @fileOverview An AI agent for optimizing ad placements based on user behavior and revenue potential.
 *
 * - optimizeAdPlacement - A function that handles the ad placement optimization process.
 * - OptimizeAdPlacementInput - The input type for the optimizeAdPlacement function.
 * - OptimizeAdPlacementOutput - The return type for the optimizeAdPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeAdPlacementInputSchema = z.object({
  pageType: z
    .string()
    .describe(
      'The type of page where ads are to be placed (e.g., Home, Grand Prix, Streaming)'
    ),
  userEngagementMetrics: z
    .string()
    .describe(
      'JSON string of user engagement metrics (e.g., time on page, click-through rates, ad interactions)'
    ),
  adRevenueData: z
    .string()
    .describe(
      'JSON string of ad revenue data for different placements (e.g., CPM, CPV, banner revenue)'
    ),
  currentAdPlacement: z
    .string()
    .describe(
      'JSON string describing the current ad placements on the page (e.g., ad type, location, size)'
    ),
});
export type OptimizeAdPlacementInput = z.infer<typeof OptimizeAdPlacementInputSchema>;

const OptimizeAdPlacementOutputSchema = z.object({
  optimizedAdPlacement: z
    .string()
    .describe(
      'JSON string describing the optimized ad placements, including ad types and locations'
    ),
  explanation: z
    .string()
    .describe('Explanation of why the ad placements were optimized in this way'),
});
export type OptimizeAdPlacementOutput = z.infer<typeof OptimizeAdPlacementOutputSchema>;

export async function optimizeAdPlacement(
  input: OptimizeAdPlacementInput
): Promise<OptimizeAdPlacementOutput> {
  return optimizeAdPlacementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeAdPlacementPrompt',
  input: {schema: OptimizeAdPlacementInputSchema},
  output: {schema: OptimizeAdPlacementOutputSchema},
  prompt: `You are an expert in optimizing ad placements for web applications. Given the page type, user engagement metrics, ad revenue data, and current ad placements, determine the optimal ad placements to maximize revenue without negatively impacting user experience.

Page Type: {{{pageType}}}
User Engagement Metrics: {{{userEngagementMetrics}}}
Ad Revenue Data: {{{adRevenueData}}}
Current Ad Placement: {{{currentAdPlacement}}}

Consider the following:
- User engagement (time on page, click-through rates).
- Ad revenue potential (CPM, CPV).
- Ad formats (banner, display, pre-roll, interstitial).
- User experience (avoiding intrusive ads).

Provide the optimized ad placements in JSON format, including the ad types and their locations on the page, and include a detailed explanation of your reasoning.

Output the results in the following JSON format:
{
  "optimizedAdPlacement": {},
  "explanation": ""
}
`,
});

const optimizeAdPlacementFlow = ai.defineFlow(
  {
    name: 'optimizeAdPlacementFlow',
    inputSchema: OptimizeAdPlacementInputSchema,
    outputSchema: OptimizeAdPlacementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
