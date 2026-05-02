export interface LoyaltyHistoryEntry {
    label: string;
    points: string;
    date: string;
    positive: boolean;
}

export interface LoyaltyPointsStrings {
    balanceLabel: string;
    pointsAvailable: string;
    redeem: string;
}

export const defaultLoyaltyPointsStrings: LoyaltyPointsStrings = {
    balanceLabel: 'Loyalty Balance',
    pointsAvailable: 'points available',
    redeem: 'Redeem Points',
};

export interface LoyaltyPointsCardProps {
    balance: number | string;
    tier?: string;
    tierVariant?: string;
    history?: LoyaltyHistoryEntry[];
    /** @deprecated Use `strings.redeem`. */
    redeemLabel?: string;
    onRedeem?: () => void;
    className?: string;
    strings?: Partial<LoyaltyPointsStrings>;
}
