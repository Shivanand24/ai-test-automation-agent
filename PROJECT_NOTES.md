# AI Test Automation Agent - Project Notes

This file serves as a long-term memory bank to keep track of important decisions, project state, and reminders across different chat sessions.

## Important Reminders
- **PENDING:** When the project is marked as "complete" or near production, ask the user if they want to increase the limits in `app/api/generate-test-case/route.ts` (currently limited to 5 files, 500 chars, 5 test cases, and 1000 max_tokens) to properly support large GitHub repositories.

## Current State
- Set up `WorkspaceHeader` properly in `app/page.tsx` so the user avatar (UserButton) aligns to the top right.
- Removed the test layout heading.
- Refined the `generate-test-case` API to ensure the AI generates robust JSON output, preventing parsing crashes.
