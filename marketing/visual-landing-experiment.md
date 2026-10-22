# Visual landing experiment — visual_v1

## Hypothesis and baseline

Visitors may avoid starting because the landing page requires too much reading. Change only the landing presentation and add a 25-second, silent, captioned walkthrough of the actual planner. The planner calculation and personal planner handlers remain unchanged.

Pre-change benchmark supplied by Jude / the referenced Lex conversation: **30 homepage visits / 1 planner start / 1 build / 1 generated plan**. This is a reported benchmark, not a fresh dashboard export or independently audited observation. Historical event definitions and sample inclusion may differ; do not imply precise like-for-like conversion or statistical significance.

Previous deployed source: `3f507cefbd9584556d55eb60e8d10fb6cc794cdc`. New cohort begins only when the Pages deployment containing this file succeeds; use its GitHub deployment timestamp for the boundary, not the local commit time. Worker 3 should retain that deployment URL, SHA, and completion timestamp in its next report.

## What visitors see

Prominent payday question, immediate Build My Plan CTA and Free / No signup / No bank connection trust line. Watch example CTA leads to a 25-second walkthrough. Five five-second scenes show money and next payday, submitted bills/dates, groceries and other necessities fields, the build action, and the real generated priority order. Replay and pause/resume work without sound. Playback advances only while the document is visible and the caption is in view; completion requires reaching 25 seconds, not merely clicking play. Background suspension can lengthen wall-clock time.

The embedded example uses the same HTML, form submissions and unchanged calculation. Its entries are memory-only; analytics exits before setting any opt-out preference. It never replaces stored personal bills and never generates personal funnel events in the parent. Editable examples remain sample runs. Longer scope, privacy and decision details remain below the primary interaction.

Example: $850 available, next income in 7 days, $120 groceries; rent $600 due tomorrow, electricity $140 due in 3 days, card minimum $75 due in 5 days. The actual algorithm protects $120, budgets rent, flags electricity for review, then budgets the smaller card minimum; $675 required payments and $55 unallocated. The walkthrough does not imply a payment, partial utility payment, extension or safer outcome.

## Worker 3 measurement handoff

Existing GoatCounter account: `aipayer.goatcounter.com`. All new homepage events also have a `visual_v1/` event path. Use those prefixed paths for the new cohort rather than mixing all-time legacy events:

| Step | GoatCounter event path | Meaning |
| --- | --- | --- |
| Landing | visual_v1/landing | Eligible homepage load |
| Play | visual_v1/walkthrough_play | Explicit playback request, once per page load |
| Complete | visual_v1/walkthrough_complete | All five scenes reached and 25 seconds of foreground caption-visible playback elapsed |
| Personal start | visual_v1/own_plan_started | Personal CTA clicked; not proof of completed input |
| Build | visual_v1/build_clicked | Personal build button clicked, including invalid attempts |
| Generated | visual_v1/plan_generated | Personal result rendered successfully |

Sample paths `visual_v1/sample_started`, `visual_v1/sample_build_clicked`, and `visual_v1/sample_plan_generated` must be excluded from personal conversion. Legacy unprefixed events continue for compatibility; do not add prefixed and unprefixed counts together. Old `demo_started` / `demo_completed` are retired for this experience. Build uses a capture listener so its event precedes generation. Signals are deduplicated per event per page load, not per person.

GoatCounter aggregates do not establish a user-linked, ordered funnel or prove that watching caused a personal plan. A visitor can start directly without watching. Report play/landing, complete/play, personal-start/landing and personal-generated/landing as aggregate event ratios, with sample counts separately; do not claim watcher conversion or attribution from these counts. Preserve existing allowlisted campaign attribution; do not invent campaign sources. Review after 20–30 eligible external landing loads, with uncertainty stated.

No financial entries, bill names, feedback contents or new identity tracking are sent. Existing production-host, webdriver, Do Not Track, Global Privacy Control and opt-out exclusions remain. Owner/manual QA must first visit `https://ai-payer.online/?analytics=off`; automated and local tests are excluded. This suppresses this browser until explicitly re-enabled with `?analytics=on`. Do not re-enable it for QA.

## Validation and limits

Analytics tests use a mocked image beacon: cohort paths, once-per-load deduplication, sample separation and privacy exclusions; no test events are intentionally sent to the production counter. Live GoatCounter dashboard ingestion is not independently confirmed in this chat. Do not fabricate a post-change count. Deployment and browser QA evidence are recorded separately when complete.

Local QA: mobile viewport (383px) completed all five scenes with correct results; personal entry/generated result; editable-sample totals and personal-bill restoration. Desktop 1440×900 landing has no horizontal overflow; playback/pause/resume checked. The actual planner.js file is unchanged from the prior deployment. Repeat the dependency-free instrumentation check with: node tests/analytics.cjs.
