# AI Client Inquiry Automation Hub

A frontend-only demo that shows a complete AI-style automation workflow for
freelancers and small design/creative businesses — without any paid API.

## Problem

Freelancers and small agencies receive client inquiries by message but have
no system to automatically understand, categorize, prioritize, reply to, and
follow up on them.

## Solution

This app simulates an AI intake assistant: when a client inquiry is
submitted, a rule-based "AI" service analyzes the message, extracts key
details, classifies it, assigns a priority, generates a reply, creates a
lead, and schedules a follow-up — all automatically, all running in the
browser with local JavaScript logic.

## The workflow (all of it actually runs)

```
Client Inquiry → AI Analysis → Information Extraction → Category Detection
→ Priority Detection → Lead Creation → AI Reply Generation
→ Follow-up Task Creation → Automation History → Dashboard Statistics Update
```

## Features

- **Dashboard** — live stats (Total Inquiries, New Leads, High Priority
  Leads, Pending Follow-ups, Completed Automations), category and priority
  charts, recent inquiries, recent automation activity — all computed from
  real stored data.
- **Inquiry Inbox** — search, filter by priority/category, view, delete.
- **New Inquiry** — a real form → a short AI-processing animation → a result
  screen with extracted information and a reply you can copy, edit,
  regenerate, or save.
- **AI simulation** (`services/aiService.js`) — classifies the inquiry into
  a category, detects priority from urgency keywords and deadline, extracts
  business/requirements/deadline/budget with keyword and regex matching, and
  generates a reply that genuinely reflects each inquiry's content (not one
  fixed template).
- **Automation engine** (`services/automationService.js`) — runs the full
  pipeline (`processInquiry()`) and applies real automation rules: high/
  urgent priority gets an urgent follow-up; detected category sets the
  service; urgency keywords escalate priority; a successfully analyzed
  inquiry automatically creates a lead and a reply.
- **Leads page** — search, filter, status changes (New → Contacted →
  Follow-up → Qualified → Converted → Closed), delete.
- **Follow-ups page** — due dates, priority, "Mark as Completed" (which
  updates the dashboard and logs a history event).
- **Automation page** — a visual workflow diagram, the automation rules in
  plain language, a clearly-labeled **Simulated Webhook** button, and the
  full automation history timeline.
- **Inquiry Details page** — original message, AI analysis, generated
  reply, linked lead, linked follow-up, and that inquiry's automation
  history, all on one page.
- **Settings** — Demo AI Mode (always on), Automation Enabled toggle,
  default follow-up period, default priority, and a "clear all data" option.
- Demo data (4 realistic inquiries) is run through the **real** automation
  pipeline once on first load, so the app opens with genuinely generated
  leads/follow-ups/history rather than hard-coded numbers.
- Responsive layout; sidebar collapses to a mobile menu.
- An error boundary and safe LocalStorage fallbacks keep the app from
  crashing on bad or missing data.

## Technology stack

React 18, Vite, Tailwind CSS, React Router (HashRouter), lucide-react,
recharts, browser LocalStorage. No backend, no database, no paid API.

## Project structure

```
src/
├── components/
│   ├── layout/        Sidebar, Topbar, DashboardLayout
│   ├── ui/             Modal, ConfirmDialog, EmptyState, badges
│   └── inquiries/       ProcessingAnimation
├── pages/              Dashboard, Inquiries, NewInquiry, InquiryDetails,
│                       Leads, FollowUps, Automation, Settings
├── services/
│   ├── aiService.js          rule-based analysis (no external API)
│   ├── automationService.js  orchestrates the full pipeline + rules
│   ├── storageService.js     all LocalStorage reads/writes
│   └── seedService.js        seeds demo data once via the real pipeline
├── data/demoData.js    4 demo inquiries
├── App.jsx, main.jsx, index.css
```

## How the AI simulation works

`aiService.js` never calls an external API. `classifyInquiry()` matches
keywords (e.g. "logo", "instagram", "ui/ux") to a category.
`detectPriority()` scans for urgency words (urgent, ASAP, today, tomorrow…)
and the extracted deadline. `extractRequirements()` uses regex to pull out a
business name, itemized requirements (e.g. "10 Instagram posts"), a
deadline, and a budget. `generateReply()` builds a reply from the actual
extracted fields, so two different inquiries produce two different replies.
The functions are written so a real LLM API could later replace the body of
`analyzeInquiry()`/`generateReply()` without any UI changes.

## How the automation works

`automationService.processInquiry()` runs the whole pipeline in order:
save inquiry → analyze → log history events → (if automation is enabled)
generate reply → create lead → create follow-up task (urgent tasks get an
urgent due date per Automation Rule 1) → log completion. Every step writes
a real, timestamped entry to automation history via `storageService`.

## Run it locally

```bash
npm install
npm run dev
```

## Build it

```bash
npm run build
```

## Deploy it (GitHub Pages, automatic)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
deploys the app to GitHub Pages on every push to `main`. One-time setup:
Settings → Pages → Source → **GitHub Actions**. After that, every push
auto-deploys.

## Limitations

- "AI" is simulated with rule-based JavaScript, not a real LLM — extraction
  accuracy depends on keyword/pattern matching, not language understanding.
- All data lives in this browser's LocalStorage only — no sync across
  devices, no multi-user accounts.
- The webhook is simulated for demo purposes only; it is not connected to
  any real external service.

## Future upgrades (no UI rewrite required)

- Demo AI → a real LLM API (swap the body of `analyzeInquiry`/`generateReply`)
- LocalStorage → Supabase/PostgreSQL/Firebase (swap `storageService.js`)
- Simulated webhook → a real incoming webhook endpoint
- Demo follow-up → real Gmail/Outlook/WhatsApp integration

## Testing checklist

- [ ] Add inquiry with validation (name/message required, email format)
- [ ] Analyze inquiry → category, priority, requirements all populate
- [ ] Reply: copy / edit / regenerate / save all work
- [ ] Lead auto-created; status can be changed; delete works
- [ ] Follow-up auto-created; "Mark as Completed" works
- [ ] Automation history logs every step
- [ ] Refresh browser — all data persists
- [ ] Search and filters work on Inquiries and Leads
- [ ] Simulated Webhook button runs the full pipeline
- [ ] Settings: toggling Automation Enabled off skips lead/follow-up creation
- [ ] Responsive on desktop, tablet, and mobile
- [ ] Every sidebar route loads without errors
