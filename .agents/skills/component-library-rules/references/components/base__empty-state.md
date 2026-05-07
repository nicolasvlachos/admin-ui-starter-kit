---
id: base/empty-state
title: "Empty state"
description: "Adaptive zero-data surface. Wrap with the right illustration per resource — products, users, search results, inbox. Slots for media / actions / footer; consumer overrides every string."
layer: base
family: "Display"
sourcePath: src/components/base/display/empty-state
examples:
  - Default
  - NoProductsWithActions
  - NoTeamMembers
  - NoSearchResults
  - InboxZero
  - PaddingCompact
  - PaddingBase
  - PaddingLoose
  - DashedBorderDropZone
  - StringsPropLocalisation
  - RenderPropCustomMedia
imports:
  - @/components/base/buttons
  - @/components/base/cards
  - @/components/base/display/empty-state
  - @/components/typography/text-link
tags:
  - base
  - display
  - empty-state
  - empty
  - state
  - adaptive
  - zero
---

# Empty state

Adaptive zero-data surface. Wrap with the right illustration per resource — products, users, search results, inbox. Slots for media / actions / footer; consumer overrides every string.

**Layer:** `base`  
**Source:** `src/components/base/display/empty-state`

## Examples

```tsx
import { ListPlus, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import {
	DocumentStackIllustration,
	EmptyState,
	InboxCleanIllustration,
	SearchGlassIllustration,
	StackedCardsIllustration,
	UsersCircleIllustration,
} from '@/components/base/display/empty-state';
import TextLink from '@/components/typography/text-link';

export function Default() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<DocumentStackIllustration />}
				title="No invoices yet"
				description="Invoices appear here once a sale is completed."
			/>
		</SmartCard>
	);
}

export function NoProductsWithActions() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<StackedCardsIllustration />}
				title="No products yet"
				description="Add your first product to start selling. You can also import an existing catalog."
				actions={
					<>
						<Button>
							<ListPlus className="size-4" />
							Add product
						</Button>
						<Button variant="secondary" buttonStyle="ghost">
							<Upload className="size-4" />
							Import CSV
						</Button>
					</>
				}
				footer={
					<>
						Need help? <TextLink href="#">Read the guide</TextLink>
					</>
				}
			/>
		</SmartCard>
	);
}

export function NoTeamMembers() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<UsersCircleIllustration />}
				title="Invite your team"
				description="Bring in collaborators to manage the workspace together."
				actions={<Button>Invite member</Button>}
			/>
		</SmartCard>
	);
}

export function NoSearchResults() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				mediaVariant="illustration"
				media={<SearchGlassIllustration />}
				title="No results for &ldquo;quarterly&rdquo;"
				description="Try a broader query, or clear filters to see everything."
				actions={
					<Button variant="secondary" buttonStyle="ghost">
						<RefreshCw className="size-4" />
						Clear filters
					</Button>
				}
				padding="compact"
			/>
		</SmartCard>
	);
}

export function InboxZero() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<InboxCleanIllustration />}
				title="You&rsquo;re all caught up"
				description={false}
				padding="compact"
			/>
		</SmartCard>
	);
}

export function PaddingCompact() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<DocumentStackIllustration />}
				title="Compact padding"
				description="padding=&quot;compact&quot;"
				padding="compact"
			/>
		</SmartCard>
	);
}

export function PaddingBase() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<DocumentStackIllustration />}
				title="Base padding"
				description="padding=&quot;base&quot; (default)"
			/>
		</SmartCard>
	);
}

export function PaddingLoose() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<DocumentStackIllustration />}
				title="Loose padding"
				description="padding=&quot;loose&quot;"
				padding="loose"
			/>
		</SmartCard>
	);
}

export function DashedBorderDropZone() {
	return (
		<div className="w-full max-w-xl">
			<EmptyState
				border
				mediaVariant="icon"
				media={<ListPlus className="size-6 text-muted-foreground" />}
				title="Drop a file to attach"
				description="Or click to browse. Max 10 MB."
				padding="loose"
			/>
		</div>
	);
}

export function StringsPropLocalisation() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				media={<StackedCardsIllustration />}
				strings={{
					title: 'Aucun produit',
					description: 'Ajoutez votre premier produit pour commencer.',
				}}
			/>
		</SmartCard>
	);
}

export function RenderPropCustomMedia() {
	return (
		<SmartCard padding="sm" className="w-full max-w-xl">
			<EmptyState
				mediaVariant="illustration"
				renderMedia={({ mediaVariant }) => (
					<div className="flex flex-col items-center gap-1">
						<div className="size-12 rounded-full bg-info/15 ring-8 ring-info/5" />
						<span className="text-xs text-muted-foreground">variant: {mediaVariant}</span>
					</div>
				)}
				title="Custom rendering through renderMedia"
				description="The render-prop receives the resolved variant so consumers can react to it."
			/>
		</SmartCard>
	);
}
```

## Example exports

- `Default`
- `NoProductsWithActions`
- `NoTeamMembers`
- `NoSearchResults`
- `InboxZero`
- `PaddingCompact`
- `PaddingBase`
- `PaddingLoose`
- `DashedBorderDropZone`
- `StringsPropLocalisation`
- `RenderPropCustomMedia`

