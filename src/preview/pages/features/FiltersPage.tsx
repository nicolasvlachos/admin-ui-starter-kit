import { useState } from 'react';
import {
	BadgeCheck,
	CalendarDays,
	CheckCircle2,
	CircleAlert,
	CircleDollarSign,
	CircleDot,
	Globe2,
	Hash,
	Hourglass,
	MapPin,
	Package,
	Smartphone,
	Tag,
	Truck,
	XCircle,
} from 'lucide-react';

import {
	type ActiveFilter,
	type FilterConfig,
	FilterLayout,
	FilterProvider,
	FilterType,
	FilterOperatorEnum,
} from '@/components/features/filters';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

// ─── Filter configurations ──────────────────────────────────────────────

const STATUS_OPTIONS = [
	{ label: 'Pending', value: 'pending', icon: null },
	{ label: 'Paid', value: 'paid', icon: null },
	{ label: 'Fulfilled', value: 'fulfilled', icon: null },
	{ label: 'Shipped', value: 'shipped', icon: null },
	{ label: 'Cancelled', value: 'cancelled', icon: null },
];

const CHANNEL_OPTIONS = [
	{ label: 'Web', value: 'web', icon: null },
	{ label: 'Mobile', value: 'mobile', icon: null },
	{ label: 'POS', value: 'pos', icon: null },
	{ label: 'API', value: 'api', icon: null },
];

const COUNTRY_OPTIONS = [
	{ label: 'USA', value: 'bg', icon: null },
	{ label: 'Romania', value: 'ro', icon: null },
	{ label: 'Greece', value: 'gr', icon: null },
	{ label: 'Serbia', value: 'rs', icon: null },
	{ label: 'North Macedonia', value: 'mk', icon: null },
];

const FULL_FILTERS: FilterConfig[] = [
	{
		key: 'q',
		label: 'Search',
		type: FilterType.SEARCH,
		placeholder: 'Search bookings, customer name, voucher code…',
		icon: null,
		displayConfig: { display: 'always' },
	},
	{
		key: 'status',
		label: 'Status',
		type: FilterType.MULTI_SELECT,
		icon: <BadgeCheck className="size-4" />,
		displayConfig: { display: 'always' },
		options: STATUS_OPTIONS,
	},
	{
		key: 'channel',
		label: 'Channel',
		type: FilterType.SELECT,
		icon: <Globe2 className="size-4" />,
		displayConfig: { display: 'collapsed' },
		options: CHANNEL_OPTIONS,
	},
	{
		key: 'country',
		label: 'Country',
		type: FilterType.MULTI_SELECT,
		icon: <MapPin className="size-4" />,
		displayConfig: { display: 'collapsed' },
		options: COUNTRY_OPTIONS,
	},
	{
		key: 'created_at',
		label: 'Created',
		type: FilterType.DATE,
		icon: <CalendarDays className="size-4" />,
		displayConfig: { display: 'collapsed' },
	},
	{
		key: 'amount',
		label: 'Amount',
		type: FilterType.RANGE,
		icon: <CircleDollarSign className="size-4" />,
		displayConfig: { display: 'collapsed' },
		validation: { min: 0, max: 5000 },
	},
	{
		key: 'tags',
		label: 'Tags',
		type: FilterType.TAGS,
		icon: <Tag className="size-4" />,
		displayConfig: { display: 'collapsed' },
	},
];

const COMPACT_FILTERS: FilterConfig[] = [
	{
		key: 'q',
		label: 'Search',
		type: FilterType.SEARCH,
		placeholder: 'Search products…',
		icon: null,
		displayConfig: { display: 'always' },
	},
	{
		key: 'category',
		label: 'Category',
		type: FilterType.SELECT,
		icon: <Tag className="size-4" />,
		displayConfig: { display: 'always' },
		options: [
			{ label: 'Wellness', value: 'wellness', icon: null },
			{ label: 'Adventure', value: 'adventure', icon: null },
			{ label: 'Food & Drink', value: 'food', icon: null },
		],
	},
	{
		key: 'in_stock',
		label: 'In stock',
		type: FilterType.SELECT,
		icon: <Package className="size-4" />,
		displayConfig: { display: 'always' },
		options: [
			{ label: 'Yes', value: 'true', icon: null },
			{ label: 'No', value: 'false', icon: null },
		],
	},
];

