---
id: ui/button
title: "UI · Button"
description: "shadcn primitive button — variants, sizes, button group."
layer: ui
family: "Forms"
examples:
  - Variants
  - Sizes
  - ButtonGroupExample
imports:
  - @/components/ui/button
  - @/components/ui/button-group
tags:
  - ui
  - forms
  - button
  - shadcn
  - primitive
  - variants
---

# UI · Button

shadcn primitive button — variants, sizes, button group.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Row } from '../../PreviewLayout';

export function Variants() {
	return (
		<>
			<Row>
								<Button>default</Button>
								<Button variant="outline">outline</Button>
								<Button variant="secondary">secondary</Button>
								<Button variant="ghost">ghost</Button>
								<Button variant="destructive">destructive</Button>
								<Button variant="link">link</Button>
							</Row>
		</>
	);
}

export function Sizes() {
	return (
		<>
			<Row>
								<Button size="xs">xs</Button>
								<Button size="sm">sm</Button>
								<Button size="default">default</Button>
								<Button size="lg">lg</Button>
							</Row>
		</>
	);
}

export function ButtonGroupExample() {
	return (
		<>
			<ButtonGroup>
								<Button variant="outline">Day</Button>
								<Button variant="outline">Week</Button>
								<Button variant="outline">Month</Button>
							</ButtonGroup>
		</>
	);
}
```

## Example exports

- `Variants`
- `Sizes`
- `ButtonGroupExample`

