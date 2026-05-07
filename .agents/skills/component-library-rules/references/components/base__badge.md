---
id: base/badge
title: "Badge"
description: "Status pills and chips for tags, counts, and inline state."
layer: base
family: "Foundations"
sourcePath: src/components/base/badge
examples:
  - Default
  - Variants
  - WithDot
imports:
  - @/components/base/badge
tags:
  - base
  - foundations
  - badge
  - status
  - pills
  - chips
  - tags
---

# Badge

Status pills and chips for tags, counts, and inline state.

**Layer:** `base`  
**Source:** `src/components/base/badge`

## Examples

```tsx
import { Badge } from '@/components/base/badge';

export function Default() {
	return <Badge>New</Badge>;
}

export function Variants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="info">Info</Badge>
			<Badge variant="secondary">Secondary</Badge>
		</div>
	);
}

export function WithDot() {
	return (
		<div className="flex flex-wrap gap-2">
			<Badge variant="success" dot>Live</Badge>
			<Badge variant="warning" dot pending>Pending</Badge>
		</div>
	);
}
```

## Example exports

- `Default`
- `Variants`
- `WithDot`

