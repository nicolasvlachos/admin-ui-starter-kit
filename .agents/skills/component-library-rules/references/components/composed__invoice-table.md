---
id: composed/invoice-table
title: "Composed · Invoice table"
description: "Line items with qty / price / total."
layer: composed
family: "Data display"
sourcePath: src/components/composed/data-display/invoice-table
examples:
  - Default
  - WithTaxRate
imports:
  - @/components/composed/data-display/invoice-table
tags:
  - composed
  - data
  - display
  - invoice-table
  - invoice
  - table
  - line
  - items
---

# Composed · Invoice table

Line items with qty / price / total.

**Layer:** `composed`  
**Source:** `src/components/composed/data-display/invoice-table`

## Examples

```tsx
import { InvoiceTable } from '@/components/composed/data-display/invoice-table';

export function Default() {
	return (
		<>
			<InvoiceTable
								items={[
									{ description: 'Wine Tasting x 2', qty: 2, price: 185, total: 370 },
									{ description: 'Luxury Spa Package', qty: 1, price: 420, total: 420 },
									{ description: 'Gift Basket (Large)', qty: 3, price: 94, total: 282 },
								]}
							/>
		</>
	);
}

export function WithTaxRate() {
	return (
		<>
			<InvoiceTable
								taxRate={20}
								items={[
									{ description: 'Hot Air Balloon', qty: 1, price: 580, total: 580 },
									{ description: 'Photo Tour', qty: 2, price: 120, total: 240 },
								]}
							/>
		</>
	);
}
```

## Example exports

- `Default`
- `WithTaxRate`

