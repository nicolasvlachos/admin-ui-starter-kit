---
id: ui/ui-badge
title: "UI · Badge"
description: "shadcn badge primitive (no theming wrapper)."
layer: ui
family: "Data display"
sourcePath: src/components/ui/badge
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
  - wrapper
---

# UI · Badge

shadcn badge primitive (no theming wrapper).

**Layer:** `ui`  
**Source:** `src/components/ui/badge`

## Examples

```tsx
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

