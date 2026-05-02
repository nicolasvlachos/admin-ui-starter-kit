export interface GiftcardData {
	code: string;
	amount: string;
	remainingAmount?: string;
	currency?: string;
	status: 'active' | 'redeemed' | 'expired' | 'disabled';
	recipientName?: string;
	senderName?: string;
	message?: string;
	expiresAt?: string;
	createdAt?: string;
	template?: string;
	onView?: () => void;
}

export type GradientVariant = 'purple' | 'green' | 'warm';
export type PatternVariant = 'none' | 'circles' | 'waves';
export type AccentColor = 'green' | 'purple' | 'warm';
export type HeaderColor = 'green' | 'blue' | 'amber';

export type GiftcardStatus = GiftcardData['status'];

/**
 * Localised labels for giftcard cards. Covers status chips, the recurring
 * field labels rendered by all five partials (full / dark / illustrated /
 * minimal / compact), and the inline button labels.
 *
 * Override per-instance via `strings`.
 */
export interface GiftcardStrings {
	status: Record<GiftcardStatus, string>;
	giftCard: string;
	balance: string;
	personalMessage: string;
	to: string;
	from: string;
	expires: string;
	recipient: string;
	viewDetails: string;
	copyCode: string;
}

export const defaultGiftcardStrings: GiftcardStrings = {
	status: {
		active: 'Active',
		redeemed: 'Redeemed',
		expired: 'Expired',
		disabled: 'Disabled',
	},
	giftCard: 'Gift Card',
	balance: 'Balance',
	personalMessage: 'Personal Message',
	to: 'To',
	from: 'From',
	expires: 'Expires',
	recipient: 'Recipient',
	viewDetails: 'View Details',
	copyCode: 'Copy code',
};

export interface GiftcardCommonProps {
	/** Override default English giftcard strings. */
	strings?: Partial<GiftcardStrings>;
}

export const giftcardStatusVariant: Record<
	GiftcardStatus,
	'success' | 'secondary' | 'error' | 'warning'
> = {
	active: 'success',
	redeemed: 'secondary',
	expired: 'error',
	disabled: 'warning',
};

/**
 * @deprecated Use `defaultGiftcardStrings.status` for labels and
 * `giftcardStatusVariant` for badge variants. Kept for backwards compatibility.
 */
export const giftcardStatusMap = {
	active: { label: defaultGiftcardStrings.status.active, variant: 'success' as const },
	redeemed: { label: defaultGiftcardStrings.status.redeemed, variant: 'secondary' as const },
	expired: { label: defaultGiftcardStrings.status.expired, variant: 'error' as const },
	disabled: { label: defaultGiftcardStrings.status.disabled, variant: 'warning' as const },
};

export const gradientMap: Record<GradientVariant, { card: string; strip: string }> = {
	purple: {
		card: 'from-violet-600 via-purple-700 to-indigo-800',
		strip: 'from-violet-500 via-purple-600 to-indigo-700',
	},
	green: {
		card: 'from-emerald-600 via-teal-700 to-emerald-800',
		strip: 'from-emerald-500 via-teal-600 to-emerald-700',
	},
	warm: {
		card: 'from-orange-500 via-rose-600 to-pink-700',
		strip: 'from-orange-400 via-rose-500 to-pink-600',
	},
};

export const compactGradientMap: Record<GradientVariant, string> = {
	purple: 'from-violet-600 to-indigo-800',
	green: 'from-emerald-600 to-teal-800',
	warm: 'from-orange-500 to-rose-700',
};

export const accentColorMap: Record<AccentColor, { line: string; iconBg: string }> = {
	green: { line: 'bg-success', iconBg: 'bg-success/15 text-success' },
	purple: { line: 'bg-primary', iconBg: 'bg-primary/15 text-primary' },
	warm: { line: 'bg-warning', iconBg: 'bg-warning/15 text-warning-foreground' },
};

export const headerGradientMap: Record<HeaderColor, string> = {
	green: 'from-emerald-500 to-teal-600',
	blue: 'from-blue-500 to-indigo-600',
	amber: 'from-amber-500 to-orange-600',
};

export const headerIconBgMap: Record<HeaderColor, string> = {
	green: 'bg-emerald-500 ring-4 ring-white shadow-lg',
	blue: 'bg-blue-500 ring-4 ring-white shadow-lg',
	amber: 'bg-amber-500 ring-4 ring-white shadow-lg',
};
