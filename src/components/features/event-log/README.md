# `features/event-log`

A unified, mentions-aware **mixed-source log**: comments + audit
events + system messages + custom kinds rendered chronologically under
one surface. Built on top of [`features/comments`](../comments)
(for comment rows + composer) and [`features/mentions`](../mentions)
(for inline references in any kind of entry).

The Shopify "activity timeline + inline comments in one feed" pattern,
made into a reusable component.

---

## When to use it

Reach for `<EventLog>` when:

- You want a single chronological surface that mixes rich threaded
  comments with audit / system / domain events
- Inline `@user` / `#booking` / `$order` references should look the
  same regardless of which kind of entry they live in
- You want the *composer* (with `@`-trigger flow) inline at the top or
  bottom of the same card
- Custom event kinds need their own renderer but should share the
  rest of the surface

For *only-comments* surfaces, use [`<Comments>`](../comments).
For *only-events* surfaces, use the existing
[`<ActivityFeed>`](../activities) or a composed timeline card such as
`ActivityStreamCard`.

---

## At a glance

```tsx
import {
    EventLog,
    type EventLogEntry,
} from '@/components/features/event-log';
import {
    type MentionResource,
} from '@/components/features/mentions';

type Kind = 'user' | 'order';

const RESOURCES: Record<Kind, MentionResource<Kind>> = {
    user:  { trigger: '@', tone: 'info',    /* search or suggestions */ },
    order: { trigger: '$', tone: 'warning', /* … */ },
};

const entries: EventLogEntry<…, …, Kind>[] = [
    { id: 'e1', kind: 'event', timestamp: '2026-04-30T08:00:00Z',
      icon: CheckCircle2, tone: 'success',
      actor: 'System', action: 'captured', target: '€420.00',
      description: 'For <span data-ref-id="order:INV-1" data-ref-kind="order">INV-1</span>.',
      mentions: [{ id: 'order:INV-1', kind: 'order', label: 'INV-1' }],
    },
    { id: 'c1', kind: 'comment', timestamp: '2026-04-30T09:30:00Z',
      comment: { user: { name: 'Maria' }, contentType: 'html',
                 content: 'Looks good <span data-ref-id="user:s">@Stefan</span>',
                 references: [{ id: 'user:s', kind: 'user', label: 'Stefan' }] },
    },
];

<EventLog
    entries={entries}
    canModerate
    resources={RESOURCES}
    composer={{
        enabled: true,
        position: 'top',
        context: { id: 'INV-1', type: 'order' },
        onSubmit: (values, helpers) => {
            api.post('/notes', values).then(() => helpers.reset());
        },
    }}
/>
```

---

## Concepts

### Heterogeneous entries

```ts
type EventLogEntry =
    | EventLogCommentEntry      // { kind: 'comment'; comment: CommentData }
    | EventLogActivityEntry     // { kind: 'event' | 'system' | 'audit' | string; … }
```

The discriminator is `kind`. Built-in renderers:
- `'comment'` → `<CommentItem>` row (full pinned / reactions /
  attachments / inline mentions)
- *anything else* → icon-rail row (`<EventLogEventRow>`) with
  description rendered through `<MentionContent>` (so inline
  references render as chips)

Custom kinds drop in via the `renderers` map:

```tsx
<EventLog
    entries={entries}
    renderers={{
        webhook: (entry, ctx) => <MyWebhookRow entry={entry} {...ctx} />,
        deploy:  (entry, ctx) => <MyDeployRow entry={entry} {...ctx} />,
    }}
/>
```

### Optional inline composer

`composer.enabled` mounts a `<CommentComposer>` at the top or bottom
of the card. Submits fire `composer.onSubmit(values, helpers)` —
consumers typically append the result as a new
`EventLogCommentEntry`.

The composer uses the same `resources` and `onResourceSearch` props as
the rest of the EventLog, so chips look identical in fresh comments and
in existing entries without a feature-specific provider.

---

## API

### Top-level

