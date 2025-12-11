'use server';
/**
 * @fileOverview A flow for generating a Google Meet link for an event using a descriptive title.
 *
 * - generateMeetLink - A function that handles the Google Meet link generation.
 * - GenerateMeetLinkInput - The input type for the generateMeetLink function.
 * - GenerateMeetLinkOutput - The return type for the generateMeetLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMeetLinkInputSchema = z.object({
  eventTitle: z.string().describe('A descriptive title of the event for which a Google Meet link is to be generated.'),
});
export type GenerateMeetLinkInput = z.infer<typeof GenerateMeetLinkInputSchema>;

const GenerateMeetLinkOutputSchema = z.object({
  meetLink: z.string().url().describe('The generated Google Meet link for the event.'),
});
export type GenerateMeetLinkOutput = z.infer<typeof GenerateMeetLinkOutputSchema>;

export async function generateMeetLink(
  input: GenerateMeetLinkInput
): Promise<GenerateMeetLinkOutput> {
  return await generateMeetLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMeetLinkPrompt',
  input: { schema: GenerateMeetLinkInputSchema },
  output: { schema: GenerateMeetLinkOutputSchema },
  prompt: `You are a helpful assistant designed to generate a Google Meet link for a given event title.

  The event title is: {{{eventTitle}}}

  Please generate a valid Google Meet link associated with the event title.
  Ensure that the generated link is a valid URL.
  If you are unable to generate a meet link return a mock link.
  `,
});

const generateMeetLinkFlow = ai.defineFlow(
  {
    name: 'generateMeetLinkFlow',
    inputSchema: GenerateMeetLinkInputSchema,
    outputSchema: GenerateMeetLinkOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (output && output.meetLink) {
        return {
          meetLink: output.meetLink,
        };
      } else {
        console.warn('Failed to generate a valid meet link, returning a mock link.');
        return {
          meetLink: `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`,
        };
      }
    } catch (error) {
      console.error('Error generating meet link:', error);
      // Return a mock meet link in case of errors.
      return {
        meetLink: `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`,
      };
    }
  }
);
