---
id: ui/skeleton
title: "UI · Skeleton"
description: "Animated loading placeholders."
layer: ui
family: "Data display"
sourcePath: src/components/ui/skeleton
examples:
  - Lines
  - CardPlaceholder
imports:
  - @/components/ui/skeleton
tags:
  - ui
  - data
  - display
  - skeleton
  - animated
  - loading
  - placeholders
---

# UI · Skeleton

Animated loading placeholders.

**Layer:** `ui`  
**Source:** `src/components/ui/skeleton`

## Examples

```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Col } from '../../PreviewLayout';

export function Lines() {
	return (
		<>
			<Col>
								<Skeleton className="h-4 w-[80%]" />
								<Skeleton className="h-4 w-[60%]" />
								<Skeleton className="h-4 w-[40%]" />
							</Col>
		</>
	);
}

export function CardPlaceholder() {
	return (
		<>
			<div className="flex items-center gap-3">
								<Skeleton className="size-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>
		</>
	);
}
```

## Example exports

- `Lines`
- `CardPlaceholder`

