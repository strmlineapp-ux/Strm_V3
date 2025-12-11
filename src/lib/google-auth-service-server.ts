
import { google } from 'googleapis';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import type { Credentials } from 'google-auth-library';

// This file is intended for server-side use only (e.g., in API routes).

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

/**
 * Saves the user's API credentials securely in Firestore using the Admin SDK.
 * This should be called from a server environment (e.g., an API route callback).
 * @param userId The user's unique ID.
 * @param tokens The OAuth2 tokens from Google.
 */
export async function saveCredentials(userId: string, tokens: Credentials): Promise<void> {
  const app = getAdminApp();
  const db = getFirestore(app);
  const tokenDocRef = db.collection('google-auth-tokens').doc(userId);
  
  if (!tokens.access_token) {
    console.warn('Attempted to save credentials without an access token.');
    return;
  }
  
  await tokenDocRef.set({
    userId,
    ...tokens
  }, { merge: true });
}
