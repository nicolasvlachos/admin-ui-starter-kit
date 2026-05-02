/**
 * UIConfig — the shape of library-wide display defaults.
 *
 * Every slice is optional and every key inside a slice is optional.
 * Components resolve precedence as:
 *
 *     props.X  ??  useFooConfig().X  ??  hardcoded fallback inside the component
 *
 * So a consumer can:
 *   - Set a global currency once at the root, and never pass `currency` again.
 *   - Override that currency at one specific call site by passing `currency`.
 *   - Skip the provider entirely — every component still works, falling back
 *     to its built-in default.
 *
 * What goes in here:
 *   - Pure display defaults (currency, week-start, default sizes/paddings).
 *   - App-wide formatters (relative-time, media URL resolution).
 *
 * What does NOT go in here:
 *   - Per-mount runtime callbacks (`onSubmit`, `onDelete`, `onChange`, …).
 *     Those stay as props on the actual component instance.
 *   - Per-mount data (comment lists, mention resource registries used by a
 *     specific surface, …). Pass at the call site.
 *   - User-facing strings. Use the `strings={{}}` prop pattern instead.
 */

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TextSize = 'inherit' | 'xxs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TableSize = 'xs' | 'sm' | 'base';
export type CardPadding = 'sm' | 'base' | 'lg';
export type BadgeSize = 'xs' | 'sm' | 'md';
export type ItemSize = 'xs' | 'sm' | 'default';
export type ItemVariant = 'default' | 'outline' | 'muted';
export type FormControlSize = 'sm' | 'base' | 'lg';
export type FormLabelSize = 'xs' | 'sm' | 'base';
export type ButtonStyle = 'solid' | 'outline' | 'ghost';
export type ButtonSize =
    | 'xs'
    | 'sm'
    | 'default'
    | 'lg'
    | 'icon'
    | 'icon-xs'
    | 'icon-sm'
    | 'icon-lg';
export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';

/** ------------------------------------------------------------------ */
/*  Slices                                                              */
/** ------------------------------------------------------------------ */

/** ISO 4217 currency code. The library never enumerates currency codes —
 *  consumers pass any string they use (`'USD'`, `'EUR'`, `'BGN'`, …). */
export type CurrencyCode = string;

/** Minimal currency-amount shape rendered by `<MoneyDisplay>`. */
export interface CurrencyAmountData {
    amount: number;
    currency: CurrencyCode;
}

/** Money primitive — the library's local money shape. Consumers map their
 *  domain money/currency types into this at the call site. */
export interface MoneyData {
    amount: number;
    currency: CurrencyCode;
    /** Optional formatted/display string (when the consumer pre-formats). */
    formatted?: string;
}

/** A pair of money amounts (default + display) used by dual-pricing surfaces. */
export interface MoneyPairData {
    default: MoneyData;
    display?: MoneyData;
}

/** A pair of currency amounts (default + display). Same shape as `MoneyPairData`
 *  for callers that work with raw amount/currency tuples instead of wrapped Money. */
export interface CurrencyPairData {
    default: CurrencyAmountData;
    display?: CurrencyAmountData;
}

/** How `<MoneyDisplay>` renders the formatted amount. */
export type MoneyFormatMode =
    | 'decimal'
    | 'with_code'
    | 'with_symbol'
    | 'locale_aware';

/** Whether and how a secondary "display" currency is rendered next to the primary. */
export type MoneyDisplayMode = 'default_only' | 'dual' | 'dynamic';

/** Layout for the secondary "display" currency line/inline. */
export type MoneyDualLayout = 'inline' | 'lines';

export interface MoneyConfig {
    /** Default ISO 4217 code used when no currency is passed. */
    defaultCurrency?: string;
    /** Optional secondary currency rendered alongside the default. */
    displayCurrency?: string;
    /** BCP-47 locale used by Intl number formatters. */
    locale?: string;
    /** Whether to render a secondary "display" currency at all. */
    dualPricingEnabled?: boolean;
    /** Default-only / dual-always / dynamic (only when display ≠ default). */
    displayMode?: MoneyDisplayMode;
    /** Layout for the secondary currency. */
    dualPricingDisplay?: MoneyDualLayout;
    /** How the amount string is shaped. */
    formatMode?: MoneyFormatMode;
}

