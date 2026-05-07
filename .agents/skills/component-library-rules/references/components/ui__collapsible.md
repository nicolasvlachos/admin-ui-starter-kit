---
id: ui/collapsible
title: "UI · Collapsible"
description: "Headless show/hide region."
layer: ui
family: "Layout"
examples:
  - Default
imports:
  - @/components/ui/button
  - @/components/ui/collapsible
tags:
  - ui
  - layout
  - collapsible
  - headless
  - show
  - hide
---

# UI · Collapsible

Headless show/hide region.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function Default() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Collapsible open={open} onOpenChange={setOpen}>
								<CollapsibleTrigger
									render={(p) => (
										<Button variant="outline" {...p}>
											<ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
											{open ? 'Hide details' : 'Show details'}
										</Button>
									)}
								/>
								<CollapsibleContent className="mt-3 rounded-md border border-border p-3 text-sm">
									<p>Hidden content revealed.</p>
									<p className="text-muted-foreground">More text here.</p>
								</CollapsibleContent>
							</Collapsible>
		</>
	);
}
```

## Example exports

- `Default`

