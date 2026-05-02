export interface TaxLineItem {
	id?: string;
	label: string;
	rate?: string;
	amount: string;
}

export interface TaxBreakdownStrings {
	title: string;
	subtotal: string;
	totalTax: string;
	total: string;
}

export const defaultTaxBreakdownStrings: TaxBreakdownStrings = {
	title: 'Tax Breakdown',
	subtotal: 'Subtotal',
	totalTax: 'Total Tax',
	total: 'Total',
};

export interface TaxBreakdownCardProps {
	subtotal: string;
	taxes: TaxLineItem[];
	totalTax?: string;
	total: string;
	className?: string;
	strings?: Partial<TaxBreakdownStrings>;
}
