/**
 * VendorProfileCard — vendor avatar, name, role, verified badge, earnings,
 * and a pill-tab switcher between Overview (metrics list) and Stats (small
 * KPI grid). Trailing Message / Hire actions. Strings are overridable for
 * i18n via the `strings` prop.
 *
 * Avatar sits BESIDE the name (not above) so the header row reads as a
 * cohesive identity block rather than a floating icon over a separate text
 * block. The card uses a custom layout instead of SmartCard's slot system to
 * keep the tab switcher / earnings hero / metrics grid / actions footer
 * arranged in a tighter visual rhythm.
 */
import { useState } from 'react';
import { Check, ChevronRight, MessageSquare } from 'lucide-react';

import { Button } from '@/components/base/buttons';
import Heading from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { IconBadge, InlineStat } from '@/components/base/display';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/base/item';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { defaultVendorProfileStrings, type VendorProfileCardProps } from './types';

export function VendorProfileCard({
	name,
	initials,
	avatarUrl,
	role,
	verified = false,
	earnings,
	earningsChange,
	metrics = [],
	stats = [],
	onMessage,
	onHire,
	className,
	strings: stringsProp,
}: VendorProfileCardProps) {
	const strings = useStrings(defaultVendorProfileStrings, stringsProp);
	const [tab, setTab] = useState<'overview' | 'stats'>('overview');

	const displayInitials =
		initials ?? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

	const tabLabel: Record<'overview' | 'stats', string> = {
		overview: strings.tabOverview,
		stats: strings.tabStats,
	};

	return (
		<div
			className={cn('vendor-profile--component', 
				'flex flex-col gap-5 rounded-xl border border-border bg-gradient-to-b from-muted/30 to-card p-5 shadow-sm',
				className,
			)}
		>
			<Item size="default" className="px-0 items-start">
				<ItemMedia variant={avatarUrl ? 'avatar' : 'default'}>
					{avatarUrl ? (
						<img
							src={avatarUrl}
							alt={name}
							className="size-12 rounded-full object-cover ring-2 ring-border"
						/>
					) : (
						<IconBadge tone="primary" size="lg" className="font-semibold ring-2 ring-primary/15">
							{displayInitials}
						</IconBadge>
					)}
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="text-base">
						<Heading tag="h4" className="border-none p-0 text-base font-semibold tracking-tight">
							{name}
						</Heading>
						{!!verified && (
							<IconBadge tone="success" solid size="xs" aria-label={strings.verifiedAriaLabel} className="size-4">
								<Check className="size-2.5" strokeWidth={3} />
							</IconBadge>
						)}
					</ItemTitle>
					{!!role && <ItemDescription clamp={2}>{role}</ItemDescription>}
				</ItemContent>
			</Item>

			{/* Pill tab switcher */}
			<div className="flex gap-1 rounded-full bg-muted/60 p-1">
				{(['overview', 'stats'] as const).map((t) => (
					<button
						key={t}
						type="button"
						aria-pressed={tab === t}
						onClick={() => setTab(t)}
						className={cn(
							'flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
							tab === t
								? 'bg-card text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground',
						)}
					>
						{tabLabel[t]}
					</button>
				))}
			</div>

			{tab === 'overview' ? (
				<div className="space-y-4">
					{!!earnings && (
						<div>
							<Text
								size="xxs"
								type="secondary"
								weight="medium"
								className="uppercase tracking-wider"
							>
								{strings.totalEarnings}
							</Text>
							<div className="mt-0.5 flex items-baseline gap-2">
								<Heading tag="h3" className="text-3xl tabular-nums tracking-tight border-none pb-0">
									{earnings}
								</Heading>
								{!!earningsChange && (
									<Text
										tag="span"
										size="xs"
										weight="semibold"
										className="rounded-full bg-success/15 px-1.5 py-0.5 text-success tabular-nums"
									>
										{earningsChange}
									</Text>
								)}
							</div>
						</div>
					)}

					{metrics.length > 0 && (
						<div className="space-y-2">
							{metrics.map((metric) => (
								<InlineStat
									key={metric.label}
									className="border-b border-border/50 pb-2 last:border-0"
									label={metric.label}
									value={metric.value}
									mono
									labelClassName="text-sm"
									valueClassName="text-sm font-semibold"
								/>
							))}
						</div>
					)}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
						>
							<Text
								size="xxs"
								type="secondary"
								weight="medium"
								className="uppercase tracking-wider"
							>
								{stat.label}
							</Text>
							<div className="mt-1 flex items-baseline gap-1.5">
								<Text size="base" weight="semibold" className="tabular-nums">
									{stat.value}
								</Text>
								{!!stat.change && (
									<Text
										tag="span"
										size="xxs"
										weight="semibold"
										className={cn(
											'rounded-full px-1.5 py-0.5 tabular-nums',
											stat.change.startsWith('+')
												? 'bg-success/15 text-success'
												: 'bg-destructive/15 text-destructive',
										)}
									>
										{stat.change}
									</Text>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			<div className="flex gap-2">
				<Button
					variant="light"
					buttonStyle="outline"
					className="flex-1 rounded-xl"
					onClick={onMessage}
				>
					<MessageSquare className="mr-1.5 size-3.5" />
					{strings.message}
				</Button>
				<Button
					variant="dark"
					className="flex-1 rounded-xl"
					onClick={onHire}
				>
					{strings.hire}
					<ChevronRight className="ml-1 size-3.5" />
				</Button>
			</div>
		</div>
	);
}

VendorProfileCard.displayName = 'VendorProfileCard';
