---
id: composed/onboarding-checklist
title: "Composed · Onboarding · Checklist"
description: "Step-list accordion with completed / in-progress / pending status indicators. Auto-opens the next non-completed step. Strings + status ARIA fully overridable. Composes base/accordion."
layer: composed
family: "Onboarding"
examples:
  - BorderedDefaultPointOfSaleOnboarding
  - CardVariantWorkspaceSetupControlled
  - FlatVariantMinimal
imports:
  - @/components/base/badge
  - @/components/base/buttons
  - @/components/base/cards
  - @/components/base/forms/fields
  - @/components/composed/onboarding
  - @/components/typography
tags:
  - composed
  - onboarding
  - checklist
  - step
  - list
  - accordion
---

# Composed · Onboarding · Checklist

Step-list accordion with completed / in-progress / pending status indicators. Auto-opens the next non-completed step. Strings + status ARIA fully overridable. Composes base/accordion.

**Layer:** `composed`  

## Examples

```tsx
// @ts-nocheck
import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { SmartCard } from '@/components/base/cards';
import { Input } from '@/components/base/forms/fields';
import {
	OnboardingChecklist,
	type OnboardingChecklistStep,
} from '@/components/composed/onboarding';
import { Heading, Text } from '@/components/typography';
import { Col } from '../../PreviewLayout';

function PosAppBody() {
	return (
		<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
			<div className="flex-1 space-y-4">
				<Text size="sm" type="secondary" className="leading-relaxed">
					Scan the QR code or send yourself the link to get the app. The
					mobile app is where you&rsquo;ll manage orders, track inventory,
					and view analytics on the go.
				</Text>
				<div className="flex items-center gap-2">
					<Input placeholder="you@example.com" className="flex-1" />
					<Button variant="secondary">Send link</Button>
				</div>
			</div>
			<div className="flex shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 p-3">
				<QrCode className="size-20 text-foreground" strokeWidth={1.5} />
			</div>
		</div>
	);
}

const onboardingSteps: OnboardingChecklistStep[] = [
	{
		id: 'add-products',
		status: 'completed',
		title: 'Add products',
		badge: <Badge variant="success">Ready</Badge>,
		content: (
			<Text size="sm" type="secondary">
				Your products have been successfully added and are ready for sale.
			</Text>
		),
	},
	{
		id: 'pos-app',
		status: 'in-progress',
		title: 'Get the point-of-sale application',
		content: <PosAppBody />,
	},
	{
		id: 'price-stock',
		status: 'pending',
		title: 'Product price & stock',
		content: (
			<Text size="sm" type="secondary">
				Configure your product pricing and manage stock levels across all
				locations.
			</Text>
		),
	},
];

const settingsSteps: OnboardingChecklistStep[] = [
	{ id: 'workspace', status: 'completed', title: 'Create your workspace', content: <Text size="sm" type="secondary">Workspace created.</Text> },
	{ id: 'invite', status: 'completed', title: 'Invite teammates', content: <Text size="sm" type="secondary">3 members joined.</Text> },
	{ id: 'integrations', status: 'in-progress', title: 'Connect integrations', badge: <Badge variant="warning">Recommended</Badge>, content: <Text size="sm" type="secondary">Connect Slack, GitHub, and Linear.</Text> },
	{ id: 'billing', status: 'pending', title: 'Add payment method', content: <Text size="sm" type="secondary">Required before launch.</Text>, disabled: false },
];

export function BorderedDefaultPointOfSaleOnboarding() {
	return (
		<>
			<Col className="max-w-2xl">
								<OnboardingChecklist steps={onboardingSteps} />
							</Col>
		</>
	);
}

export function CardVariantWorkspaceSetupControlled() {
	const [expanded, setExpanded] = useState<string[]>(['integrations']);
	return (
		<>
			<Col className="max-w-2xl">
								<SmartCard padding="sm">
									<Col className="gap-3">
										<Heading tag="h3" className="border-0 pb-0 text-base">
											Set up your workspace
										</Heading>
										<OnboardingChecklist
											steps={settingsSteps}
											variant="card"
											value={expanded}
											onValueChange={setExpanded}
										/>
									</Col>
								</SmartCard>
							</Col>
		</>
	);
}

export function FlatVariantMinimal() {
	return (
		<>
			<Col className="max-w-2xl">
								<OnboardingChecklist
									steps={onboardingSteps}
									variant="flat"
									defaultExpanded={[]}
								/>
							</Col>
		</>
	);
}
```

## Example exports

- `BorderedDefaultPointOfSaleOnboarding`
- `CardVariantWorkspaceSetupControlled`
- `FlatVariantMinimal`

