---
id: composed/invoice-items
title: "Composed · Invoice items"
description: "Table, compact, detailed layouts with subtotal/tax/discount/total."
layer: composed
family: "Data display"
sourcePath: src/components/composed/data-display/invoice-items
examples:
  - Table
  - Compact
  - Detailed
imports:
  - @/components/composed/data-display/invoice-items
tags:
  - composed
  - data
  - display
  - invoice-items
  - invoice
  - items
  - table
  - compact
---

# Composed · Invoice items

Table, compact, detailed layouts with subtotal/tax/discount/total.

**Layer:** `composed`  
**Source:** `src/components/composed/data-display/invoice-items`

## Examples

```tsx
import {
	InvoiceItemsTable,
	InvoiceItemsCompact,
	InvoiceItemsDetailed,
} from '@/components/composed/data-display/invoice-items';

const items = [
	{ id: '1', title: 'Spa & Wellness Package', description: 'Full body massage — 90 min', quantity: 2, unitPrice: '120.00 USD', total: '240.00 USD', badge: 'Premium', badgeVariant: 'primary' as const },
	{ id: '2', title: 'Wine Tasting Experience', description: 'Curated selection of 6 wines', quantity: 1, unitPrice: '85.00 USD', total: '85.00 USD' },
	{ id: '3', title: 'Gift Wrapping Service', quantity: 1, unitPrice: '15.00 USD', total: '15.00 USD', badge: 'Add-on', badgeVariant: 'info' as const },
];

export function Table() {
	return (
		<>
			<InvoiceItemsTable items={items} subtotal="340.00 USD" tax="68.00 USD" discount="20.00 USD" total="388.00 USD" />
		</>
	);
}

export function Compact() {
	return (
		<>
			<InvoiceItemsCompact items={items} total="340.00 USD" />
		</>
	);
}

export function Detailed() {
	return (
		<>
			<InvoiceItemsDetailed items={items} subtotal="340.00 USD" tax="68.00 USD" discount="20.00 USD" total="388.00 USD" />
		</>
	);
}
```

## Example exports

- `Table`
- `Compact`
- `Detailed`

