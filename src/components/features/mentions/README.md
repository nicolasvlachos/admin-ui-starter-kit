# `features/mentions`

Generic, framework-agnostic infrastructure for **inline references**:
`@user` mentions, `#booking` links, `$order` chips — anything that
embeds a typed pointer to a domain resource inside a rich-text body.

The same primitives power inline references in:

- [`features/comments`](../comments) — comment composer + body
- [`features/event-log`](../event-log) —
  unified comments + audit / system events under one timeline
- [`features/enhanced-activities`](../../../preview/pages/features/enhanced-activities.mdx)
  preview — Shopify-style timeline with notes inline

Pass the same `resources` and `onResourceSearch` props to every surface
that consumes mentions when those surfaces should share a catalogue.

---

## At a glance

```tsx
import {
    useMentions,
    MentionInlineSuggestions,
    MentionContent,
    type Mention,
    type MentionResource,
} from '@/components/features/mentions';
import { User, CalendarRange, Receipt } from 'lucide-react';

type Kind = 'user' | 'booking' | 'order';

const resources: Record<Kind, MentionResource<Kind>> = {
    user:    { icon: User,          trigger: '@', tone: 'info',    label: 'Person',  buildHref: (s) => `/people/${s.id}` },
    booking: { icon: CalendarRange, trigger: '#', tone: 'success', label: 'Booking', buildHref: (s) => `/bookings/${s.id}` },
    order:   { icon: Receipt,       trigger: '$', tone: 'warning', label: 'Order',   buildHref: (s) => `/orders/${s.id}` },
};

async function onResourceSearch(needle: string, kind: Kind) {
    const res = await fetch(`/api/${kind}s?q=${encodeURIComponent(needle)}`);
    return (await res.json()) as Array<{ id: string; label: string; description?: string }>;
}

// Pass `resources` and `onResourceSearch` to `<Comments>`, `<EventLog>`,
// or directly into `useMentions({ resources, onResourceSearch })`.
```

Inside any composer surface that already uses `<RichTextEditor>` (or
any editor exposing `MentionEditorHandle`):

```tsx
const editorRef = useRef<RichTextEditorHandle>(null);
const mentions = useMentions<Kind>({ editorRef, resources, onResourceSearch });

return (
    <div className="relative">
        <RichTextEditor ref={editorRef} {...} onCaretChange={mentions.handleCaretChange} />
        <MentionInlineSuggestions
            open={mentions.triggerActive && mentions.pickerOpen}
            kinds={mentions.kinds}
            activeKind={mentions.activeKind}
            setActiveKind={mentions.setActiveKind}
            onManualKindChange={() => mentions.setManualKindOverride(true)}
            suggestions={mentions.suggestions}
            suggestionsByKind={mentions.suggestionsByKind}
            isLoading={mentions.isLoading}
            query={mentions.query}
            onSelect={mentions.pickSuggestion}
            resources={resources}
        />
    </div>
);
```

To render a body that contains saved mentions:

```tsx
<MentionContent html={comment.contentHtml} mentions={comment.references} />
```

---

## Concepts

### Mention

The runtime shape persisted alongside the HTML body:

```ts
interface Mention<TKind extends string = string, TData = unknown> {
    id: string;        // typically `"<kind>:<resourceId>"`
    kind: TKind;       // matches a key in `resources`
    label: string;     // display label
    href?: string;     // permalink for the chip
    data?: TData;      // free-form payload (full resource, analytics, …)
}
```

References live in the HTML as
`<span data-ref-id="kind:id" data-ref-kind="kind">label</span>` so the
body and the structured `Mention[]` round-trip cleanly through any
renderer.

### Resource registry

`MentionsConfig.resources` is a plain `Record<TKind, MentionResource>`
map — it's the single explicit interface for declaring *what* can be
mentioned, *how* to search it, and *what* the chip looks like:

```ts
interface MentionResource<TKind, TData> {
    icon?: LucideIcon;       // tab + chip leading icon
    label?: string;          // tab label
    trigger?: string;        // '@', '#', '$' …  — inline-trigger char
    tone?: MentionTone;      // 'info' | 'success' | 'warning' | …
    search?: (q) => Promise<Suggestions> | Suggestions;
    suggestions?: Suggestions;
    buildHref?: (s) => string;
    renderChip?: (mention) => ReactNode;
}
```

Suggestion lookup order (tried per kind):
1. `resources[kind].search(needle)` — per-kind callback
2. `resources[kind].suggestions` — static catalogue
3. global `onResourceSearch(needle, kind)` — fallback

### Tones drive Badge variants

