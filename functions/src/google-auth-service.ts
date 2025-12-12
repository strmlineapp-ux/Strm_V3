
'use server';
import { google } from 'googleapis';
import { getFirestore } from 'firebase-admin/firestore';
import { OAuth2Client, type Credentials } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

/**
 * Creates and configures a Google OAuth2 client.
 * The redirect URI is now dynamically determined based on the environment.
 */
export async function getOAuth2Client(): Promise<OAuth2Client> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth client environment variables are not set.');
  }

  // This is the function URL for the deployed callback.
  // In a more complex setup, this might be dynamically configured.
  const redirectUri = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/googleAuthCallback`;
  
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

/**
 * Saves the user's API credentials securely in Firestore.
 * @param userId The user's unique ID.
 * @param tokens The OAuth2 tokens from Google.
 */
export async function saveCredentials(userId: string, tokens: Credentials): Promise<void> {
  const db = getFirestore();
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

/**
 * Retrieves an authorized OAuth2 client for making API calls on behalf of a user.
 * @param userId The ID of the user.
 * @returns An authorized OAuth2 client.
 * @throws If tokens are not found or invalid, indicating re-authorization is needed.
 */
export async function getAuthorizedClient(userId: string): Promise<OAuth2Client> {
  const db = getFirestore();
  const tokenDocRef = db.collection('google-auth-tokens').doc(userId);
  const tokenDoc = await tokenDocRef.get();

  if (!tokenDoc.exists()) {
    throw new Error(`No auth tokens found for user: ${userId}. User needs to sign in again to grant permissions.`);
  }

  const tokens = tokenDoc.data();
  if (!tokens.access_token) {
    throw new Error(`Stored tokens for user ${userId} are missing an access token. User needs to sign in again.`);
  }

  const oAuth2Client = await getOAuth2Client();
  oAuth2Client.setCredentials(tokens as Credentials);
  
  // Handle token refreshing
  oAuth2Client.on('tokens', async (newTokens) => {
    if (newTokens.refresh_token) {
      // If we get a new refresh token, save it along with the access token
      await saveCredentials(userId, newTokens);
    } else {
      // If we only get a new access token, update just that
      const currentTokens = oAuth2Client.credentials;
      await saveCredentials(userId, { ...currentTokens, access_token: newTokens.access_token });
    }
  });

  // Check if the token is expired and refresh it if necessary
  if (oAuth2Client.isTokenExpiring()) {
    try {
      const { credentials } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(credentials);
      await saveCredentials(userId, credentials);
    } catch (refreshError) {
      console.error(`Failed to refresh token for user ${userId}`, refreshError);
      throw new Error(`Could not refresh authorization for user ${userId}. Please re-authenticate.`);
    }
  }
  
  return oAuth2Client;
}
