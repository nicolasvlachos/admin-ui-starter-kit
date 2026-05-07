---
id: composed/invoice-header
title: "Composed · Invoice header"
description: "Top of an invoice — number, status, parties, amount."
layer: composed
family: "Data display"
sourcePath: src/components/composed/data-display/invoice-header
examples:
  - Paid
  - Overdue
imports:
  - @/components/composed/data-display/invoice-header
tags:
  - composed
  - data
  - display
  - invoice-header
  - invoice
  - header
  - top
  - number
---

# Composed · Invoice header

Top of an invoice — number, status, parties, amount.

**Layer:** `composed`  
**Source:** `src/components/composed/data-display/invoice-header`

## Examples

```tsx
import { InvoiceHeaderCard } from '@/components/composed/data-display/invoice-header';

export function Paid() {
	return (
		<>
			<InvoiceHeaderCard
								invoiceNumber="#INV-2026-0392"
								status="Paid"
								statusVariant="success"
								from={{ name: 'Gift Come True Ltd.', location: 'New York, NY' }}
								to={{ name: 'Daniel Smith', location: 'Los Angeles, USA' }}
								issuedDate="Mar 20, 2026"
								dueDate="Apr 20, 2026"
								amount="2,480.00 USD"
							/>
		</>
	);
}

export function Overdue() {
	return (
		<>
			<InvoiceHeaderCard
								invoiceNumber="#INV-2026-0114"
								status="Overdue"
								statusVariant="error"
								from={{ name: 'Gift Come True Ltd.' }}
								to={{ name: 'Adventure Park Bansko' }}
								issuedDate="Feb 14, 2026"
								dueDate="Mar 14, 2026"
								amount="3,120.00 USD"
							/>
		</>
	);
}
```

## Example exports

- `Paid`
- `Overdue`

