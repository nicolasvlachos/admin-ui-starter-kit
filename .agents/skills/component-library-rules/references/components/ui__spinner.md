---
id: ui/spinner
title: "UI · Spinner"
description: "Loading spinner — sized via className."
layer: ui
family: "Data display"
examples:
  - Sizes
  - ColorViaClassName
imports:
  - @/components/ui/spinner
tags:
  - ui
  - data
  - display
  - spinner
  - loading
  - sized
  - classname
---

# UI · Spinner

Loading spinner — sized via className.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { Spinner } from '@/components/ui/spinner';
import { Row } from '../../PreviewLayout';

export function Sizes() {
	return (
		<>
			<Row>
								<Spinner className="size-3" />
								<Spinner className="size-4" />
								<Spinner className="size-5" />
								<Spinner className="size-6" />
								<Spinner className="size-8" />
							</Row>
		</>
	);
}

export function ColorViaClassName() {
	return (
		<>
			<Row>
								<Spinner className="size-5 text-primary" />
								<Spinner className="size-5 text-destructive" />
								<Spinner className="size-5 text-chart-2" />
								<Spinner className="size-5 text-muted-foreground" />
							</Row>
		</>
	);
}
```

## Example exports

- `Sizes`
- `ColorViaClassName`

