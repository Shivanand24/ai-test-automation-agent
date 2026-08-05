# AI Test Automation Agent - Project Notes

This file serves as a long-term memory bank to keep track of important decisions, project state, and reminders across different chat sessions.

## Important Reminders
- **COMPLETED (API Limit Increase):** Increased production limits in `app/api/generate-test-case/route.ts` to 10 files, 1500 chars per file, 8 test cases, and 2500 max_tokens.
- **PENDING 1 (Unique Market Features):** Implement key differentiators like GitHub Action PR bot integrations, auto-fixing test generators, and AI visual regression diffs.
- **PENDING 2 (Landing Page & Auth):** Generate a high-converting landing page and link it seamlessly to Clerk Sign In / Sign Up pages.

## Current State
- Set up `WorkspaceHeader` properly in `app/page.tsx` so the user avatar (UserButton) aligns to the top right.
- Removed the test layout heading.
- Refined the `generate-test-case` API to ensure the AI generates robust JSON output, preventing parsing crashes.
- Upgraded `generate-test-case` route to production limits (10 files, 1500 chars, 8 tests, 2500 max_tokens).



