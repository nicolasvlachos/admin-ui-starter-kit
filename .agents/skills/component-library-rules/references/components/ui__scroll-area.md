---
id: ui/scroll-area
title: "UI · Scroll area"
description: "Custom-styled scroll viewport."
layer: ui
family: "Layout"
sourcePath: src/components/ui/scroll-area
examples:
  - Vertical
  - Horizontal
imports:
  - @/components/ui/scroll-area
tags:
  - ui
  - layout
  - scroll-area
  - scroll
  - area
  - custom
  - styled
---

# UI · Scroll area

Custom-styled scroll viewport.

**Layer:** `ui`  
**Source:** `src/components/ui/scroll-area`

## Examples

```tsx
import { ScrollArea } from '@/components/ui/scroll-area';

export function Vertical() {
	return (
		<>
			<ScrollArea className="h-48 w-full rounded-md border border-border p-3">
								<ul className="space-y-2 text-sm">
									{Array.from({ length: 30 }).map((_, i) => (
										<li key={i}>List item {i + 1}</li>
									))}
								</ul>
							</ScrollArea>
		</>
	);
}

export function Horizontal() {
	return (
		<>
			<ScrollArea className="w-full rounded-md border border-border p-3">
								<div className="flex gap-3">
									{Array.from({ length: 20 }).map((_, i) => (
										<div key={i} className="flex size-24 shrink-0 items-center justify-center rounded-md bg-muted text-sm">
											Box {i + 1}
										</div>
									))}
								</div>
							</ScrollArea>
		</>
	);
}
```

## Example exports

- `Vertical`
- `Horizontal`

