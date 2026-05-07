---
id: base/spinner
title: "Spinner"
description: "Loading indicator with three visual variants. Pairs with content placeholders, route transitions, and Suspense fallbacks."
layer: base
family: "Feedback"
sourcePath: src/components/base/spinner
examples:
  - Default
  - Variants
  - WithLabel
  - CustomColour
  - SectionPlaceholder
imports:
  - @/components/base/spinner
tags:
  - base
  - feedback
  - spinner
  - loading
  - indicator
  - visual
  - variants
---

# Spinner

Loading indicator with three visual variants. Pairs with content placeholders, route transitions, and Suspense fallbacks.

**Layer:** `base`  
**Source:** `src/components/base/spinner`

## Examples

```tsx
import { Spinner } from '@/components/base/spinner';

export function Default() {
	return <Spinner />;
}

export function Variants() {
	return (
		<div className="grid grid-cols-3 gap-2 w-full">
			<div className="rounded border border-border">
				<Spinner variant="default" label="default" />
			</div>
			<div className="rounded border border-border">
				<Spinner variant="shimmer" label="shimmer" />
			</div>
			<div className="rounded border border-border">
				<Spinner variant="progress" label="progress" />
			</div>
		</div>
	);
}

export function WithLabel() {
	return <Spinner label="Loading bookings…" />;
}

export function CustomColour() {
	return (
		<div className="flex flex-wrap gap-4">
			<Spinner label="Syncing inventory" className="text-success" />
			<Spinner label="Saving" className="text-warning" />
			<Spinner label="Deleting" className="text-destructive" />
		</div>
	);
}

export function SectionPlaceholder() {
	return (
		<div className="w-full max-w-md rounded-lg border border-border bg-card">
			<div className="border-b border-border px-4 py-2 text-sm font-medium">Recent activity</div>
			<Spinner label="Loading activity feed…" />
		</div>
	);
}
```

## Example exports

- `Default`
- `Variants`
- `WithLabel`
- `CustomColour`
- `SectionPlaceholder`

