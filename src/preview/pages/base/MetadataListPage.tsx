import { useState } from 'react';
import {
	BadgeCheck,
	Building2,
	CalendarDays,
	Check,
	Clock,
	Copy,
	CreditCard,
	ExternalLink,
	GitBranch,
	Globe,
	Hash,
	Mail,
	MapPin,
	Phone,
	ShieldCheck,
	Tag,
	User,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/base/display/avatar';
import { Badge } from '@/components/base/badge';
import { SmartCard } from '@/components/base/cards';
import { Text } from '@/components/typography';
import { MetadataList, type MetadataListItem } from '@/components/base/display/metadata/metadata-list';

import { PreviewPage, PreviewSection } from '../../PreviewLayout';

// ─── Helpers ────────────────────────────────────────────────────────────

function CopyableValue({ value, mono = true }: { value: string; mono?: boolean }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			onClick={() => {
				try { navigator.clipboard.writeText(value); } catch { /* ignore */ }
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			}}
			className="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 -ml-1 transition-colors hover:bg-muted/60"
			title="Copy to clipboard"
		>
			<Text tag="span" weight="medium" className={mono ? 'font-mono tabular-nums' : 'tabular-nums'}>{value}</Text>
			{copied ? (
				<Check className="size-3 text-success" aria-hidden="true" />
			) : (
				<Copy className="size-3 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
			)}
		</button>
	);
}

function PersonValue({ initials, name, sub }: { initials: string; name: string; sub?: string; src?: string }) {
	return (
		<span className="inline-flex items-center gap-2">
			<Avatar className="size-6">
				<AvatarFallback className="text-xxs font-semibold">{initials}</AvatarFallback>
			</Avatar>
			<span className="inline-flex flex-col leading-tight">
				<Text tag="span" weight="medium">{name}</Text>
				{!!sub && <Text tag="span" size="xxs" type="secondary">{sub}</Text>}
			</span>
		</span>
	);
}

// ─── Datasets ───────────────────────────────────────────────────────────

const SIMPLE_NO_ICONS: MetadataListItem[] = [
	{ id: 'name', label: 'Name', value: 'Sarah Smitha' },
	{ id: 'email', label: 'Email', value: 'maria@example.com' },
	{ id: 'role', label: 'Role', value: 'Workspace owner' },
	{ id: 'joined', label: 'Joined', value: 'March 14, 2025' },
	{ id: 'lastSeen', label: 'Last seen', value: '2 hours ago' },
	{ id: 'timezone', label: 'Timezone', value: 'Europe/New York (UTC+02:00)' },
];

const ENTITY_WITH_ICONS: MetadataListItem[] = [
	{ id: 'sku', label: 'SKU', icon: Hash, value: <CopyableValue value="SP-204-WL" />, tooltip: 'Internal stock-keeping unit' },
	{ id: 'category', label: 'Category', icon: Tag, value: <Badge variant="secondary">Wellness</Badge> },
	{ id: 'status', label: 'Status', icon: BadgeCheck, value: <Badge variant="success">Active</Badge> },
	{ id: 'created', label: 'Created', icon: CalendarDays, value: 'Apr 12, 2026' },
	{ id: 'updated', label: 'Last updated', icon: Clock, value: 'Apr 28, 2026 · 14:32' },
	{ id: 'version', label: 'Version', icon: GitBranch, value: <CopyableValue value="v3.2.1" /> },
];

const ROW_DETAIL: MetadataListItem[] = [
	{ id: 'id', label: 'Booking ID', value: <CopyableValue value="BKG-2026-0412" /> },
	{ id: 'customer', label: 'Customer', value: <PersonValue initials="MP" name="Sarah Smitha" sub="maria@example.com" /> },
	{ id: 'experience', label: 'Experience', value: 'Spa Day Voucher', description: 'Wellness · 90 minutes · 2 guests' },
	{ id: 'scheduled', label: 'Scheduled for', value: 'Apr 18, 2026 · 14:00', description: 'Confirmed by SMS' },
	{ id: 'status', label: 'Status', value: <Badge variant="success">Paid</Badge> },
	{ id: 'amount', label: 'Total', value: <Text tag="span" weight="semibold" className="tabular-nums">180.00 USD</Text> },
];

