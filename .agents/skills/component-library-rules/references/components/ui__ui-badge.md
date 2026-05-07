---
id: ui/ui-badge
title: "UI · Badge"
description: "shadcn badge primitive (no theming wrapper)."
layer: ui
family: "Data display"
examples:
  - Variants
  - InContext
imports:
  - @/components/ui/badge
tags:
  - ui
  - data
  - display
  - badge
  - shadcn
  - primitive
  - theming
---

# UI · Badge

shadcn badge primitive (no theming wrapper).

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Row } from '../../PreviewLayout';

export function Variants() {
	return (
		<>
			<Row>
								<Badge>default</Badge>
								<Badge variant="secondary">secondary</Badge>
								<Badge variant="destructive">destructive</Badge>
								<Badge variant="outline">outline</Badge>
							</Row>
		</>
	);
}

export function InContext() {
	return (
		<>
			<Row>
								<span className="text-sm">Status: <Badge variant="secondary">draft</Badge></span>
								<span className="text-sm">Status: <Badge>live</Badge></span>
								<span className="text-sm">Status: <Badge variant="destructive">expired</Badge></span>
							</Row>
		</>
	);
}
```

## Example exports

- `Variants`
- `InContext`

