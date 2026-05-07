# Audit follow-ups (2026-05-02)

A 4-agent audit pass landed several critical and moderate fixes
inline. The remaining items are **larger refactors** that are too broad
to safely batch in one session — each is a self-contained piece of
work with real visual / API blast radius. They live here so the next
contributor picks the right one off the top.

Severity tags: **[H]** high leverage, **[M]** medium, **[L]** low.

## Forms / fields parity (2026-05-03)

A focused parity sweep across `src/components/base/forms/fields/**`
(41 files / ~8000 LOC) landed five small mechanical fixes inline:
ring-opacity harmonized to `/50` across 6 sites; disabled opacity
harmonized to `50` across 7 sites; destructive ring added to the 6
static-`border-destructive` fields; redundant inner DEV guard in
currency-input dropped. The bigger items below need their own
focused commits with visual review.

### [H] Refactor `rich-select.tsx` end-to-end

Single biggest violation surface in `forms/fields/`. Stacked rule
breaches:
- Rule 6: raw palette tokens (`bg-error-100`, `text-error-600`,
  `placeholder-error-600`, `border-neutral-300`, `text-neutral-400`,
  `bg-primary-50`).
- Rule 17: no `useFormsConfig` / no `formControlSizeClasses`
  integration.
- Custom `outline-3 outline-offset-3 outline-primary-400` focus
  pattern (everywhere else uses `focus-visible:ring-*`).
- `rounded-lg px-3 py-2` chrome divergent from sibling `<Select>`'s
  `rounded-md` + `formControlSizeClasses[size]`.
- `disabled:opacity-40 grayscale` pattern out-of-band from rest of
  fields (now uniformly `opacity-50`).

Ship: either route through `select.tsx`'s trigger styling or extract
a shared `SelectTriggerChrome` helper that both consume.

### [H] Unpin inner trigger sizes in composite fields

Today these composites hardcode `h-9` on their inner SelectTrigger,
producing a height mismatch when a consumer sets
`<UIProvider forms={{ defaultControlSize: 'sm' }}>` (32px input next
to 36px trigger):

- `currency-input.tsx:153`
- `dimensions-input.tsx:281`
- `weight-input.tsx:144`
- `phone-input.tsx:344`
- `decimal-input.tsx:271,301` (stepper buttons hardcoded `h-9 w-9`)

Ship: forward `resolvedSize` and reuse `formControlSizeClasses[size]`
across each composite's inner pieces.

### [H] Standardise the invalid contract on non-text-input fields

The canonical invalid chrome is
`aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`
(used by Input/Textarea/Select/Currency/Dimensions/Weight/Phone-input
and now also rendered as a manual conditional in card-radio /
card-checkbox / switch-card / list-radio / pill-radio / time-picker /
phone-static-prefix). The static fields render the visual via
`invalid && 'border-destructive ring-2 ring-destructive/20'` — works
but is parent-prop-driven instead of attribute-driven. Convert to
`aria-invalid:` selectors so consumers using RHF (which sets the
attribute automatically) get the same styling without touching the
`invalid` prop.

### [H] `tags-input.tsx` suggestion popover hand-rolls primitives

`tags-input.tsx:385` builds the suggestion popover with raw
`<div className="rounded-md border bg-popover p-1 shadow-md">`
instead of `base/popover`'s `PopoverContent` + `base/command`'s
`CommandList`/`CommandItem`. Rule 5 + rule 12 violation. Refactor to
the canonical shape; result row at `tags-input.tsx:401` becomes
`<CommandItem>` instead of a hand-rolled `text-sm py-1.5 px-2` row.

### [M] Fields with custom-shaped `onChange` (legacy bridge)

Beyond the three already in this list (`weight-input`,
`coordinates-input`, `dimensions-input`):

- `switch.tsx:29` — `onCheckedChange?: (event: ImitationEvent) => void`
  with `target: { name, value: boolean }`. Companion `ToggleSwitch`
  (line 73) already exposes the clean `(checked: boolean) => void`
  shape — keep `Switch` for legacy bindings, but document.
- `slider.tsx:7-12,42-43` — `onChange?: (event: SliderImitationEvent)
  => void` with `target: { name, value: number }`; has clean
  `onValueChange?` co-prop. Consolidate when consumer demand is
  clear.

### [M] Fields missing the strings interface

- `coordinates-input.tsx` — accepts `latLabel`, `lngLabel`,
  `latPlaceholder`, `lngPlaceholder`, `previewLinkLabel` as direct
  props. Should use `useStrings(defaultCoordinatesInputStrings, …)`
  for parity with `dimensions-input`.
