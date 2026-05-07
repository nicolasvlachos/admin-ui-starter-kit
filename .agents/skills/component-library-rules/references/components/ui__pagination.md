---
id: ui/pagination
title: "UI · Pagination"
description: "Manual composition of pagination controls."
layer: ui
family: "Navigation"
examples:
  - Default
imports:
  - @/components/ui/pagination
tags:
  - ui
  - navigation
  - pagination
  - manual
  - composition
  - controls
---

# UI · Pagination

Manual composition of pagination controls.

**Layer:** `ui`  

## Examples

```tsx
// @ts-nocheck
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

export function Default() {
	return (
		<>
			<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious href="#" />
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href="#">1</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href="#" isActive>2</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href="#">3</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
									<PaginationItem>
										<PaginationLink href="#">12</PaginationLink>
									</PaginationItem>
									<PaginationItem>
										<PaginationNext href="#" />
									</PaginationItem>
								</PaginationContent>
							</Pagination>
		</>
	);
}
```

## Example exports

- `Default`