const RECEIPT_ROWS: MetadataListItem[] = [
	{ id: 'sub', label: 'Subtotal', value: '180.00 USD' },
	{ id: 'tax', label: 'VAT (20%)', value: '36.00 USD' },
	{ id: 'discount', label: 'Discount', value: <Text tag="span" weight="medium" type="success" className="tabular-nums">−25.00 USD</Text> },
	{ id: 'total', label: 'Total', value: <Text tag="span" weight="bold" className="tabular-nums">191.00 USD</Text> },
];

const CONTACT_META: MetadataListItem[] = [
	{ id: 'name', label: 'Name', icon: User, value: 'Sarah Smitha' },
	{ id: 'email', label: 'Email', icon: Mail, value: <CopyableValue value="maria@example.com" mono={false} /> },
	{ id: 'phone', label: 'Phone', icon: Phone, value: <CopyableValue value="+1 888 123 456" /> },
	{ id: 'address', label: 'Address', icon: MapPin, value: 'ul. Vitosha 24, New York 1000', description: 'USA' },
];

const PAYMENT_META: MetadataListItem[] = [
	{ id: 'card', label: 'Card', icon: CreditCard, value: 'Visa ending 4242' },
	{ id: 'billing', label: 'Billing address', icon: Building2, value: 'ul. Slavyanska 9, Los Angeles' },
	{ id: 'verified', label: 'Verified', icon: ShieldCheck, value: <Badge variant="success">Yes</Badge> },
];

const PILL_META: MetadataListItem[] = [
	{ id: 'created', label: 'Created', value: 'Apr 12, 2026' },
	{ id: 'by', label: 'By', value: 'Sarah P.' },
	{ id: 'version', label: 'Version', value: 'v3.2.1' },
	{ id: 'env', label: 'Env', value: 'production' },
];

const EMPTY_META: MetadataListItem[] = [
	{ id: 'sku', label: 'SKU', value: 'SP-204-WL' },
	{ id: 'isbn', label: 'ISBN', value: null, emptyLabel: 'Not assigned' },
	{ id: 'barcode', label: 'Barcode', value: undefined },
	{ id: 'website', label: 'Website', icon: Globe, render: () => (
		<a href="#" className="inline-flex items-center gap-1 text-primary hover:underline">
			<Text tag="span" weight="medium">example.com</Text>
			<ExternalLink className="size-3" aria-hidden="true" />
		</a>
	) },
];

const SHORT_PROFILE: MetadataListItem[] = [
	{ id: 'plan', label: 'Plan', value: 'Pro Annual' },
	{ id: 'seats', label: 'Seats', value: '12 / 50' },
	{ id: 'next', label: 'Next billing', value: 'May 12, 2026' },
];

