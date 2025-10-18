# **App Name**: Strm Agile

## Core Features:

- Google Sign-In Authentication: Implement Google Sign-In for user authentication with Firebase Authentication, manage the user's account type, isAdmin status, and workspace ID.
- Admin Approval Workflow: Control access via an administrator-approval workflow where new users have 'Viewer' status until approved by an admin to 'Full' status. The very first user becomes an admin.
- On-Demand Data Fetching: Implement decentralized, on-demand data fetching using react-query hooks in src/hooks/use-data-queries.ts. Protect data-fetching hooks with an enabled: !!workspaceId guard.
- Draggable Card Management UI: Implement the Draggable Card Management blueprint for management pages (Pages, Teams, Calendars), using p-2 for header padding and p-2 pt-0 for content.
- Inline Editing: Use the Inline Editor pattern for editing text fields like page titles and entity names directly in the UI.
- Create Meet Link Flow: Generate Google Meet links for events, using a Genkit flow (a 'tool') that leverages the google.calendar API.
- Multi-view Calendar: Display a calendar with Month, Week, Day, and Production Schedule views that sync with Google Calendar.

## Style Guidelines:

- Primary color: Strong Blue (#3498db). A direct but unconventional association with corporate software projects, intended to convey reliability.
- Background color: Very light blue (#E7F5FF). Visibly close in hue to the primary, but desaturated and bright for use as a background in a light scheme.
- Font: Roboto
- Use a modern icon set from Material Symbols components to visually represent different entities and actions.
- Subtle transition animations to enhance user experience when navigating and interacting with the application.