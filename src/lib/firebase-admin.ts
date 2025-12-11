
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // For local development, it can use GOOGLE_APPLICATION_CREDENTIALS
    // or infer credentials from the environment.
    admin.initializeApp();
  }
}

export const getAdminApp = () => {
  return admin.app();
};