export default function MetadataListPage() {
	return (
		<PreviewPage
			title="Features · Metadata list"
			description="Flexible label/value list for entity metadata. Three layouts (`vertical` grid · `horizontal` pills · `rows` two-column), per-item icons, tooltips, descriptions, and custom renderers — with first-class empty-state handling."
		>
			<PreviewSection title="API surface">
				<Text type="secondary">
					Each item: <code className="rounded bg-muted px-1 py-0.5 text-xs">{'{ id, label, value, icon?, tooltip?, description?, render?, emptyLabel? }'}</code>. List-level props: <code className="rounded bg-muted px-1 py-0.5 text-xs">layout</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">columns</code> (1–4), <code className="rounded bg-muted px-1 py-0.5 text-xs">dense</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">title</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">titleSeparator</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">separator</code>. Per-item <code className="rounded bg-muted px-1 py-0.5 text-xs">render</code> escapes the default rendering — perfect for status pills, copyable IDs, links, inline edits.
				</Text>
			</PreviewSection>

			{/* ── Clean, no icons — minimalist patterns ──────────────────── */}

			<PreviewSection title="Vertical · 2-column · no icons" span="full" description="The cleanest pattern — text-only labels above values, ideal for user-profile sidebars and account settings.">
				<SmartCard title="Account details" padding="base">
					<MetadataList items={SIMPLE_NO_ICONS} columns={2} />
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Vertical · single-column · no icons" description="Stacked label/value pairs for narrow side panels.">
				<div className="max-w-sm rounded-xl border border-border bg-card p-5">
					<MetadataList items={SIMPLE_NO_ICONS.slice(0, 4)} columns={1} />
				</div>
			</PreviewSection>

			{/* ── Rows layout — label left, value right ──────────────────── */}

			<PreviewSection title="Rows · two-column with hairlines" span="full" description="The new `layout='rows'` mode — label on the left, value on the right, divider between rows. The classic entity-detail pattern.">
				<SmartCard title="Booking #BKG-2026-0412" padding="base">
					<MetadataList items={ROW_DETAIL} layout="rows" />
				</SmartCard>
			</PreviewSection>

			<PreviewSection title="Rows · receipt-style" description="Tight `dense` rows — perfect for invoice / receipt summaries.">
				<div className="max-w-sm rounded-xl border border-border bg-card p-5">
					<MetadataList items={RECEIPT_ROWS} layout="rows" dense />
				</div>
			</PreviewSection>

			<PreviewSection title="Rows · with icons + tooltips" span="full" description="Same `rows` layout, with icons + tooltips on the labels.">
				<SmartCard title="Product details" padding="base">
					<MetadataList items={ENTITY_WITH_ICONS} layout="rows" />
				</SmartCard>
			</PreviewSection>

			{/* ── Sectioned multi-card ───────────────────────────────────── */}

			<PreviewSection title="Sectioned · multi-card" span="full" description="One MetadataList per logical group — great for long-form detail panels.">
				<div className="grid gap-4 lg:grid-cols-2">
					<SmartCard title="Customer">
						<MetadataList items={CONTACT_META} layout="rows" />
					</SmartCard>
					<SmartCard title="Payment">
						<MetadataList items={PAYMENT_META} layout="rows" />
					</SmartCard>
				</div>
			</PreviewSection>

			{/* ── Density showcase ────────────────────────────────────────── */}

			<PreviewSection title="Dense · 4-column overview" description="Tight grid for compact metadata strips at the top of detail screens.">
				<div className="rounded-xl border border-border bg-card p-5">
					<MetadataList items={ENTITY_WITH_ICONS} columns={4} dense />
				</div>
			</PreviewSection>

			<PreviewSection title="3-column · with icons">
				<div className="rounded-xl border border-border bg-card p-5">
					<MetadataList items={ENTITY_WITH_ICONS} columns={3} />
				</div>
			</PreviewSection>

			{/* ── Horizontal pills ────────────────────────────────────────── */}

			<PreviewSection title="Horizontal · pill summary" description="Inline label/value pairs separated by a glyph — header strips, breadcrumbs, footer accents.">
				<div className="space-y-3">
					<div className="rounded-lg border border-border bg-card px-4 py-3">
						<MetadataList items={PILL_META} layout="horizontal" separator="·" />
					</div>
					<div className="rounded-lg border border-border bg-card px-4 py-3">
						<MetadataList items={PILL_META} layout="horizontal" separator=":" itemSeparator />
					</div>
					<div className="rounded-lg bg-muted/30 px-4 py-3">
						<MetadataList items={SHORT_PROFILE} layout="horizontal" separator=":" itemSeparator="•" />
					</div>
				</div>
			</PreviewSection>

			{/* ── Title + separator ───────────────────────────────────────── */}

			<PreviewSection title="With title + separator">
				<MetadataList
					title="Inventory metadata"
					titleSeparator
					items={ENTITY_WITH_ICONS}
					columns={2}
				/>
			</PreviewSection>

			{/* ── Empty + custom renderers ────────────────────────────────── */}

			<PreviewSection title="Empty-state fallbacks + custom renderers" description="`emptyLabel` per item or list-level fallback for `null` / `undefined` values; `render` escapes the default rendering for any item.">
				<SmartCard title="Mixed" padding="base">
					<MetadataList items={EMPTY_META} layout="rows" />
				</SmartCard>
			</PreviewSection>
		</PreviewPage>
	);
}