- `weight-input.tsx` — `unitLabel` / `unitPlaceholder` direct props
  with English defaults; only field with no strings story while
  having user-visible copy.
- `image-upload.tsx:298-300` — pluralisation `+ {n} more file{n === 1
  ? '' : 's'}` hardcoded; not in `ImageUploadStrings`.
- `tags-input.tsx:446` — `{value.length} / {maxTags} tags` —
  hardcoded "tags".
- `image-upload.tsx:254` — `alt={selected?.name || 'Selected image'}`
  fallback not in strings.

### [M] Provider-default fallback drift

`card-radio-group`, `card-checkbox-group`, `list-radio-group`,
`pill-radio-group` all read `useFormsConfig().defaultControlSize ??
'base'` (note `'base'` fallback). `input/textarea/select` use
`resolveFormControlSize(...)` which falls back to `'sm'`. Same
provider, two different defaults. Pick one (recommend `'sm'`).

### [M] Sister chrome drift between `Input` + `Select` + `RichSelect`

- `select.tsx:181` — Trigger hardcodes `py-1` in addition to
  `formControlSizeClasses[size]`. Drop the redundant pin.
- `phone-input.tsx:305` + `rich-select.tsx:182` — `rounded-lg` while
  sibling `Input` is `rounded-md`. Mismatch when phone-input renders
  the static prefix block beside an `<Input>`.
- `phone-input.tsx:305,344` — Use `--form-element-height` CSS
  variable; nothing else in the folder does. Either kill the variable
  usage and route through `formControlSizeClasses`, or document the
  variable in `App.css` and standardise.

### [L] Raw `<button>` instead of `<Button>` (rule 5)

- `list.tsx:56` — drag handle.
- `object-repeater.tsx:104-110` — delete button.
- `tags-input.tsx:344-352` — remove-tag button (low — single-use,
  inside a `<Badge>`).

### [L] Switch `data-[state=unchecked]:border-destructive` only flips on unchecked state

`switch.tsx:64,88` — checked invalid switches show no error chrome.
Add an unconditional `aria-invalid:border-destructive` for symmetry.

### [L] Avatar-upload alt text doubles as action label

`avatar-upload.tsx:213` — `alt={strings.change}` ("Change photo"). The
strings.change is an action label, not an image description. Add a
separate `imageAlt` string.

## Visual consistency

### [H] Adopt `<SmartCard>` (or extract `<CardSurface>`) across the AI family

Eight `composed/ai/*` components hand-roll the same
`rounded-lg border border-border/60 bg-card` chrome:
`ai-tool-call`, `ai-task`, `ai-package-info`, `ai-sources`,
`ai-chain-of-thought`, `ai-code-block`, `ai-artifact`, `ai-reasoning`.

Ship: extend `SmartCard` with a `chromeless`/`bare` variant (or extract
a `<CardSurface>` primitive in `base/cards/`) that exposes the same
header / body / footer slots without a fixed padding preset, and
codemod the AI family. Removes the radius (`rounded-lg` vs `rounded-xl`
vs `rounded-2xl`) and border-opacity (`border-border` vs `/60` vs `/50`
vs `/30`) drift in the same pass.

### [H] Drive every list-row from `--row-py` density token

Three components (`base/command`, `global-search-result-row`, the
density-token comment block in `App.css`) honour the token; ten others
inline `py-1.5` / `py-2`:

- `base/navigation/side-nav.tsx:110,151`
- `base/navigation/action-menu.tsx:206,222,240,258`
- `features/global-search/partials/global-search-idle-state.tsx:56`
- `features/mentions/partials/mention-inline-suggestions.tsx:177`
- `features/filters/partials/filter-list-item.tsx:37`
- `features/filters/partials/regular-filter-content.tsx:148`
- `composed/ai/ai-sources/ai-sources.tsx:196`

Ship: rewrite every menu/list row to `px-3 py-(--row-py)`. This
unblocks `<UIProvider>` density overrides for the whole library
(rule 17).

### [H] Converge card title rendering and extract `<HeroValue>`

`<Heading className="border-none pb-0">` appears ~25 times because
`Heading` is being used as a hero-number container (Metric values,
giftcard amounts, vendor-profile big numbers). Card titles are
rendered inconsistently as `<Text weight="semibold">`,
`<h3 className="font-semibold">`, hand-rolled `<div className="text-sm font-bold">`.

Ship:
1. Extract `<HeroValue>` in `base/display/` (or `base/typography/`,
   pending taste) for the big-number role; codemod the 25 sites.
