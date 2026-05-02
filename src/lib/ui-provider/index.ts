/**
 * UIProvider — single source of library-wide display defaults.
 *
 * Public surface (read-only):
 * - `<UIProvider config={{...}}>` — mount-once boundary; locks the store
 *   on first mount. Subsequent prop changes are ignored (warns in dev).
 * - `getUIConfig()` — read-only snapshot of the current resolved config.
 * - `useMoneyConfig` / `useDatesConfig` / … — slice-scoped reads inside
 *   components.
 *
 * Writers (`applyUIConfig`, `resetUIConfig`) are intentionally NOT
 * exported. The contract is: config is set once at app boot and cannot
 * be altered afterward. SSR/test bootstraps that genuinely need to seed
 * the store outside React import them directly from `./store`.
 *
 * Resolution rule everywhere:
 *     props.X  ??  useFooConfig().X  ??  hardcoded fallback
 *
 * What goes in here is **purely display defaults** (currency, week-start,
 * default sizes/paddings, app-wide formatters). Per-mount runtime
 * callbacks (`onSubmit`, `onChange`, …) and per-mount data (lists, item
 * arrays, registries used by one specific surface) stay as direct props.
 */
export { UIProvider, type UIProviderProps } from './provider';
export { getUIConfig } from './store';
export {
    useMoneyConfig,
    useDatesConfig,
    useCommentsConfig,
    useFiltersConfig,
    useFormsConfig,
    useTableConfig,
    useTypographyConfig,
    useBadgeConfig,
    useItemConfig,
    useButtonConfig,
    useCardConfig,
    useToastConfig,
    useSpinnerConfig,
    useMediaConfig,
} from './hooks';
export { DEFAULT_UI_CONFIG } from './defaults';
export type {
    UIConfig,
    ResolvedUIConfig,
    MoneyConfig,
    DatesConfig,
    CommentsConfig,
    FiltersConfig,
    FormsConfigSlice,
    TableConfig,
    TypographyConfigSlice,
    BadgeConfigSlice,
    ItemConfigSlice,
    ButtonConfigSlice,
    CardConfigSlice,
    ToastConfig,
    SpinnerConfigSlice,
    MediaConfig,
    WeekDay,
    TableSize,
    TextSize,
    CardPadding,
    BadgeSize,
    ItemSize,
    ItemVariant,
    FormControlSize,
    FormLabelSize,
    ButtonStyle,
    ButtonSize,
    ToastPosition,
    MoneyFormatMode,
    MoneyDisplayMode,
    MoneyDualLayout,
    CurrencyCode,
    CurrencyAmountData,
    MoneyData,
    MoneyPairData,
    CurrencyPairData,
} from './types';
