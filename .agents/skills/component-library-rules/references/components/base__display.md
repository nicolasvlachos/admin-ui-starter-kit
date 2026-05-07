---
id: base/display
title: "Display"
description: "The display layer — Avatar, IconBadge, InlineStat, Tooltip, Separator, NotificationBanner, BooleanIndicator, ShowIf, ThrottleAlert, VisuallyHidden, PlaceholderPattern."
layer: base
family: "Display"
sourcePath: src/components/base/display
examples:
  - NotificationBannerVariants
  - AvatarSizes
  - StackedAvatarsExample
  - IconBadgeTones
  - IconBadgeShapes
  - IconBadgeSizes
  - InlineStatLayouts
  - SeparatorExample
  - TooltipExample
  - BooleanIndicatorExample
  - ShowIfExample
  - ThrottleAlertExample
  - VisuallyHiddenExample
  - PlaceholderPatternExample
  - AlertExample
  - ProgressExample
  - SkeletonExample
  - CollapsibleExample
  - DialogExample
  - DateBlockExample
  - MoneyDisplayExample
  - QRCodeExample
  - RealisticUserCard
imports:
  - @/components/base/buttons
  - @/components/base/display/alert
  - @/components/base/display/boolean-indicator
  - @/components/base/display/collapsible
  - @/components/base/display/date-block
  - @/components/base/display/dialog
  - @/components/base/display/icon-badge
  - @/components/base/display/inline-stat
  - @/components/base/display/money-display
  - @/components/base/display/notification-banner
  - @/components/base/display/placeholder-pattern
  - @/components/base/display/progress
  - @/components/base/display/qr-code
  - @/components/base/display/show-if
  - @/components/base/display/skeleton
  - @/components/base/display/stacked-avatars
  - @/components/base/display/throttle-alert
  - @/components/base/display/visually-hidden
  - @/components/typography/text
  - @/components/ui/avatar
  - @/components/ui/separator
  - @/components/ui/tooltip
tags:
  - base
  - display
  - layer
  - avatar
  - iconbadge
  - inlinestat
---

# Display

The display layer — Avatar, IconBadge, InlineStat, Tooltip, Separator, NotificationBanner, BooleanIndicator, ShowIf, ThrottleAlert, VisuallyHidden, PlaceholderPattern.

**Layer:** `base`  
**Source:** `src/components/base/display`

## Examples

```tsx
import { useState } from 'react';
import { AlertTriangle, Bell, ChevronDown, Sparkles, Terminal, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BooleanIndicator } from '@/components/base/display/boolean-indicator';
import { IconBadge } from '@/components/base/display/icon-badge';
import { InlineStat } from '@/components/base/display/inline-stat';
import { NotificationBanner } from '@/components/base/display/notification-banner';
import { PlaceholderPattern } from '@/components/base/display/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import { ShowIf } from '@/components/base/display/show-if';
import { StackedAvatars } from '@/components/base/display/stacked-avatars';
import { ThrottleAlert } from '@/components/base/display/throttle-alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VisuallyHidden } from '@/components/base/display/visually-hidden';
import { Alert, AlertTitle, AlertDescription } from '@/components/base/display/alert';
import { Progress } from '@/components/base/display/progress';
import { Skeleton } from '@/components/base/display/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/base/display/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/base/display/dialog';
import { DateBlock } from '@/components/base/display/date-block';
import { MoneyDisplay } from '@/components/base/display/money-display';
import { QRCode } from '@/components/base/display/qr-code';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography/text';
import { MOCK_CUSTOMERS } from '@/preview/_mocks';

export function NotificationBannerVariants() {
	return (
		<div className="flex flex-col gap-3 w-full max-w-md">
			<NotificationBanner type="info" title="Heads up" message="An informational notice." />
			<NotificationBanner type="success" title="Saved" message="All changes have been saved." />
			<NotificationBanner type="warning" title="Be careful" message="This will affect 24 records." />
			<NotificationBanner
				type="error"
				title="Failed"
				message="Something went wrong."
				dismissible
				onDismiss={() => {}}
			/>
		</div>
	);
}

export function AvatarSizes() {
	return (
		<div className="flex items-end gap-3">
			<Avatar className="size-6">
				<AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" />
				<AvatarFallback>SS</AvatarFallback>
			</Avatar>
			<Avatar className="size-8">
				<AvatarFallback>ML</AvatarFallback>
			</Avatar>
			<Avatar className="size-10">
				<AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=aiko" />
				<AvatarFallback>AT</AvatarFallback>
			</Avatar>
			<Avatar className="size-14">
				<AvatarFallback>DR</AvatarFallback>
			</Avatar>
		</div>
	);
}

export function StackedAvatarsExample() {
	return (
		<StackedAvatars
			users={MOCK_CUSTOMERS.slice(0, 5).map((c) => ({
				id: c.id,
				name: c.name,
				avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatarSeed}`,
			}))}
			max={3}
		/>
	);
}