2. Codemod every "card title" rendering to `<Text weight="semibold">`
   per rule 3.

### [M] Single hover/focus contract

Six different `hover:bg-muted/{30,40,50,60}` opacities + four `focus:`
violations not yet fixed.

Ship: pick `hover:bg-accent` for interactive list rows (matches shadcn
DropdownMenu/Command), `hover:bg-muted/40` for soft "card becomes
hoverable" surfaces. Replace every `focus:` (non-`focus-visible:`)
with `focus-visible:`. Sweep the AI family + composed cards in one
pass.

### [M] Tone-token table (`--tone-bg-soft / -default / -strong`)

`bg-success/{5,10,15,20}` is chosen ad-hoc per component. Codify three
levels in `App.css` (`--tone-bg-soft / -default / -strong`) and have
`IconBadge`, `Badge`, `notification-banner`, `metric.tsx` colorScheme,
`ai-confirmation`, `dialog/drawer alert variants` read the same
variable. Eliminates drift across ~10 components.

### [M] Tokenise event-calendar / giftcard color palettes

`base/event-calendar/colors.ts` + `event-calendar.types.ts:55-61` use
raw Tailwind palette classes (`bg-red-500`, `bg-orange-500`, …) for
event "color" tokens (multi-series legend — legitimate exception
territory). Same in `composed/cards/giftcard-card/types.ts:121-123`.

Ship: introduce CSS variables in `App.css`
(`--event-color-red`, `--event-color-blue`, … or
`--multi-series-N`), document the legend semantics, and reference them
from the calendar / giftcard color maps so consumers can rebrand.

### [M] Replace gradient-card inline pill `<span>` with a `Badge` glass variant

Three sites in `composed/cards/gradient-card/gradient-card.tsx:174,190,266`
+ `composed/cards/giftcard-card/partials/giftcard-full.tsx:107`
reinvent the same on-gradient chip. Add a `Badge` `tone="glass"`
variant once and codemod.

### [L] Empty-state primitive

Four ad-hoc empty-state components (`features/activities`,
`features/global-search`, `features/ai-chat`, `features/comments`)
share shape but no base. Add `base/display/empty-state.tsx` and
codemod.

### [L] Loading-state primitive

`MetricSkeleton`, `AiShimmer`, `Loader2` inline, raw `animate-pulse` —
each feature reinvents the loading idiom. Add
`base/display/loading-state.tsx` (or extend `base/spinner` with
context-aware variants) and codemod.

## React / TypeScript

### [H] Form-field prop interfaces should extend the underlying primitive

~20 form-field components define standalone `interface XxxProps { … }`
that omit `id`, `name`, `aria-*`, `data-*`, `ref`. Examples:
`WeightInputProps`, `CoordinatesInputProps`, `DimensionsInputProps`,
`TimePickerProps`, `FileUploadProps`, `AvatarUploadProps`,
`ImageUploadProps`, `MediaGalleryProps`, `KeyValueEditorProps`,
`ListProps`, `RichSelectProps`, `SliderProps`, `DateTimeInputProps`,
`LocalizedStringFieldProps`, `LocalizedObjectFieldProps`,
`ObjectRepeaterProps`, `StringRepeaterProps`,
`LocalizedStringRepeaterProps`, `UploadProgressListProps`,
`OperationPasswordFormProps`.

Ship: `extends Omit<React.InputHTMLAttributes<HTMLInputElement>,
'onChange' | 'value'>` (or the appropriate element). Each consumer
gets back `id`, `name`, ARIA, test-ids, refs.

### [H] Custom-shaped `onChange` masks the real `ChangeEvent`

`weight-input.tsx:24`, `coordinates-input.tsx:24`,
`dimensions-input.tsx:77` declare
`onChange?: (e: { target: { value } }) => void;`. RHF / Inertia / any
generic onChange handler can't reuse this — it's a fake event.

Ship: rewrite as either
`onChange?: React.ChangeEventHandler<HTMLInputElement>` (DOM-style) or
`onChange?: (value: T) => void` (clean) — pick one shape and apply
across all three. Co-design with the form-field-extends fix above.

### [M] Add `forwardRef` to ~70 base components

93 exported function components live in `base/`; only ~19 use
`forwardRef`. Library-grade interactives must accept refs. Sample
sites: `base/badge/badge.tsx:98`, all `forms/fields/` components,
`pill-radio-group`, `list-radio-group`, `card-checkbox-group`,
`toggle-field`, `switch-card`, `key-value-editor`. Add
`displayName` explicitly when behind `memo`/HOC chains.

