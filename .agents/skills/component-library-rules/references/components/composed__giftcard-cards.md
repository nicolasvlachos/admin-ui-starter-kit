---
id: composed/giftcard-cards
title: "Composed · Giftcard cards"
description: "Five visual variants — gradient, compact, minimal, dark, illustrated."
layer: composed
family: "Cards"
sourcePath: src/components/composed/cards/giftcard-card
examples:
  - GradientDefault
  - Minimal
  - Dark
  - Illustrated
  - CompactActiveExpired
imports:
  - @/components/composed/cards/giftcard-card
tags:
  - composed
  - cards
  - giftcard-card
  - giftcard
  - five
  - visual
  - variants
---

# Composed · Giftcard cards

Five visual variants — gradient, compact, minimal, dark, illustrated.

**Layer:** `composed`  
**Source:** `src/components/composed/cards/giftcard-card`

## Examples

```tsx
import {
	GiftcardCard,
	GiftcardCompact,
	GiftcardCardMinimal,
	GiftcardCardDark,
	GiftcardCardIllustrated,
} from '@/components/composed/cards/giftcard-card';

export function GradientDefault() {
	return (
		<>
			<GiftcardCard
								code="GCT-A4B7-C9E2"
								amount="250.00 USD"
								status="active"
								gradient="purple"
								recipientName="Davida Todorova"
								senderName="Petar Williams"
								message="Happy Birthday!"
								expiresAt="Dec 31, 2026"
								createdAt="Mar 15, 2026"
								onView={() => {}}
							/>
		</>
	);
}

export function Minimal() {
	return (
		<>
			<GiftcardCardMinimal
								code="GCT-M1N2-A3L4"
								amount="150.00 USD"
								status="active"
								color="green"
								recipientName="Daniel Kowalski"
								expiresAt="Sep 15, 2026"
								onView={() => {}}
							/>
		</>
	);
}

export function Dark() {
	return (
		<>
			<GiftcardCardDark
								code="GCT-D4K5-G6H7"
								amount="1,000.00 USD"
								status="active"
								recipientName="Viktoria Johnsona"
								expiresAt="Dec 31, 2026"
								onView={() => {}}
							/>
		</>
	);
}

export function Illustrated() {
	return (
		<>
			<GiftcardCardIllustrated
								code="GCT-I1L2-U3S4"
								amount="350.00 USD"
								status="active"
								headerColor="green"
								recipientName="Kalina Smitha"
								expiresAt="Nov 30, 2026"
								onView={() => {}}
							/>
		</>
	);
}

export function CompactActiveExpired() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
								<GiftcardCompact code="GCT-A4B7-C9E2" amount="250.00 USD" status="active" gradient="purple" recipientName="Davida Todorova" expiresAt="Dec 31, 2026" onView={() => {}} />
								<GiftcardCompact code="GCT-W5X8-Y1Z3" amount="75.00 USD" status="expired" recipientName="Dimitar Georgiev" expiresAt="Jan 15, 2026" />
							</div>
		</>
	);
}
```

## Example exports

- `GradientDefault`
- `Minimal`
- `Dark`
- `Illustrated`
- `CompactActiveExpired`

