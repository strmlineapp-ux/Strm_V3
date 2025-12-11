import { config } from 'dotenv';
config();

import '@/ai/flows/create-meet-link-flow.ts';
import '@/ai/flows/link-and-watch-calendar-flow.ts';
import '@/ai/flows/sync-calendar-flow.ts';
import '@/ai/flows/watch-google-calendar-flow.ts';
import '@/ai/flows/generate-google-meet-link.ts';