### [M] Stop using `React.FC` in features

Six `features/` files use `React.FC<…>` despite the codebase's
preference for plain function declarations:
`comment-attachment-chip`, `comment-empty`, `event-log` (main),
`event-log-event-row`, `mention-content`, `mention-chip`. Convert.

### [M] `key={index}` on data lists

Load-bearing: `composed/data-display/invoice-table/invoice-table.tsx:143,165`
(items + footer rows), `features/ai-chat/partials/ai-chat-message.tsx:77,113`.
Reorder/insert breaks. Use a stable id.

### [M] LoaderButton effect bouquet

`base/buttons/loader-button.tsx:51-78` has 3 effects for one derived
flag plus a write-only `setShowCompletedState`. Reducible to ~5 lines
and one ref-based timer.

### [M] Prop-to-state sync effects (`coordinates-input`, `dimensions-input`,
`image-upload`, `avatar-upload`)

Same anti-pattern as `weight-input` was. Effects re-set internal state
when controlled value changes; the rendered values already
short-circuit via `isControlled ? controlledX : internalX`. Drop the
effects.

### [L] Type-assertion cleanups

- `base/event-calendar/event-calendar-event-card.tsx:47-49` — typed
  `metadata` schema or render-prop slot.
- `base/forms/fields/toggle-field.tsx:80`, `switch-card.tsx:140` —
  narrow Radix's `boolean | 'indeterminate'` properly.
- `base/table/data-table.tsx:151` — runtime-validate `JSON.parse`.
- `features/filters/utils/filter-utils.ts:169-188` — repeated `dep.value as string`.

### [L] Constrain combobox / popover-menu generics

`base/combobox/types.ts:33` and `base/popover-menu/popover-menu.tsx:57`
accept any `T`. Constrain to `<T extends object>`.

## Library rules

### [M] Replace remaining raw colors

`composed/cards/gradient-card/gradient-card.tsx`,
`composed/cards/giftcard-card/types.ts:121-123`,
`composed/commerce/payment-method/payment-method.tsx:71`,
`base/combobox/components/highlighted-text.tsx:20` — raw palette.
Fold into the tone-token sweep above or document as illustrative.

### [L] Empty `event-log.strings.ts`

`features/event-log` is missing its strings file even though it has no
user-facing JSX strings yet. Add an empty interface + defaults so the
feature shape matches rule 11 and survives a future string addition.

### [M] Add `<NumberChip>` primitive in `base/display/`

Two sites currently hand-roll a "circular numeric badge" with a span +
inline-flex + size-5 + rounded-full + tabular-nums:

- `composed/ai/ai-citation/ai-citation.tsx:111`
- `composed/ai/ai-sources/ai-sources.tsx:202`

Ship: introduce `<NumberChip value={n} />` in `base/display/` and
codemod the two sites. Pairs with the gradient-card glass-Badge
follow-up — both are missing primitives, not raw-span violations.

### [H] `base/map/place-autocomplete.tsx` makes hardcoded Photon API calls

`base/map/place-autocomplete.tsx:213` calls `fetch()` against the
hardcoded Photon API endpoint via `buildSearchUrl(...)`. That's a
rule 9 violation: the library is making outbound network calls to a
specific service the consumer didn't pick.

Ship: introduce a `fetcher?: (query: string, options) => Promise<PlaceFeature[]>`
prop with the current Photon-backed implementation as the default. A
consumer who wants Mapbox / Google Places / Nominatim swaps in their
own fetcher without forking. Same shape as `features/filters` use of
`useAsyncOptions` — keep the URL builder + Photon parser exported so
the default is one line.

### [L] Rich-text editor placeholder spans

`features/rich-text-editor/partials/rich-text-editor-tiptap.tsx:287`
and `…/rich-text-editor-fallback.tsx:168` use raw `<span>` for the
absolute-positioned placeholder text overlaid on the editor. The
positioning is load-bearing (the placeholder sits under the contenteditable),
so wrapping in `<Text>` adds an extra layout box. Acceptable as-is, or
ship a `<EditorPlaceholder>` partial in the feature folder if it
appears in any third surface.

---

## Ordering

The cleanest order is:

1. Form-field `extends` + custom `onChange` (one PR — they overlap).
2. AI card chrome consolidation (`<SmartCard chromeless>`).
3. Hover/focus contract sweep + tone token table (one PR — they
   overlap).
4. List-row density token sweep.
5. `<HeroValue>` extraction + card-title convergence.
6. `forwardRef` sweep.
7. Everything tagged [L].

Pull this list as you ship items; add new ones with date stamps.
