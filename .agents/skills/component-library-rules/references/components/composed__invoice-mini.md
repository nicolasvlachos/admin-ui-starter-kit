---
id: composed/invoice-mini
title: "Composed · Invoice mini"
description: "Compact invoice tile — paid / pending / overdue."
layer: composed
family: "Data display"
examples:
  - Statuses
imports:
  - @/components/composed/data-display/invoice-mini
tags:
  - composed
  - data
  - display
  - invoice
  - mini
  - compact
  - tile
---

# Composed · Invoice mini

Compact invoice tile — paid / pending / overdue.

**Layer:** `composed`  

## Examples

```tsx
// @ts-nocheck
import { InvoiceMiniCard } from '@/components/composed/data-display/invoice-mini';

export function Statuses() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
								<InvoiceMiniCard invoice={{ invoiceNumber: 'INV-2026-0198', customerName: 'Spa Retreat New York', lineItemsCount: 8, totalAmount: '4,560 USD', status: 'paid', dueDate: 'Apr 5, 2026' }} />
								<InvoiceMiniCard invoice={{ invoiceNumber: 'INV-2026-0201', customerName: 'Adventure Park Bansko', lineItemsCount: 4, totalAmount: '2,840 USD', status: 'pending', dueDate: 'Apr 8, 2026' }} />
								<InvoiceMiniCard invoice={{ invoiceNumber: 'INV-2026-0195', customerName: "Chef's Table New York", lineItemsCount: 3, totalAmount: '1,280 USD', status: 'overdue', dueDate: 'Mar 24, 2026' }} />
							</div>
		</>
	);
}
```

## Example exports

- `Statuses`