export function IconBadgeTones() {
	const tones = ['primary', 'secondary', 'success', 'warning', 'destructive', 'info', 'muted'] as const;
	return (
		<div className="flex flex-wrap items-center gap-2">
			{tones.map((tone) => (
				<IconBadge key={tone} icon={Sparkles} tone={tone} />
			))}
		</div>
	);
}

export function IconBadgeShapes() {
	return (
		<div className="flex items-center gap-3">
			<IconBadge icon={Sparkles} shape="circle" />
			<IconBadge icon={Sparkles} shape="square" />
			<IconBadge icon={Sparkles} shape="circle" solid tone="primary" />
			<IconBadge icon={Sparkles} shape="square" solid tone="success" />
			<IconBadge icon={Sparkles} bordered />
		</div>
	);
}

export function IconBadgeSizes() {
	return (
		<div className="flex items-center gap-3">
			<IconBadge icon={Bell} size="xs" />
			<IconBadge icon={Bell} size="sm" />
			<IconBadge icon={Bell} size="md" />
			<IconBadge icon={Bell} size="lg" />
		</div>
	);
}

export function InlineStatLayouts() {
	return (
		<div className="flex flex-col gap-3 w-full max-w-md">
			<InlineStat label="Total spent" value="$12,450" mono />
			<InlineStat layout="inline" label="Status:" value="Active" />
			<InlineStat layout="stacked" label="Last seen" value="3 hours ago" />
		</div>
	);
}

export function SeparatorExample() {
	return (
		<div className="w-full max-w-md">
			<div className="text-sm">Section above</div>
			<Separator className="my-3" />
			<div className="text-sm">Section below</div>
			<div className="mt-4 flex h-6 items-center gap-2 text-sm">
				<span>Inline</span>
				<Separator orientation="vertical" />
				<span>Items</span>
				<Separator orientation="vertical" />
				<span>Here</span>
			</div>
		</div>
	);
}

