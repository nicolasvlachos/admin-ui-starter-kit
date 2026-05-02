/**
 * Default user-facing strings for the `composed/dark-surfaces` family.
 *
 * Consumers wire backend i18n at the call site:
 *
 *   <BookingReceiptDark strings={{ title: t('receipt.title') }} … />
 */

export interface BookingReceiptDarkStrings {
	title: string;
	statusConfirmed: string;
	amountPaidLabel: string;
}

export const defaultBookingReceiptDarkStrings: BookingReceiptDarkStrings = {
	title: 'Booking Receipt',
	statusConfirmed: 'Confirmed',
	amountPaidLabel: 'Amount Paid',
};

export interface DarkPaymentConfirmationStrings {
	successTitle: string;
	successDescription: string;
	detailsToggle: string;
}

export const defaultDarkPaymentConfirmationStrings: DarkPaymentConfirmationStrings = {
	successTitle: 'Payment Successful',
	successDescription: 'Transaction completed',
	detailsToggle: 'Payment Details',
};

export interface DarkInfoPanelStrings {
	defaultTitle: string;
}

export const defaultDarkInfoPanelStrings: DarkInfoPanelStrings = {
	defaultTitle: 'Details',
};

export interface OrderItemsCardStrings {
	title: string;
	totalLabel: string;
}

export const defaultOrderItemsCardStrings: OrderItemsCardStrings = {
	title: 'Order Items',
	totalLabel: 'Total',
};

export interface OutstandingBalanceCardStrings {
	title: string;
	dueDateLabel: string;
	customerLabel: string;
	sendReminder: string;
	recordPayment: string;
}

export const defaultOutstandingBalanceCardStrings: OutstandingBalanceCardStrings = {
	title: 'Outstanding Balance',
	dueDateLabel: 'Due Date',
	customerLabel: 'Customer',
	sendReminder: 'Send Reminder',
	recordPayment: 'Record Payment',
};