export interface DatesConfig {
    /** First day of the week for calendars / date pickers. 0=Sun … 6=Sat. */
    weekStartsOn?: WeekDay;
    /** Default `date-fns` format string for `<DateLabel>` and friends. */
    format?: string;
    /** BCP-47 locale used by Intl date formatters. */
    locale?: string;
    /** Optional consumer-supplied relative-time formatter (e.g. localized `formatDistanceToNow`). */
    formatRelativeTime?: (iso: string) => string;
}

export interface CommentsConfig {
    /** Default position of the composer relative to the timeline. */
    composerPosition?: 'top' | 'bottom';
    /** Maximum number of attachments per comment. `0` disables. */
    maxAttachments?: number;
    /** Whether reactions are rendered by default. Per-mount prop wins. */
    allowReactions?: boolean;
    /** Whether replies are rendered by default. */
    allowReplies?: boolean;
    /** Whether the attach-button is shown by default. */
    allowAttachments?: boolean;
}

export interface FiltersConfig {
    /** Debounce window for async/text facets, in ms. */
    debounceMs?: number;
    /** Default page size for paginated filter results. */
    defaultPageSize?: number;
}

export interface FormsConfigSlice {
    /** Default visual size for form controls (`<Input>`, `<Select>`, `<Textarea>`, `<Combobox>`). */
    defaultControlSize?: FormControlSize;
    /** Default visual size for `<Label>`. */
    defaultLabelSize?: FormLabelSize;
}

export interface TableConfig {
    /** Default `<DataTable>` row size — controls density + typography. */
    defaultSize?: TableSize;
}

export interface TypographyConfigSlice {
    /** Default `<Text>` size. */
    defaultTextSize?: TextSize;
}

export interface BadgeConfigSlice {
    /** Default `<Badge>` size. */
    defaultSize?: BadgeSize;
}

export interface ItemConfigSlice {
    /** Default `<Item>` size — drives `ItemGroup` density + media sizing. */
    defaultSize?: ItemSize;
    /** Default `<Item>` variant — `default` (no border) / `outline` / `muted`. */
    defaultVariant?: ItemVariant;
}

export interface ButtonConfigSlice {
    /** Default `<Button>` size. */
    defaultSize?: ButtonSize;
    /** Default `<Button>` styling. */
    defaultButtonStyle?: ButtonStyle;
}

export interface CardConfigSlice {
    /** Default `<SmartCard>` padding preset. */
    defaultPadding?: CardPadding;
}

export interface ToastConfig {
    /** Default toast lifetime in ms. */
    duration?: number;
    /** Default screen corner. */
    position?: ToastPosition;
}

export interface SpinnerConfigSlice {
    defaultVariant?: 'default' | 'shimmer' | 'progress';
}

export interface MediaConfig {
    /** Resolve an attachment-like input to a URL. Useful when the consumer
     *  stores S3/object-storage keys instead of full URLs. */
    resolveUrl?: (input: { key?: string; url?: string; [k: string]: unknown }) => string | undefined;
    /** Resolve the human-friendly name for an attachment-like input. */
    resolveName?: (input: { name?: string; key?: string; url?: string; [k: string]: unknown }) => string | undefined;
}

/** ------------------------------------------------------------------ */
/*  The full config tree                                                */
/** ------------------------------------------------------------------ */

export interface UIConfig {
    money?: MoneyConfig;
    dates?: DatesConfig;
    comments?: CommentsConfig;
    filters?: FiltersConfig;
    forms?: FormsConfigSlice;
    table?: TableConfig;
    typography?: TypographyConfigSlice;
    badge?: BadgeConfigSlice;
    item?: ItemConfigSlice;
    button?: ButtonConfigSlice;
    card?: CardConfigSlice;
    toast?: ToastConfig;
    spinner?: SpinnerConfigSlice;
    media?: MediaConfig;
}

/**
 * Resolved config — every slice is guaranteed-present (filled with defaults)
 * even if the consumer didn't pass it. This is what the store holds and what
 * selector hooks return.
 */
export type ResolvedUIConfig = {
    [K in keyof UIConfig]-?: NonNullable<UIConfig[K]>;
};
