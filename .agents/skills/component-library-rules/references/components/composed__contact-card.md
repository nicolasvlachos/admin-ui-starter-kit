---
id: composed/contact-card
title: "Composed · Contact card"
description: "ContactCard — name, role, email, phone, location, badge."
layer: composed
family: "Cards"
examples:
  - WithAllFields
  - WithInitialsOnly
  - Minimal
  - DifferentBadgeVariants
imports:
  - @/components/composed/cards/contact-card
tags:
  - composed
  - cards
  - contact
  - card
  - contactcard
  - name
---

# Composed · Contact card

ContactCard — name, role, email, phone, location, badge.

**Layer:** `composed`  

## Examples

```tsx
// @ts-nocheck
import { ContactCard } from '@/components/composed/cards/contact-card';
import { Col } from '../../PreviewLayout';

export function WithAllFields() {
	return (
		<>
			<ContactCard
								name="Sarah Smitha"
								role="Account Manager"
								email="maria@giftcometrue.com"
								phone="+1 888 123 456"
								location="New York, NY"
								badge="Online"
								badgeVariant="success"
								onContact={() => {}}
								onViewProfile={() => {}}
							/>
		</>
	);
}

export function WithInitialsOnly() {
	return (
		<>
			<ContactCard
								name="Georgi Johnson"
								role="Head of Operations"
								email="georgi@giftcometrue.com"
								initials="GI"
								badge="Away"
								badgeVariant="warning"
								onContact={() => {}}
								onViewProfile={() => {}}
							/>
		</>
	);
}

export function Minimal() {
	return (
		<>
			<ContactCard name="Emma Williamsa" />
		</>
	);
}

export function DifferentBadgeVariants() {
	return (
		<>
			<Col>
								{(['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const).map((v) => (
									<ContactCard
										key={v}
										name={`Variant: ${v}`}
										role="Demo"
										email="demo@example.com"
										badge={v}
										badgeVariant={v}
									/>
								))}
							</Col>
		</>
	);
}
```

## Example exports

- `WithAllFields`
- `WithInitialsOnly`
- `Minimal`
- `DifferentBadgeVariants`