```tsx
<EventLog<TUser, TMeta, TResource>
    entries={…}                    // EventLogEntry[]
    order='asc' | 'desc'           // default 'desc' (newest first)

    // Resources & search
    resources={…}                  // Record<TResource, MentionResource>
    onResourceSearch={…}           // global suggestion callback

    // Comment lifecycle
    canModerate
    onCommentDelete onCommentReact onCommentReply onCommentPinToggle

    // Strings (delegated to <CommentItem>)
    strings={…}

    // Per-kind renderer override
    renderers={{ webhook: (entry, ctx) => …, … }}

    // Inline composer
    composer={{
        enabled: boolean,
        position?: 'top' | 'bottom',
        context: { id, type, moduleKey? },
        onSubmit?: (values, helpers) => void,
        placeholder?, autoFocus?,
    }}

    // Card chrome
    bare={false}                   // drop the SmartCard wrapper
    title={…}                      // card title (when not bare)
    className={…}

    // Accessors (forwarded to CommentItem / EventLogEventRow)
    getMediaUrl getMediaName getStatusLabel formatRelativeTime
/>
```

### `EventLogEntry`

```ts
// Comment entry — wraps the existing comments feature payload
interface EventLogCommentEntry<TUser, TMeta, TResource> {
    id: string;
    kind: 'comment';
    timestamp: string;
    comment: CommentData<TUser, TMeta, TResource>;
}

// Activity / audit / system / custom event
interface EventLogActivityEntry<TResource> {
    id: string;
    kind: 'event' | 'system' | 'audit' | string;   // discriminator
    timestamp: string;
    icon?: LucideIcon;
    tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary';
    actor?: string;
    action?: string;
    target?: ReactNode;
    headline?: ReactNode;
    description?: string;                          // HTML — supports inline mentions
    mentions?: ReadonlyArray<Mention<TResource>>;
    metadata?: ReadonlyArray<{ label, value }>;
    data?: unknown;
}
```

### Per-kind `EventLogRenderer<TUser, TMeta, TResource>`

```ts
type EventLogRenderer = (
    entry: EventLogEntry<TUser, TMeta, TResource>,
    ctx: {
        resources?: MentionsConfig['resources'],
        accessors?: CommentsAccessors,
        strings?: Partial<CommentsStrings>,
    },
) => ReactNode;
```

The default renderers handle `'comment'` (via `<CommentItem>`) and
everything else (via `<EventLogEventRow>`). Override per-kind via the
`renderers` prop.

---

## Plug-in checklist

1. ✅ Define your kind union (typically `'comment' | 'event' | 'audit' | …`)
2. ✅ Map domain events to `EventLogActivityEntry` (with `description` HTML
   for any inline mentions you want chip-rendered)
3. ✅ Map comments to `EventLogCommentEntry` (carry `CommentData` as-is)
4. ✅ Pass `resources` and optional `onResourceSearch` directly to
   `<EventLog>` so comments and event descriptions share one registry
5. ✅ Optional: enable the inline composer with `composer.enabled` +
   `composer.onSubmit`
6. ✅ Optional: pass `renderers` for any custom kinds your app uses

---

## Use cases

| App pattern | Configuration |
|---|---|
| Order page activity tab | `entries=[orderEvents, …comments]`, `composer.enabled=true`, `composer.position='top'`, `order='desc'` |
| Audit log (read-only) | `entries=[auditEvents]`, `composer.enabled=false`, `bare=true` if you want it inside another card |
| Booking notes + system | `entries=[bookingEvents, …notes]`, custom `renderers.booking_change` for diff rendering |
| Customer profile | `entries=[…allKinds]`, `order='desc'`, shared `resources`, `renderers` for `'support_ticket'`, `'newsletter'`, etc. |

---

## Examples in the repo

- [`/features/event-log`](../../../../preview/pages/features/event-log.mdx)
  preview — comments + audit events + system + notification under one
  feed
- [`/features/enhanced-activities`](../../../../preview/pages/features/enhanced-activities.mdx)
  preview — Shopify-style activity timeline with comments rendered
  inline as note activities (uses `<ActivityFeedCard>` rather than
  `<EventLog>` to demonstrate the alternative pattern)

---

## Don't

- ❌ Render comments via `<EventLogEventRow>` — they go through
  `<CommentItem>` for full pinned/reactions/attachments support
- ❌ Inline routing or fetching — pass everything via `composer.onSubmit`
  / `onCommentDelete` / etc. callbacks
- ❌ Add a feature-specific provider for resources — pass `resources`
  and `onResourceSearch` at the EventLog call site
