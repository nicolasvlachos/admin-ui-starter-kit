/**
 * Slice selector hooks.
 *
 * Each hook reads exactly one slice from the store. Components that only
 * care about `money` will not re-render when `dates` changes, etc.
 *
 * Every selector returns a guaranteed-populated slice (the store is
 * initialized with `DEFAULT_UI_CONFIG`), so component code can write:
 *
 *     const { defaultCurrency } = useMoneyConfig();
 *     const currency = props.currency ?? defaultCurrency;
 *
 * — no need to chain optional-access through the slice.
 */
import { useUIStore } from './store';
import type {
    BadgeConfigSlice,
    ButtonConfigSlice,
    CardConfigSlice,
    CommentsConfig,
    DatesConfig,
    FiltersConfig,
    FormsConfigSlice,
    ItemConfigSlice,
    MediaConfig,
    MoneyConfig,
    SpinnerConfigSlice,
    TableConfig,
    ToastConfig,
    TypographyConfigSlice,
} from './types';

export const useMoneyConfig = (): MoneyConfig =>
    useUIStore((s) => s.money);

export const useDatesConfig = (): DatesConfig =>
    useUIStore((s) => s.dates);

export const useCommentsConfig = (): CommentsConfig =>
    useUIStore((s) => s.comments);

export const useFiltersConfig = (): FiltersConfig =>
    useUIStore((s) => s.filters);

export const useFormsConfig = (): FormsConfigSlice =>
    useUIStore((s) => s.forms);

export const useTableConfig = (): TableConfig =>
    useUIStore((s) => s.table);

export const useTypographyConfig = (): TypographyConfigSlice =>
    useUIStore((s) => s.typography);

export const useBadgeConfig = (): BadgeConfigSlice =>
    useUIStore((s) => s.badge);

export const useItemConfig = (): ItemConfigSlice =>
    useUIStore((s) => s.item);

export const useButtonConfig = (): ButtonConfigSlice =>
    useUIStore((s) => s.button);

export const useCardConfig = (): CardConfigSlice =>
    useUIStore((s) => s.card);

export const useToastConfig = (): ToastConfig =>
    useUIStore((s) => s.toast);

export const useSpinnerConfig = (): SpinnerConfigSlice =>
    useUIStore((s) => s.spinner);

export const useMediaConfig = (): MediaConfig =>
    useUIStore((s) => s.media);
