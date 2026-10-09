# AgileFlow

An agile task and calendar management application built with Next.js, Firebase, and Genkit.

## Local Setup

Once you have downloaded the project, follow these steps to run it locally:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Firebase:**
    - Create a `.env.local` file in the root directory.
    - Add your Firebase project configuration details (found in `src/lib/firebase-config.ts` or your Firebase Console):
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
      ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Architecture Note: On-Demand Data Fetching

This application uses a highly scalable data-fetching model. To ensure performance and cost-effectiveness:
-   **Minimal Initial Load:** Only the user profile and core app settings are loaded at startup.
-   **Context-Aware Fetching:** Components (like Teams, Calendars, and Projects) are responsible for fetching their own data when they mount. 
-   **Direct Firestore Interaction:** The app communicates directly with Firestore using the client-side SDK, with security enforced via `firestore.rules`.

## Backend Services

Server-side logic is located in the `functions/` directory and is designed to run as Firebase Cloud Functions. These handle automated tasks like:
-   Sending invitation emails.
-   Processing Google Calendar webhooks for real-time synchronization.
-   Admin notification for new user access requests.
