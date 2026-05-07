---
id: ui/ui-table
title: "UI · Table"
description: "shadcn table primitive (no data layer)."
layer: ui
family: "Data display"
sourcePath: src/components/ui/table
examples:
  - Default
imports:
  - @/components/ui/table
tags:
  - ui
  - data
  - display
  - table
  - shadcn
  - primitive
  - layer
---

# UI · Table

shadcn table primitive (no data layer).

**Layer:** `ui`  
**Source:** `src/components/ui/table`

## Examples

```tsx
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export function Default() {
	return (
		<>
			<Table>
								<TableCaption>Recent orders</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead>Order</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>ORD-001</TableCell>
										<TableCell>Sarah Smitha</TableCell>
										<TableCell>2,450 USD</TableCell>
										<TableCell>Paid</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ORD-002</TableCell>
										<TableCell>Daniel Smith</TableCell>
										<TableCell>370 USD</TableCell>
										<TableCell>Pending</TableCell>
									</TableRow>
								</TableBody>
							</Table>
		</>
	);
}
```

## Example exports

- `Default`

