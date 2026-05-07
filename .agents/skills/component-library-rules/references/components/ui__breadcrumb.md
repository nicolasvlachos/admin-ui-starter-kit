---
id: ui/breadcrumb
title: "UI · Breadcrumb"
description: "shadcn breadcrumb — list, items, separator (default & custom)."
layer: ui
family: "Navigation"
sourcePath: src/components/ui/breadcrumb
examples:
  - Default
  - CustomSeparator
imports:
  - @/components/ui/breadcrumb
tags:
  - ui
  - navigation
  - breadcrumb
  - shadcn
  - list
  - items
  - separator
---

# UI · Breadcrumb

shadcn breadcrumb — list, items, separator (default & custom).

**Layer:** `ui`  
**Source:** `src/components/ui/breadcrumb`

## Examples

```tsx
import { Slash } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Default() {
	return (
		<>
			<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="#/">Home</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbLink href="#/orders">Orders</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>INV-2026-0392</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
		</>
	);
}

export function CustomSeparator() {
	return (
		<>
			<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="#/">Home</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator>
										<Slash />
									</BreadcrumbSeparator>
									<BreadcrumbItem>
										<BreadcrumbPage>Settings</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
		</>
	);
}
```

## Example exports

- `Default`
- `CustomSeparator`