export function TooltipExample() {
	return (
		<TooltipProvider>
			<div className="flex items-center gap-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<button className="rounded-md border px-3 py-1.5 text-sm">Hover me</button>
					</TooltipTrigger>
					<TooltipContent>
						<p>I'm a tooltip</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<IconBadge icon={User} tone="primary" />
					</TooltipTrigger>
					<TooltipContent>
						<p>User profile</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}

export function BooleanIndicatorExample() {
	return (
		<div className="flex flex-col gap-2 w-full max-w-sm">
			<BooleanIndicator label="Verified" value trueVariant="success" />
			<BooleanIndicator label="Active" value={false} />
			<BooleanIndicator label="Subscribed" value trueLabel="Yes" falseLabel="No" trueVariant="primary" />
		</div>
	);
}

export function ShowIfExample() {
	const [show, setShow] = useState(true);
	return (
		<div className="flex flex-col gap-2 w-full max-w-sm">
			<button
				type="button"
				className="self-start rounded-md border border-border px-3 py-1 text-sm"
				onClick={() => setShow((v) => !v)}
			>
				{show ? 'Hide' : 'Show'} content
			</button>
			<ShowIf when={show} fallback={<span className="text-sm text-muted-foreground">Hidden — fallback shown.</span>}>
				<span className="text-sm">Visible only when <code>when</code> is true.</span>
			</ShowIf>
		</div>
	);
}

export function ThrottleAlertExample() {
	return (
		<div className="w-full max-w-md">
			<ThrottleAlert
				message="Too many failed attempts. Please wait."
				attempts={5}
				remaining="2 minutes"
			/>
		</div>
	);
}

export function VisuallyHiddenExample() {
	return (
		<div className="flex flex-col gap-2">
			<button type="button" className="self-start rounded-md border border-border px-3 py-1 text-sm">
				<span aria-hidden>×</span>
				<VisuallyHidden>Close</VisuallyHidden>
			</button>
			<Text size="xs" type="secondary">
				The button has accessible name &quot;Close&quot; — only the × is visible.
			</Text>
		</div>
	);
}

export function PlaceholderPatternExample() {
	return (
		<div className="relative h-32 w-full max-w-md overflow-hidden rounded-lg border border-border">
			<PlaceholderPattern className="absolute inset-0 size-full text-muted" />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Alert (shadcn re-export)
// ─────────────────────────────────────────────────────────────────────────────

export function AlertExample() {
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<Alert>
				<Terminal className="size-4" />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>You can preview every example below.</AlertDescription>
			</Alert>
			<Alert variant="destructive">
				<AlertTriangle className="size-4" />
				<AlertTitle>Something went wrong</AlertTitle>
				<AlertDescription>Please retry or contact support.</AlertDescription>
			</Alert>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress
// ─────────────────────────────────────────────────────────────────────────────

export function ProgressExample() {
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<Progress value={20} />
			<Progress value={60} />
			<Progress value={92} />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

export function SkeletonExample() {
	return (
		<div className="flex w-full max-w-md items-center gap-4">
			<Skeleton className="size-12 rounded-full" />
			<div className="flex flex-1 flex-col gap-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible
// ─────────────────────────────────────────────────────────────────────────────

export function CollapsibleExample() {
	return (
		<div className="w-full max-w-md">
			<Collapsible>
				<CollapsibleTrigger asChild>
					<button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
						<ChevronDown className="size-4" /> Toggle details
					</button>
				</CollapsibleTrigger>
				<CollapsibleContent className="mt-2 rounded-md border border-border bg-card p-3 text-sm">
					Hidden content revealed on click. Use Collapsible for inline disclosures.
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialog
// ─────────────────────────────────────────────────────────────────────────────

export function DialogExample() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Open dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>This action cannot be undone.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="secondary" buttonStyle="ghost">Cancel</Button>
					<Button variant="error">Delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// DateBlock
// ─────────────────────────────────────────────────────────────────────────────

export function DateBlockExample() {
	return (
		<div className="flex flex-wrap items-start gap-4">
			<DateBlock date="2026-04-12" />
			<DateBlock date="2026-04-12" time="14:30" />
			<DateBlock date="2026-04-12" layout="inline" />
			<DateBlock date={new Date()} tone="primary" />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MoneyDisplay
// ─────────────────────────────────────────────────────────────────────────────

export function MoneyDisplayExample() {
	return (
		<div className="flex flex-col gap-3">
			<MoneyDisplay money={{ amount: 2450, currency: 'USD' }} size="lg" weight="semibold" />
			<MoneyDisplay money={{ amount: 49.99, currency: 'EUR' }} />
			<MoneyDisplay money={null} />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// QRCode
// ─────────────────────────────────────────────────────────────────────────────

export function QRCodeExample() {
	return (
		<div className="w-40">
			<QRCode data="https://github.com/admin-ui-starter-kit" />
		</div>
	);
}

export function RealisticUserCard() {
	const c = MOCK_CUSTOMERS[0];
	return (
		<div className="flex w-full max-w-md items-center gap-4 rounded-md border bg-card p-4">
			<Avatar className="size-12">
				<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatarSeed}`} />
				<AvatarFallback>{c.name.split(' ').map((p) => p[0]).join('')}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 flex-1">
				<div className="font-medium">{c.name}</div>
				<div className="text-xs text-muted-foreground truncate">{c.email}</div>
			</div>
			<BooleanIndicator label="Verified" value trueVariant="success" />
		</div>
	);
}
```

## Example exports

- `NotificationBannerVariants`
- `AvatarSizes`
- `StackedAvatarsExample`
- `IconBadgeTones`
- `IconBadgeShapes`
- `IconBadgeSizes`
- `InlineStatLayouts`
- `SeparatorExample`
- `TooltipExample`
- `BooleanIndicatorExample`
- `ShowIfExample`
- `ThrottleAlertExample`
- `VisuallyHiddenExample`
- `PlaceholderPatternExample`
- `AlertExample`
- `ProgressExample`
- `SkeletonExample`
- `CollapsibleExample`
- `DialogExample`
- `DateBlockExample`
- `MoneyDisplayExample`
- `QRCodeExample`
- `RealisticUserCard`

