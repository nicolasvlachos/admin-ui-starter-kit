---
id: composed/gradient-card
title: "Composed · Gradient card"
description: "Vivid gradient card with optional pattern, badge, alert, action."
layer: composed
family: "Cards"
sourcePath: src/components/composed/cards/gradient-card
examples:
  - HeroCardWithAction
  - CompactAllGradients
  - HeroVariants
imports:
  - @/components/composed/cards/gradient-card
tags:
  - composed
  - cards
  - gradient-card
  - gradient
  - card
  - vivid
  - optional
---

# Composed · Gradient card

Vivid gradient card with optional pattern, badge, alert, action.

**Layer:** `composed`  
**Source:** `src/components/composed/cards/gradient-card`

## Examples

```tsx
import { ShoppingBag, DollarSign, Users, Sparkles } from 'lucide-react';
import { GradientCard, GradientCardCompact, type GradientPreset } from '@/components/composed/cards/gradient-card';

const PRESETS: GradientPreset[] = ['coral', 'ocean', 'forest', 'twilight', 'ember'];

export function HeroCardWithAction() {
	return (
		<>
			<GradientCard
								gradient="coral"
								pattern="circles"
								title="Pending Orders"
								subtitle="Requires attention"
								value="24"
								valueLabel="orders awaiting fulfillment"
								badge="Urgent"
								alertText="3 orders older than 48h"
								alertCount={3}
								icon={ShoppingBag}
								action={{ label: 'Review Orders', onClick: () => {} }}
							/>
		</>
	);
}

export function CompactAllGradients() {
	return (
		<>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
								{PRESETS.map((g) => (
									<GradientCardCompact
										key={g}
										gradient={g}
										pattern={g === 'ocean' || g === 'ember' ? 'circles' : g === 'twilight' ? 'diagonal' : 'none'}
										title={g}
										value="42"
										change="+5%"
										subtitle="this month"
									/>
								))}
							</div>
		</>
	);
}

export function HeroVariants() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
								<GradientCard gradient="ocean" title="Monthly Sales" subtitle="March 2026" value="52,340 USD" badge="+12.5%" icon={DollarSign} action={{ label: 'View Report', onClick: () => {} }} />
								<GradientCard gradient="forest" pattern="diagonal" title="New Customers" subtitle="This week" value="248" icon={Users} action={{ label: 'See list', onClick: () => {} }} />
								<GradientCard gradient="twilight" title="AI Insights" subtitle="Recent" value="—" icon={Sparkles} />
								<GradientCard gradient="ember" pattern="circles" title="Critical alerts" subtitle="Last 24h" value="3" alertText="Investigate immediately" alertCount={3} />
							</div>
		</>
	);
}
```

## Example exports

- `HeroCardWithAction`
- `CompactAllGradients`
- `HeroVariants`