`MentionChip` wraps the lib's `<Badge>` and maps `MentionTone →
ComposedBadgeVariant` once. To rebrand chips library-wide, edit
[`partials/mention-chip.tsx`](./partials/mention-chip.tsx)'s
`TONE_TO_VARIANT` table.

### Inline triggers

When a kind declares `trigger: '@'`, typing `@` in any editor with
`useMentions` attached opens a non-focus-stealing
`<MentionInlineSuggestions>` panel below the editor. The panel
**streams live results** as the user keeps typing — `query` syncs from
the caret context on every keystroke. On selection, the trigger range
(`@needle`) is replaced atomically with the chip HTML.

### Cross-kind search + auto-switch

The hook runs all registered kinds in parallel. When the active kind
returns zero results but another has matches, the active kind
auto-switches. Manual tab clicks set a `manualKindOverride` flag that
sticks for the rest of the trigger session — so the user's choice
persists even as they type or backspace.

---

## API

### `useMentions<TResource>(options): UseMentionsReturn`

Combined picker state + caret-trigger detection bound to an editor.

| Option | Description |
| --- | --- |
| `editorRef` | `Ref<MentionEditorHandle>` — the editor surface (e.g. `<RichTextEditor>` instance). |
| `resources` | Resource registry for this editor instance. |
| `onResourceSearch` | Global search fallback for this editor instance. |
| `initialMentions` | Seed the chip-list when editing an existing body. |
| `debounceMs` | Search debounce window. Default `200`. |

| Returns | |
| --- | --- |
| `kinds`, `activeKind`, `setActiveKind`, `activeResource` | Tab state |
| `query`, `setQuery` | Live needle |
| `suggestions`, `suggestionsByKind`, `isLoading` | Search results |
| `mentions`, `addMention`, `removeMention`, `setMentions`, `reset` | Draft chip list |
| `pickerOpen`, `setPickerOpen` | Open state |
| `triggerActive` | True iff opened via inline trigger |
| `manualKindOverride`, `setManualKindOverride` | Tab-pin flag |
| `handleCaretChange()` | Wire to the editor's `onCaretChange` |
| `pickSuggestion(s)` | Insert chip + close picker |

### `useMentionsSearch<TResource>(options)`

Pure search-state hook (no editor binding). Use this for custom UIs
that don't need caret-trigger detection — slash menus, command
palettes, autocompletes, …

### `MentionEditorHandle`

The minimum surface an editor must expose for `useMentions` to bind:

```ts
interface MentionEditorHandle {
    focus(): void;
    insertHTML(html: string): void;
    replaceBeforeCaret(length: number, html: string): void;
    getCaretContext(): { textBefore: string } | null;
}
```

`<RichTextEditor>` from `features/rich-text-editor` already implements
this. To plug in a custom editor (Slate, Lexical, ProseMirror direct,
contenteditable, …), implement these four methods on its imperative
handle.

### Components

- **`<MentionChip mention resource>`** — Badge-wrapped inline chip,
  tone driven by `resource.tone`.
- **`<MentionContent html mentions resources renderMention?>`** —
  HTML→React renderer; swaps each `data-ref-id` span for a chip.
- **`<MentionPicker open kinds activeKind suggestions isLoading
  onSelect>`** — popover content (used for manual button-click flows).
- **`<MentionInlineSuggestions open kinds activeKind suggestions
  suggestionsByKind isLoading query onManualKindChange onSelect>`** —
  non-focus-stealing live panel positioned below an editor.

### Utilities

- `buildMentionHtml(mention, { triggerChar? })` → HTML string for the
  inline chip span.
- `splitHtmlByMentions(html)` → array of `{ kind: 'html' | 'mention' }`
  segments.
- `parseMentionsFromHtml(html)` → array of `Mention` objects extracted
  from `data-ref-id` spans.

---

## Plug-in checklist

For a brand-new app to wire mentions in:

1. ✅ Decide your `TKind` union.
2. ✅ Register one `MentionResource` per kind with at minimum `icon`,
   `label`, `trigger`, `tone`, and `buildHref`.
3. ✅ Provide either per-kind `search` / `suggestions` OR a global
   `onResourceSearch(needle, kind)` callback.
4. ✅ Pass those options directly to `<Comments>`, `<EventLog>`, or
   `useMentions({ editorRef, resources, onResourceSearch })`.
5. ✅ In each custom composer, attach `useMentions({ editorRef, resources })` and render
   `<MentionInlineSuggestions>` below the editor + (optional)
   `<MentionPicker>` for the manual button.
6. ✅ When rendering bodies, use `<MentionContent html mentions>` to
   resolve chips from saved data.

That's the whole integration. The rest — tone palettes, custom chip
renderers, custom editors, custom UIs — is per-prop or per-resource.
