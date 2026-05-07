# `features/comments`

Threaded comments with a TipTap-backed composer, inline `@`/`#`/`$`
mentions, attachment uploads, reactions, pinned + edited states, and
direct per-mount configuration. Framework-agnostic — no
`@inertiajs/*`, `next/*`, `vite-bundled-i18n/*`, `ziggy-js`, or
`react-router*` in default export paths.

The mention/reference layer delegates to
[`features/mentions`](../mentions) so chips look and behave the same
across comments, timelines, and any other consumer.

---

## At a glance

```tsx
import {
    Comments,
    type CommentData,
    type CommentFormValues,
    type CommentSubmitHelpers,
} from '@/components/features/comments';
import {
    type MentionResource,
} from '@/components/features/mentions';

type Kind = 'user' | 'order';

const RESOURCES: Record<Kind, MentionResource<Kind>> = {
    user:  { trigger: '@', tone: 'info',    suggestions: USERS  },
    order: { trigger: '$', tone: 'warning', suggestions: ORDERS },
};

function Page() {
    const [comments, setComments] = useState<CommentData<…, …, Kind>[]>(SEED);

    const handleSubmit = (
        values: CommentFormValues<Kind>,
        helpers: CommentSubmitHelpers,
    ) => {
        api.post('/comments', values).then(saved => {
            setComments(prev => [...prev, saved]);
            helpers.reset();
        });
    };

    return (
        <Comments
            context={{ id: 'BKG-1', type: 'booking' }}
            comments={comments}
            canComment
            canModerate
            resources={RESOURCES}
            attachments={{ onUpload }}
            onSubmit={handleSubmit}
            onDelete={id => api.delete(`/comments/${id}`).then(() => …)}
        />
    );
}
```

That's the whole integration. Everything else — strings, slot
overrides, custom render-props, framework adapters — is opt-in.

---

## Concepts

### `CommentData<TUser, TMeta, TResource>`

Generic over three axes:
- **`TUser`** — author shape (`{ id?, name?, avatar? }` by default)
- **`TMeta`** — free-form per-comment payload
- **`TResource`** — string union of resource kinds (mentions)

```ts
interface CommentData<TUser, TMeta, TResource> {
    id?: string;
    content?: string;             // HTML body (with inline mention spans)
    contentType?: 'text' | 'html' | 'rich' | string;
    createdAt?: string;
    updatedAt?: string;
    user?: TUser;
    status?: string;
    isPinned?: boolean;
    isEdited?: boolean;
    canDelete?: boolean;
    canEdit?: boolean;
    tagsArray?: string[] | Record<string, string>;
    attachments?: Array<CommentAttachment | null>;
    media?: Array<CommentAttachment | null>;       // legacy alias
    references?: ReadonlyArray<CommentReference<TResource>>;  // = Mention[]
    reactions?: ReadonlyArray<CommentReaction>;
    replyToId?: string;
    meta?: TMeta;
}
```

`CommentReference` / `CommentResourceType` / `CommentResourceSuggestion` /
`CommentTone` are kept as aliases over the shared mentions types, so
existing consumers don't have to rename anything.

### Composer

`<CommentComposer>` is the TipTap-backed editor + uploader + inline
mention picker. It's used internally by `<Comments>` but exported so
consumers can render it standalone (e.g. inline reply boxes).

- Live `@`/`#`/`$` triggers open the inline suggestions panel without
  stealing focus
- Picker streams cross-kind results and auto-switches the active tab
  when the current kind has no matches
- Manual tab clicks pin the active kind for the rest of the trigger
  session
- Selected mentions become atomic chip spans in the body; backspace
  deletes a chip whole, and the form's `references` array stays in sync
  via `parseMentionsFromHtml` on every change
- Attachments stream with progress, retry, and abort

### Per-mount configuration

`<Comments>` receives strings, accessors, lifecycle callbacks, attachment
uploader settings, default permissions, and the resource catalogue as
direct props. Library-wide display defaults that truly apply everywhere
belong in `<UIProvider>`; per-thread data and callbacks stay on the
component mount.

```ts
interface CommentsConfig<TUser, TMeta, TResource> {
    composerPosition?: 'top' | 'bottom';
    strings?: Partial<CommentsStrings>;
    resources?: Record<TResource, MentionResource<TResource>>;
    onResourceSearch?: (needle: string, kind: TResource) => Promise<…>;
    attachments?: { onUpload, maxSize?, maxFiles?, accept?, disabled? };
    canComment?: boolean;
    canModerate?: boolean;
    onSubmit?: (values, helpers) => void;
    onDelete?: (id) => void;
    onUpdate?: (id, values, helpers) => void;
    onPinToggle?: (comment) => void;
    onReact?: (id, emoji) => void;
    onReply?: (id) => void;
    sanitizer?: (html) => string;
    // accessors:
    getMediaUrl?, getMediaName?, getStatusLabel?, formatRelativeTime?
}
```

