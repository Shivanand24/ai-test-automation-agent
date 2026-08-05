# AI Test Automation Agent - Project Notes

This file serves as a long-term memory bank to keep track of important decisions, project state, and reminders across different chat sessions.

## Important Reminders
- **PENDING 1 (API Limit Increase):** Increase limits in `app/api/generate-test-case/route.ts` (currently limited to 5 files, 500 chars, 5 test cases, and 1000 max_tokens) for production repos.
- **PENDING 2 (Unique Market Features):** Implement key differentiators like GitHub Action PR bot integrations, auto-fixing test generators, and AI visual regression diffs.
- **PENDING 3 (Landing Page & Auth):** Generate a high-converting landing page and link it seamlessly to Clerk Sign In / Sign Up pages.

## Current State
- Set up `WorkspaceHeader` properly in `app/page.tsx` so the user avatar (UserButton) aligns to the top right.
- Removed the test layout heading.
- Refined the `generate-test-case` API to ensure the AI generates robust JSON output, preventing parsing crashes.