const TABBED_FILTERS: FilterConfig[] = [
	{
		key: 'q',
		label: 'Search',
		type: FilterType.SEARCH,
		placeholder: 'Search bookings…',
		icon: null,
		displayConfig: { display: 'always' },
	},
	{
		key: 'status',
		label: 'Status',
		type: FilterType.MULTI_SELECT,
		icon: <BadgeCheck className="size-4" />,
		displayConfig: { display: 'always' },
		options: STATUS_OPTIONS,
	},
	{
		key: 'channel',
		label: 'Channel',
		type: FilterType.SELECT,
		icon: <Globe2 className="size-4" />,
		displayConfig: { display: 'collapsed' },
		options: CHANNEL_OPTIONS,
	},
	{
		key: 'created_at',
		label: 'Created',
		type: FilterType.DATE,
		icon: <CalendarDays className="size-4" />,
		displayConfig: { display: 'collapsed' },
	},
];

// ─── Helpers ───────────────────────────────────────────────────────────

interface PlaygroundProps {
	filters: FilterConfig[];
	initial?: ActiveFilter[];
	variant?: 'default' | 'compact';
	tabs?: {
		id: string;
		label: string;
		presets: { key: string; value: string[]; operator?: import('@/components/features/filters').FilterOperator }[];
		count?: number;
	}[];
	showState?: boolean;
}

function FilterPlayground({
	filters,
	initial = [],
	variant = 'default',
	tabs,
	showState = true,
}: PlaygroundProps) {
	const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(initial);

	return (
		<FilterProvider filters={filters} activeFilters={activeFilters} onFilterChange={setActiveFilters}>
			<div className="space-y-3">
				<FilterLayout showClearFilters variant={variant} tabs={tabs} />
				{!!showState && (
					<details className="group" open={activeFilters.length > 0}>
						<summary className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors select-none">
							<Hash className="size-3" aria-hidden="true" />
							<span className="uppercase tracking-wider font-medium">Active state</span>
							<span className="rounded-full bg-muted/60 px-1.5 py-0.5 text-xxs tabular-nums">{activeFilters.length}</span>
						</summary>
						<pre className="mt-2 overflow-x-auto rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs leading-relaxed font-mono">
							{JSON.stringify(activeFilters, null, 2)}
						</pre>
					</details>
				)}
			</div>
		</FilterProvider>
	);
}

function PatternGrid({ children }: { children: React.ReactNode }) {
	return <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{children}</div>;
}

