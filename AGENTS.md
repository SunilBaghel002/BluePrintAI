# Blueprint — Agent Entry Point

Read this file first. Then read every file listed under
Required Context before writing a single line of code.

## Project

Blueprint is an AI-powered collaborative system design platform.
Developers describe their SaaS architecture in plain language and
Blueprint generates a full visual system diagram on an interactive
canvas. Teams can collaborate on the canvas in real time, start
from curated templates, or build manually.

## Required Context

Read all six of these files before doing anything:

1. `context/project-overview.md` — What we are building, the core
   user flow, feature scope, and success criteria. This is the
   product specification.

2. `context/architecture.md` — The full technology stack, system
   boundaries, storage model, auth model, and invariants. This is
   the architectural law. Violations are not acceptable.

3. `context/code-standards.md` — TypeScript conventions, Next.js
   patterns, API route structure, styling rules, and file
   organization. All code must conform to this document.

4. `context/ai-workflow-rules.md` — How to work: scoping rules,
   when to split work, how to handle missing requirements, and
   what done looks like. Follow these rules exactly.

5. `context/ui-context.md` — Color tokens, typography, spacing,
   component library conventions, layout patterns, and icon usage.
   Never make a visual decision that is not defined here.

6. `context/progress-tracker.md` — Current build phase, what is
   complete, what is in progress, what is next, and open questions.
   This is your starting point for every session.

## How to Resume a Session

1. Read `context/progress-tracker.md`
2. Identify the current unit under In Progress or Next Up
3. Read the done criteria for that unit in `project-overview.md`
4. Implement only that unit
5. Update `progress-tracker.md` when the unit is complete

## Non-Negotiable Rules

These rules apply in every session without exception:

- Never write a line of implementation code before reading all
  six context files.
- Never work on more than one feature unit at a time.
- Never make a visual decision not defined in `ui-context.md`.
- Never call OpenAI from an API route handler. All AI calls
  go through Trigger.dev jobs in `trigger/`.
- Never write database queries in components. All database
  access goes through `lib/db/` helpers.
- Never store canvas data in PostgreSQL. Canvas state lives
  in Liveblocks only.
- Never modify `components/ui/*` manually. Use the shadcn CLI.
- Never use `any` as a TypeScript type.
- Never validate external input without Zod.
- Never leave `npm run build` in a failing state.
- If a requirement is missing or ambiguous, add it to Open
  Questions in `progress-tracker.md` and stop. Do not guess.

## Tech Stack Quick Reference

| What             | Technology                  |
| ---------------- | --------------------------- |
| Framework        | Next.js 14+ App Router      |
| Language         | TypeScript strict mode      |
| Styling          | Tailwind CSS + CSS variables|
| Components       | shadcn/ui                   |
| Auth             | Clerk                       |
| Real-time canvas | Liveblocks                  |
| Canvas render    | React Flow                  |
| AI               | OpenAI GPT-4o               |
| Background jobs  | Trigger.dev                 |
| Database         | PostgreSQL via Aiven        |
| ORM              | Drizzle ORM                 |
| File storage     | Vercel Blob                 |
| Validation       | Zod                         |
| UI state         | Zustand                     |
| Icons            | Lucide React                |
| Fonts            | Geist Sans + Geist Mono     |
| Deployment       | Vercel                      |

## Build Order

Follow this order strictly. Do not skip ahead.

| Phase | Unit | Description                              |
| ----- | ---- | ---------------------------------------- |
| 1     | 1    | Project foundation and authentication    |
| 1     | 2    | Dashboard                                |
| 2     | 3    | Canvas foundation with Liveblocks        |
| 2     | 4    | Canvas nodes and edges                   |
| 2     | 5    | Left panel and toolbar                   |
| 2     | 6    | Right panel and properties               |
| 3     | 7    | Real-time collaboration                  |
| 4     | 8    | Starter templates                        |
| 5     | 9    | AI architecture generation               |
| 6     | 10   | Export to PNG and JSON                   |

## Environment Variables Required

The following variables must be present in `.env.local`.
The app will refuse to start if any are missing.

Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

OpenAI
OPENAI_API_KEY=

Trigger.dev
TRIGGER_SECRET_KEY=

Database — Aiven PostgreSQL
DATABASE_URL=

Vercel Blob
BLOB_READ_WRITE_TOKEN=


## Definition of Done

A unit is done when all of the following are true:

1. The feature works end to end within its defined scope
2. No invariant in `context/architecture.md` was violated
3. TypeScript strict mode passes with zero errors
4. `npm run build` passes with zero errors
5. All external inputs are validated with Zod
6. All new API routes enforce Clerk auth as the first operation
7. `context/progress-tracker.md` is updated
8. No file outside the current unit's scope was modified