---

## API

### Components

| Component | Purpose |
|---|---|
| `<Comments>` (`<CommentsCard>`) | Top-level surface — composer + timeline + empty state |
| `<CommentTimeline>` | Just the chronological list (no composer) |
| `<CommentItem>` | A single row — pinned / reactions / attachments / actions |
| `<CommentComposer>` | Editor + picker + uploader, standalone |
| `<CommentContent>` | Body renderer — HTML + mention chips via `<MentionContent>` |
| `<CommentAttachmentChip>` | Inline attachment pill (download / progress / retry / remove) |
| `<CommentEmpty>` | Default empty state |

### Hooks

| Hook | Returns |
|---|---|
| `useComments(opts)` | Composer mode (idle / replying / editing), submit / delete helpers, errors, resetKey |
| `useAttachmentUpload(opts)` | Upload state, addFiles / removeAttachment / retryAttachment / reset, isUploading flag |
| `useResolvedStrings(propStrings)` | Deep-merges defaults → prop |
| `useResolvedAccessors(propAccessors)` | Resolves prop accessors → UIProvider defaults |

### Slots & render-props

`<Comments>` supports:
- `composerSlot` — replace the entire composer
- `headerSlot` / `footerSlot` — wrap the surface
- `emptySlot` — replace the empty state
- `renderItem(ctx)` — per-comment custom renderer (`ctx.defaultItem` available for composition)
- `renderAttachment(att)` — per-attachment custom chip
- `renderReference(mention)` — per-mention custom chip (overrides resource.renderChip)

### Framework wiring

This feature is framework-agnostic. The library does not ship
`adapters/$framework/`. Consumers wire routing / data / optimistic
updates / i18n at the call site:

```tsx
<CommentsCard
    items={items}
    onSubmit={(values) => router.post(route('comments.store'), values)}
    onDelete={(id) => router.delete(route('comments.destroy', id))}
    strings={{ composer: { placeholder: t('comments.placeholder') } }}
/>
```

If a consumer pattern repeats across many mount sites they wrap the
feature in their own `<AppCommentsCard>` that forwards their defaults
— the library never ships that wrapper.

---

## Strings

40+ keys cover every user-facing string in the feature: composer
toolbar, attachment status, reactions, pin/edit/reply labels,
moderator menu, errors. Override via `strings` prop or globally via
the provider's `config.strings`.

```ts
<Comments
    strings={{
        title: 'Internal notes',
        empty: 'Nothing logged yet.',
        composerPlaceholder: 'Add an internal note…',
        composerSubmit: 'Save note',
    }}
/>
```

`interpolateString(template, values)` handles `{{token}}` substitution
for templated strings like `composerReplyingEyebrow`.

---

## Plug-in checklist

1. ✅ Decide your `TResource` kind union
2. ✅ Register `MentionResource` per kind (icon, trigger, tone, search/suggestions)
3. ✅ Pass `resources` directly to `<Comments>`
4. ✅ Pass accessors / lifecycle callbacks / strings directly at the component mount
5. ✅ Render `<Comments context comments canComment onSubmit onDelete>`
6. ✅ Wire `attachments.onUpload` if you want attachments
7. ✅ Use the `strings` prop for any copy that needs localising

That's it. The composer / picker / uploader / chip rendering all flow
through the registry and provider — no custom wiring needed.

---

## Examples in the repo

- [`/features/comments`](../../../preview/pages/features/comments.mdx)
  preview — full demo of every prop
- [`/features/event-log`](../../../preview/pages/features/event-log.mdx)
  — comments mixed with audit events under one timeline
- [`/features/enhanced-activities`](../../../preview/pages/features/enhanced-activities.mdx)
  — Shopify-style timeline with comments rendered as note activities

---

## Don't

- ❌ Hardcode strings inside JSX — use `strings` + `interpolateString`
- ❌ Add `useQuery` / `router.visit` / `useI18n` to default export paths — consumers wire those at the call site
- ❌ Edit `comment-content.tsx`'s prose classes ad-hoc — the body is rendered via `<MentionContent>` from the shared module
- ❌ Render mention chips manually — let `parseMentionsFromHtml` + the editor's `<span class="rsc-mention">` markers do the work
