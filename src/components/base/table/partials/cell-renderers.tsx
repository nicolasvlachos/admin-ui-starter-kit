/**
 * Reusable cell renderers for DataTable columns.
 *
 * Use these from `column.cell` definitions to keep table preview pages and
 * production code consistent. Every renderer is presentational (no data
 * fetching) and accepts the value plus optional formatting hints.
 *
 *   { accessorKey: 'status', cell: ({ getValue }) => <StatusCell value={getValue()} map={STATUS_MAP} /> }
 *   { accessorKey: 'createdAt', cell: ({ getValue }) => <DateCell value={getValue()} /> }
 *   { accessorKey: 'amount', cell: ({ getValue }) => <CurrencyCell value={getValue()} currency="USD" /> }
 *   { accessorKey: 'owner', cell: ({ getValue }) => <AvatarCell name={getValue()} /> }
 */
import type { ComponentType, ReactNode } from 'react';
import { Calendar, Mail, type LucideIcon } from 'lucide-react';

import { Badge, type ComposedBadgeVariant } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { EMPTY } from '@/lib/format';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────────────────────
// StatusCell
// ──────────────────────────────────────────────────────────────

export interface StatusCellEntry {
	label: ReactNode;
	variant?: ComposedBadgeVariant;
	icon?: LucideIcon;
	dot?: boolean;
}

export interface StatusCellProps<TStatus extends string> {
	value?: TStatus | null;
	map: Record<TStatus, StatusCellEntry>;
	emptyLabel?: ReactNode;
	className?: string;
}

export function StatusCell<TStatus extends string>({
	value,
	map,
	emptyLabel = EMPTY,
	className,
}: StatusCellProps<TStatus>) {
	if (!value || !(value in map)) {
		return (
			<Text size="inherit" type="secondary" className={cn('opacity-60', className)}>
				{emptyLabel}
			</Text>
		);
	}
	const entry = map[value];
	const Icon = entry.icon;
	return (
		<Badge
			variant={entry.variant ?? 'secondary'}
			className={cn('gap-1.5', className)}
		>
			{!!Icon && <Icon className="size-3" />}
			{entry.label}
		</Badge>
	);
}

StatusCell.displayName = 'StatusCell';

// ──────────────────────────────────────────────────────────────
// DateCell
// ──────────────────────────────────────────────────────────────

export interface DateCellProps {
	value?: string | number | Date | null;
	/** A Intl.DateTimeFormatOptions preset. Default: short month + day + year. */
	options?: Intl.DateTimeFormatOptions;
	locale?: string;
	showIcon?: boolean;
	icon?: ComponentType<{ className?: string }>;
	emptyLabel?: ReactNode;
	className?: string;
}

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
};

export function DateCell({
	value,
	options = DEFAULT_DATE_OPTIONS,
	locale,
	showIcon = true,
	icon: IconComponent = Calendar,
	emptyLabel = EMPTY,
	className,
}: DateCellProps) {
	if (value === null || value === undefined || value === '') {
		return (
			<Text size="inherit" type="secondary" className={cn('opacity-60', className)}>
				{emptyLabel}
			</Text>
		);
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return (
			<Text size="inherit" type="secondary" className={cn('opacity-60', className)}>
				{emptyLabel}
			</Text>
		);
	}
	const formatter = new Intl.DateTimeFormat(locale, options);
	return (
		<span className={cn('inline-flex items-center gap-1.5 tabular-nums', className)}>
			{!!showIcon && <IconComponent className="size-3.5 text-muted-foreground" />}
			<Text size="inherit" type="secondary">
				{formatter.format(date)}
			</Text>
		</span>
	);
}

DateCell.displayName = 'DateCell';

// ──────────────────────────────────────────────────────────────
// CurrencyCell
// ──────────────────────────────────────────────────────────────

export interface CurrencyCellProps {
	value?: number | string | null;
	currency?: string;
	locale?: string;
	emptyLabel?: ReactNode;
	className?: string;
	weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export function CurrencyCell({
	value,
	currency,
	locale,
	emptyLabel = EMPTY,
	className,
	weight = 'semibold',
}: CurrencyCellProps) {
	const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
	if (!Number.isFinite(numeric)) {
		return (
			<Text size="inherit" type="secondary" className={cn('opacity-60', className)}>
				{emptyLabel}
			</Text>
		);
	}
	const formatted = currency
		? new Intl.NumberFormat(locale, {
				style: 'currency',
				currency,
				maximumFractionDigits: 2,
			}).format(numeric)
		: numeric.toFixed(2);
	return (
		<Text
			tag="span"
			size="inherit"
			weight={weight}
			className={cn('tabular-nums', className)}
		>
			{formatted}
		</Text>
	);
}

CurrencyCell.displayName = 'CurrencyCell';

// ──────────────────────────────────────────────────────────────
// AvatarCell
// ──────────────────────────────────────────────────────────────

export interface AvatarCellProps {
	name?: string | null;
	imageUrl?: string;
	icon?: ComponentType<{ className?: string }>;
	subtitle?: ReactNode;
	emptyLabel?: ReactNode;
	className?: string;
}

function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]!.toUpperCase())
		.join('');
}

export function AvatarCell({
	name,
	imageUrl,
	icon: IconComponent = Mail,
	subtitle,
	emptyLabel = EMPTY,
	className,
}: AvatarCellProps) {
	if (!name || name.trim().length === 0) {
		return (
			<Text size="inherit" type="secondary" className={cn('opacity-60', className)}>
				{emptyLabel}
			</Text>
		);
	}
	return (
		<span className={cn('inline-flex items-center gap-2', className)}>
			<span className="relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
				{imageUrl ? (
					<img src={imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
				) : name.length > 0 ? (
					<Text size="xs" weight="semibold" className="leading-none">
						{getInitials(name)}
					</Text>
				) : (
					<IconComponent className="size-3.5" />
				)}
			</span>
			<span className="min-w-0 inline-flex flex-col">
				<Text size="inherit" weight="medium" className="truncate">
					{name}
				</Text>
				{!!subtitle && (
					<Text size="xs" type="secondary" className="truncate">
						{subtitle}
					</Text>
				)}
			</span>
		</span>
	);
}

AvatarCell.displayName = 'AvatarCell';