function PatternRow({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
	return (
		<div className={cn('rounded-xl border border-border bg-card p-4', className)}>
			<div className="mb-3">
				<Text size="xs" weight="semibold" className="uppercase tracking-wider text-muted-foreground">
					{title}
				</Text>
				{!!description && (
					<Text size="xs" type="secondary" className="mt-0.5">{description}</Text>
				)}
			</div>
			{children}
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function FiltersPage() {
	return (
		<PreviewPage
			title="Features · Filters"
			description="Composable filter system. Search + multi-select stay always visible; the rest collapse behind a Filters button. Date / range / tags / async-select facets included. Active filters surface as removable pills with operator selectors. Provider-driven so it works with any data source."
		>
			<PreviewSection title="API surface">
				<Text type="secondary">
					Wrap consumer pages in <code className="rounded bg-muted px-1 py-0.5 text-xs">FilterProvider</code> with <code className="rounded bg-muted px-1 py-0.5 text-xs">{'filters / activeFilters / onFilterChange'}</code>. Drop <code className="rounded bg-muted px-1 py-0.5 text-xs">{'<FilterLayout />'}</code> wherever you want the strip. Each <code className="rounded bg-muted px-1 py-0.5 text-xs">FilterConfig</code> declares its <code className="rounded bg-muted px-1 py-0.5 text-xs">type</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">displayConfig.display</code> (<code className="rounded bg-muted px-1 py-0.5 text-xs">always</code> or <code className="rounded bg-muted px-1 py-0.5 text-xs">collapsed</code>), and optional <code className="rounded bg-muted px-1 py-0.5 text-xs">{'options / icon / placeholder / validation'}</code>.
				</Text>
			</PreviewSection>

			{/* ── Default — empty state ─────────────────────────────────── */}

			<PreviewSection title="Default · empty" span="full" description="No active filters — just the always-visible search + multi-select and the Filters button.">
				<FilterPlayground filters={FULL_FILTERS} />
			</PreviewSection>

			{/* ── With pre-applied filters ─────────────────────────────── */}

			<PreviewSection title="With pre-applied filters" span="full" description="Initial state seeded with two filters; pills surface inline with operator selectors and an X to remove. The Clear filters action sits on the trailing edge.">
				<FilterPlayground
					filters={FULL_FILTERS}
					initial={[
						{ id: 'status', key: 'status', value: ['paid', 'fulfilled'], operator: FilterOperatorEnum.IN },
						{ id: 'channel', key: 'channel', value: ['web'], operator: FilterOperatorEnum.EQUALS },
					]}
				/>
			</PreviewSection>

			{/* ── Compact layout ───────────────────────────────────────── */}

			<PreviewSection title="Compact variant" span="full" description="`variant='compact'` tightens the cell heights and gaps for use inside dense tables / sidebars.">
				<FilterPlayground filters={COMPACT_FILTERS} variant="compact" />
			</PreviewSection>

			{/* ── With tabs ────────────────────────────────────────────── */}

			<PreviewSection title="With filter tabs (presets)" span="full" description="`tabs` accepts a list of saved-view presets — like Shopify's All / Active / Closed segments. Selecting a tab swaps the active-filter set in one click.">
				<FilterPlayground
					filters={TABBED_FILTERS}
					tabs={[
						{ id: 'all', label: 'All', presets: [] },
						{ id: 'paid', label: 'Paid', presets: [{ key: 'status', value: ['paid'], operator: FilterOperatorEnum.IN }] },
						{ id: 'pending', label: 'Pending', presets: [{ key: 'status', value: ['pending'], operator: FilterOperatorEnum.IN }] },
						{ id: 'web', label: 'Web channel', presets: [{ key: 'channel', value: ['web'], operator: FilterOperatorEnum.EQUALS }] },
					]}
				/>
			</PreviewSection>

			{/* ── Filter type matrix ────────────────────────────────────── */}

			<PreviewSection title="Filter types · individually" span="full" description="Each row shows one filter type in isolation so you can compare the popover content + active-pill rendering side by side.">
				<PatternGrid>
					<PatternRow title="MULTI_SELECT" description="Checkboxes with inline search, selected count badge.">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'status', label: 'Status', type: FilterType.MULTI_SELECT, icon: <BadgeCheck className="size-4" />, displayConfig: { display: 'always' }, options: STATUS_OPTIONS },
							]}
							showState={false}
						/>
					</PatternRow>

					<PatternRow title="SELECT (single)" description="Radio-style — one option at a time.">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'channel', label: 'Channel', type: FilterType.SELECT, icon: <Globe2 className="size-4" />, displayConfig: { display: 'always' }, options: CHANNEL_OPTIONS },
							]}
							showState={false}
						/>
					</PatternRow>

					<PatternRow title="DATE" description="Range picker with shortcuts (Today, Last 7 days, This month…).">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'created_at', label: 'Created', type: FilterType.DATE, icon: <CalendarDays className="size-4" />, displayConfig: { display: 'always' } },
							]}
							showState={false}
						/>
					</PatternRow>

					<PatternRow title="RANGE" description="Min / max numeric range with validation bounds.">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'amount', label: 'Amount', type: FilterType.RANGE, icon: <CircleDollarSign className="size-4" />, displayConfig: { display: 'always' }, validation: { min: 0, max: 5000 } },
							]}
							showState={false}
						/>
					</PatternRow>

					<PatternRow title="TAGS" description="Free-form tag input — add / remove on Enter.">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'tags', label: 'Tags', type: FilterType.TAGS, icon: <Tag className="size-4" />, displayConfig: { display: 'always' } },
							]}
							showState={false}
						/>
					</PatternRow>

					<PatternRow title="Operator selector" description="Change `equals` → `not in` etc. directly from the active pill.">
						<FilterPlayground
							filters={[
								{ key: 'q', label: 'Search', type: FilterType.SEARCH, icon: null, displayConfig: { display: 'always' } },
								{ key: 'status', label: 'Status', type: FilterType.MULTI_SELECT, icon: <BadgeCheck className="size-4" />, displayConfig: { display: 'always' }, options: STATUS_OPTIONS },
							]}
							initial={[{ id: 'status', key: 'status', value: ['paid'], operator: FilterOperatorEnum.IN }]}
							showState={false}
						/>
					</PatternRow>
				</PatternGrid>
			</PreviewSection>

			{/* ── Rich items (icons + descriptions) ──────────────────────── */}

			<PreviewSection
				title="Rich options · icons + descriptions"
				span="full"
				description="Each `FilterOption` accepts `icon` and `description`. The popover renders icon on the left, label as the primary line, and description as a secondary line below — matching the FilterListItem pattern in the Filters menu."
			>
				<FilterPlayground
					filters={[
						{
							key: 'q',
							label: 'Search',
							type: FilterType.SEARCH,
							placeholder: 'Search orders…',
							icon: null,
							displayConfig: { display: 'always' },
						},
						{
							key: 'status',
							label: 'Status',
							type: FilterType.MULTI_SELECT,
							icon: <BadgeCheck className="size-4" />,
							displayConfig: { display: 'always' },
							options: [
								{ label: 'Pending', value: 'pending', icon: <Hourglass className="size-3.5" />, description: 'Awaiting payment' },
								{ label: 'Paid', value: 'paid', icon: <CheckCircle2 className="size-3.5" />, description: 'Payment captured' },
								{ label: 'Fulfilled', value: 'fulfilled', icon: <Package className="size-3.5" />, description: 'Items packed and ready' },
								{ label: 'Shipped', value: 'shipped', icon: <Truck className="size-3.5" />, description: 'In transit to customer' },
								{ label: 'Cancelled', value: 'cancelled', icon: <XCircle className="size-3.5" />, description: 'Order voided', disabled: true },
							],
						},
						{
							key: 'channel',
							label: 'Channel',
							type: FilterType.SELECT,
							icon: <Globe2 className="size-4" />,
							displayConfig: { display: 'always' },
							options: [
								{ label: 'Web', value: 'web', icon: <Globe2 className="size-3.5" />, description: 'Customer-facing storefront' },
								{ label: 'Mobile', value: 'mobile', icon: <Smartphone className="size-3.5" />, description: 'iOS / Android app' },
								{ label: 'POS', value: 'pos', icon: <CircleDot className="size-3.5" />, description: 'In-store point of sale' },
								{ label: 'API', value: 'api', icon: <CircleAlert className="size-3.5" />, description: 'Programmatic / partner integration' },
							],
						},
					]}
					initial={[
						{ id: 'status', key: 'status', value: ['paid'], operator: FilterOperatorEnum.IN },
					]}
				/>
			</PreviewSection>

			<PreviewSection
				title="Rich options · icon-only (no description)"
				span="full"
				description="When options provide an icon but no description, rows stay compact — single-line items with leading icon."
			>
				<FilterPlayground
					filters={[
						{
							key: 'q',
							label: 'Search',
							type: FilterType.SEARCH,
							placeholder: 'Search…',
							icon: null,
							displayConfig: { display: 'always' },
						},
						{
							key: 'status',
							label: 'Status',
							type: FilterType.MULTI_SELECT,
							icon: <BadgeCheck className="size-4" />,
							displayConfig: { display: 'always' },
							options: [
								{ label: 'Pending', value: 'pending', icon: <Hourglass className="size-3.5" /> },
								{ label: 'Paid', value: 'paid', icon: <CheckCircle2 className="size-3.5" /> },
								{ label: 'Shipped', value: 'shipped', icon: <Truck className="size-3.5" /> },
								{ label: 'Cancelled', value: 'cancelled', icon: <XCircle className="size-3.5" /> },
							],
						},
					]}
					showState={false}
				/>
			</PreviewSection>
		</PreviewPage>
	);
}
