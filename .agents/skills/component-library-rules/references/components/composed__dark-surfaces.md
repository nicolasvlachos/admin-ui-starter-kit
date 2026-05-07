---
id: composed/dark-surfaces
title: "Composed · Dark surfaces"
description: "Dark-wrapped components — payment, receipt, info panel, order items, outstanding balance."
layer: composed
family: "Surfaces"
sourcePath: src/components/composed/dark-surfaces
examples:
  - PaymentConfirmation
  - BookingReceipt
  - InfoPanel
  - OrderItems
  - OutstandingBalance
imports:
  - @/components/composed/dark-surfaces
tags:
  - composed
  - surfaces
  - dark-surfaces
  - dark
  - wrapped
  - components
  - payment
---

# Composed · Dark surfaces

Dark-wrapped components — payment, receipt, info panel, order items, outstanding balance.

**Layer:** `composed`  
**Source:** `src/components/composed/dark-surfaces`

## Examples

```tsx
import {
	DarkPaymentConfirmation,
	BookingReceiptDark,
	DarkInfoPanel,
	OrderItemsCard,
	OutstandingBalanceCard,
} from '@/components/composed/dark-surfaces';

export function PaymentConfirmation() {
	return (
		<>
			<DarkPaymentConfirmation
								amount="249.00 USD"
								details={[
									{ label: 'Method', value: 'Visa •••• 4242' },
									{ label: 'Reference', value: 'GCT-2026-0847' },
									{ label: 'Date', value: 'Mar 27, 2026' },
								]}
								helpText="Need help with this transaction?"
							/>
		</>
	);
}

export function BookingReceipt() {
	return (
		<>
			<BookingReceiptDark
								referenceCode="GCT-BK-2026-0392"
								details={[
									{ label: 'Vendor', value: 'BG Spa Retreat' },
									{ label: 'Service', value: 'Deep Tissue Massage' },
									{ label: 'Date', value: 'Apr 2, 2026 — 15:00' },
								]}
								amountPaid="135.00 USD"
							/>
		</>
	);
}

export function InfoPanel() {
	return (
		<>
			<DarkInfoPanel
								title="Voucher Breakdown"
								items={[
									{ label: 'Base price', value: '200 USD' },
									{ label: 'Platform fee (5%)', value: '10 USD' },
									{ label: 'VAT (20%)', value: '40 USD' },
									{ label: 'Discount', value: '-25 USD', highlight: true },
								]}
								totalLabel="Total Charged"
								totalValue="225 USD"
							/>
		</>
	);
}

export function OrderItems() {
	return (
		<>
			<OrderItemsCard
								items={[
									{ vendor: 'Artisan Chocolates', badge: 'Express', name: 'Luxury Truffle Box', qty: 2, price: '48 USD', color: 'bg-amber-400' },
									{ vendor: 'BG Spa Retreat', badge: 'Standard', name: 'Couples Massage Voucher', qty: 1, price: '120 USD', color: 'bg-sky-400' },
								]}
								summary={[
									{ label: 'Subtotal', value: '216 USD' },
									{ label: 'Shipping', value: '5.99 USD' },
								]}
								total="265.19 USD"
							/>
		</>
	);
}

export function OutstandingBalance() {
	return (
		<>
			<OutstandingBalanceCard
								amount="4,920 USD"
								dueDate="Apr 15, 2026"
								customer="David Williams"
								onSendReminder={() => {}}
								onRecordPayment={() => {}}
							/>
		</>
	);
}
```

## Example exports

- `PaymentConfirmation`
- `BookingReceipt`
- `InfoPanel`
- `OrderItems`
- `OutstandingBalance`

