export interface VendorProfileStat {
	label: string;
	value: string;
	change?: string;
}

export interface VendorProfileMetric {
	label: string;
	value: string;
}

/**
 * Localised labels for VendorProfileCard. Override per-instance via `strings`.
 */
export interface VendorProfileStrings {
	tabOverview: string;
	tabStats: string;
	totalEarnings: string;
	message: string;
	hire: string;
	verifiedAriaLabel: string;
}

export const defaultVendorProfileStrings: VendorProfileStrings = {
	tabOverview: 'Overview',
	tabStats: 'Stats',
	totalEarnings: 'Total Earnings',
	message: 'Message',
	hire: 'Hire Me',
	verifiedAriaLabel: 'Verified',
};

export interface VendorProfileCardProps {
	name: string;
	initials?: string;
	avatarUrl?: string;
	role?: string;
	verified?: boolean;
	earnings?: string;
	earningsChange?: string;
	metrics?: VendorProfileMetric[];
	stats?: VendorProfileStat[];
	onMessage?: () => void;
	onHire?: () => void;
	className?: string;
	strings?: Partial<VendorProfileStrings>;
}
