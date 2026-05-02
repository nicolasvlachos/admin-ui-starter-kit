# Where to place a new card / widget inside `composed/`

`composed/` is sliced into a handful of domain folders. Each folder has
an unwritten convention about what belongs there. Use this as a
placement guide before creating a new sub-folder.

## The current domains

```
src/components/composed/
├── admin/             — workspace management surfaces (team-member,
│                         settings rows, audit-log glue, admin nav…)
├── ai/                — AI-related building blocks: agent cards,
│                         tool-call display, reasoning, citations,
│                         shimmer, code blocks, chat message parts.
├── analytics/         — Metric, MetricBar, MetricGrid,
│                         MetricComparison, ActivityHeatmap,
│                         skeletons. Strings live in
│                         `analytics.strings.ts`.
├── cards/             — domain-specific *card* layouts that don't
│                         belong to another domain (course-card,
│                         vendor-profile, contact-card, gradient-card,
│                         giftcard family).
├── commerce/          — order, shipment, product, payment-method,
│                         tax, refund-status surfaces.
├── dark-surfaces/     — dense dark-themed dashboard surfaces. Strings
│                         co-located in `dark-surfaces.strings.ts`.
├── data-display/      — KV / definition-list / dense-info /
│                         invoice-items / metadata table layouts.
├── navigation/        — domain-aware navigation: category-nav,
│                         time-ruler, breadcrumb-progress.
├── shared/            — primitives shared between composed sub-domains
│                         (avoid; promote to base/ if reused outside).
└── timelines/         — marker-rail timeline + activity-row variants.
```

## Decision tree

When you have a new component to place:

1. **Is it a status / metric tile?** → `analytics/`
2. **Is it about an AI assistant's output, citation, tool call, or reasoning?** → `ai/`
3. **Is it the chrome for an order, shipment, product, refund, payment-method, tax, or other commerce concept?** → `commerce/`
4. **Is it a dense dark-mode dashboard surface?** → `dark-surfaces/`
5. **Is it a KV / definition-list / "show me 12 fields and their values"?** → `data-display/`
6. **Is it a domain-aware navigation control (category list, time scrubber, progress crumbs)?** → `navigation/`
7. **Is it a marker-rail timeline or activity feed row?** → `timelines/`
8. **Is it a generic admin row (team member, audit entry, settings toggle)?** → `admin/`
9. **None of the above but it is a "card"-shaped layout?** → `cards/`

When two domains feel equally right, prefer the one whose existing
strings file you'd extend.

## When to NOT add to `composed/`

- The piece is a single visual element (badge, button, icon medallion):
  → `base/`.
- The piece holds state, async behaviour, slots, or callbacks the
  consumer might wire (filters, comments, search): → `features/`.
- The piece is a page shell (header, sidebar, container): → `layout/`.

## Folder shape inside a domain

Non-trivial composed components get their own folder, mirroring the
feature shape but lighter:

```
composed/<domain>/<my-card>/
├── <my-card>.tsx
├── <my-card>.types.ts        — public types
├── partials/                 — internal pieces, exported via index.ts
│                               only when reusable
├── index.ts                  — public surface
└── README.md                 — optional, only when the API is
                                non-obvious or has a notable contract
```

Strings: most domains already have a single `<domain>.strings.ts`
(see `analytics/analytics.strings.ts`, `dark-surfaces/dark-surfaces.strings.ts`).
Add to the existing file rather than creating a new one per component
unless the domain genuinely doesn't have a shared strings file yet.

## Promoting to `base/`

If a composed sub-component is reused in 2+ domain folders or in
`features/`, that's a signal it should be promoted to `base/`. Examples
of past promotions: `base/item/`, `base/display/icon-badge/`,
`base/display/inline-stat/`. Don't ship the same row pattern from two
composed folders — extract it.

## Don't create a new domain folder lightly

Adding a new top-level domain (`composed/operations/`, `composed/billing/`,
…) means future contributors have one more decision to make. Prefer
nesting inside an existing domain unless you have at least 3 components
that share strings or visual conventions and don't fit anywhere else.
