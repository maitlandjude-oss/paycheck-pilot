# Stranger #2: try before you type

First Dollar is closed per Jude. This is a separate adoption experiment; bounty files and records are unchanged.

Goal: a stranger generates a plan using their own numbers. Historical reported baseline: 19 homepage visits, no additional planner starts; not independently verified here. Do not count sample runs as success.

Before: full bills/living form immediately, separate static example, destructive saved-bill sample replacement, support and feedback visible before a plan.

After: payday hook, one-click fictional demo through the same unchanged calculation, clear staged results, two-field personal start, then bills and living needs. Free / No signup / No bank connection. Support and feedback appear only after generating a planner result. Sample editing uses memory and preserves personal saved bills.

Sample: $850 cash, next pay in 7 days, $120 groceries, rent $600 due +1 day, electricity $140 due +3 days, card minimum $75 due +5 days. Result: $120 protected; rent $600 budgeted, electricity flagged for review (only $130 available at that point), card $75 budgeted; $675 required payments, $55 unallocated. No partial payment, negotiation, or extension is assumed. Dates use the visitor's local calendar. The demo does not write bills to storage.

GoatCounter events (at most once per page load):

| Event | Trigger |
| --- | --- |
| landing | Homepage analytics loads |
| demo_started | Demo CTA clicked |
| demo_completed | Actual calculation rendered |
| own_plan_started | Use my numbers / Build my plan CTA clicked |
| plan_generated | Personal plan successfully rendered |
| sample_started | Editable sample loaded |
| sample_plan_generated | Sample plan successfully rendered |

Pageviews and existing feedback/support events remain. No amounts, bill names, form contents, or financial data are included. Existing hostname, webdriver, privacy preferences and analytics opt-out exclusions remain. Own-plan start means intention via CTA, not completed input. Sample edits remain samples; use the personal CTA to start a personal plan. Events are aggregate counts, not proof of identity or unique people. Owner/test browsers should visit `https://ai-payer.online/?analytics=off` before manual checks.

Review the next 20–30 external visits: landing → demo_completed → own_plan_started → plan_generated. Investigate the largest drop. Success requires human confirmation of an external user's personal plan; aggregate analytics alone cannot identify stranger #2. No signup, email campaign, or new payment flow is part of this experiment.

Validation: local headless Edge at 390px; demo totals, sample persistence isolation, personal bill entry and generated plan, exact app events, no horizontal overflow and no JS errors. 1,000 deterministic scenarios compared extracted calculation against original algorithm, preserving decisions and totals. Reduced-motion styling disables result animation. GitHub Pages uses the existing dynamic pages build and deployment on main.
