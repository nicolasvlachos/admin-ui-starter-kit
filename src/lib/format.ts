/**
 * Shared formatting constants and helpers for display components.
 *
 * `EMPTY` — em-dash used as the canonical placeholder for missing/null values
 * across MoneyDisplay, EmailDisplay, PhoneDisplay, UrlDisplay, etc. Keeping it
 * centralised lets the library swap to "—" / "N/A" / locale-specific glyphs in
 * one place if needed.
 *
 * `formatCurrency` / `formatNumber` / `formatPercentage` / `formatDuration`
 * are thin wrappers around `Intl.NumberFormat` plus a duration helper. They
 * default to the user's resolved locale (`undefined` → system default) but
 * accept a `locale` override so callers can pin output for tests or
 * dual-currency UIs.
 */
export const EMPTY = '—';

/** @deprecated Use `EMPTY` instead. Kept for backwards compatibility. */
export const DEFAULT_EMPTY_LABEL = EMPTY;

export interface FormatNumberOptions {
	locale?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	notation?: Intl.NumberFormatOptions['notation'];
}

export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
	if (!Number.isFinite(value)) return EMPTY;
	const {
		locale,
		minimumFractionDigits,
		maximumFractionDigits,
		notation,
	} = options;
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits,
		maximumFractionDigits,
		notation,
	}).format(value);
}

export interface FormatCurrencyOptions extends FormatNumberOptions {
	currency?: string;
	currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
}

export function formatCurrency(value: number, options: FormatCurrencyOptions = {}): string {
	if (!Number.isFinite(value)) return EMPTY;
	const {
		locale,
		currency = 'EUR',
		currencyDisplay = 'symbol',
		minimumFractionDigits,
		maximumFractionDigits,
		notation,
	} = options;
	try {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			currencyDisplay,
			minimumFractionDigits,
			maximumFractionDigits,
			notation,
		}).format(value);
	} catch {
		// Unknown / unsupported currency code — fall back to plain number + code suffix.
		return `${formatNumber(value, options)} ${currency}`;
	}
}

export interface FormatPercentageOptions extends FormatNumberOptions {
	/** When true, treat `value` as already a percentage (e.g. 12.5 → "12.5%"). Default: false (0.125 → "12.5%"). */
	scaled?: boolean;
}

export function formatPercentage(value: number, options: FormatPercentageOptions = {}): string {
	if (!Number.isFinite(value)) return EMPTY;
	const { locale, minimumFractionDigits, maximumFractionDigits = 1, scaled = false } = options;
	const ratio = scaled ? value / 100 : value;
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(ratio);
}

/**
 * Format a duration given in **seconds** as a compact "HhMmSs" string. Drops
 * leading zero units, so 65 → "1m 5s", 3600 → "1h", 90061 → "1d 1h 1m 1s".
 * Negative values are rendered with a leading minus sign.
 */
export function formatDuration(seconds: number): string {
	if (!Number.isFinite(seconds)) return EMPTY;
	if (seconds === 0) return '0s';
	const negative = seconds < 0;
	let remaining = Math.round(Math.abs(seconds));
	const days = Math.floor(remaining / 86400);
	remaining -= days * 86400;
	const hours = Math.floor(remaining / 3600);
	remaining -= hours * 3600;
	const minutes = Math.floor(remaining / 60);
	const secs = remaining - minutes * 60;

	const parts: string[] = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

	return (negative ? '-' : '') + parts.join(' ');
}
