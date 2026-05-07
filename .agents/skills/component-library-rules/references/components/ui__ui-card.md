---
id: ui/ui-card
title: "UI · Card"
description: "shadcn primitive card with header / title / description / content / footer."
layer: ui
family: "Layout"
examples:
  - Default
  - CompactSizeSm
imports:
  - @/components/ui/card
tags:
  - ui
  - layout
  - card
  - shadcn
  - primitive
  - header
---

# UI · Card

shadcn primitive card with header / title / description / content / footer.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function Default() {
	return (
		<>
			<Card>
								<CardHeader>
									<CardTitle>Card title</CardTitle>
									<CardDescription>A short description goes here.</CardDescription>
								</CardHeader>
								<CardContent>Body content area.</CardContent>
								<CardFooter className="text-xs text-muted-foreground">Footer note</CardFooter>
							</Card>
		</>
	);
}

export function CompactSizeSm() {
	return (
		<>
			<Card size="sm">
								<CardHeader>
									<CardTitle>Compact</CardTitle>
								</CardHeader>
								<CardContent>Smaller padding & gap.</CardContent>
							</Card>
		</>
	);
}
```

## Example exports

- `Default`
- `CompactSizeSm`

