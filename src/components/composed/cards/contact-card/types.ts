import type { ComposedBadgeVariant as BadgeVariant } from '@/components/base/badge/badge';

export interface ContactCardStrings {
    contact: string;
    profile: string;
}

export const defaultContactCardStrings: ContactCardStrings = {
    contact: 'Contact',
    profile: 'Profile',
};

export interface ContactCardProps {
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
    avatarUrl?: string;
    initials?: string;
    badge?: string;
    badgeVariant?: BadgeVariant;
    onContact?: () => void;
    onViewProfile?: () => void;
    className?: string;
    /** Override default action button labels. */
    strings?: Partial<ContactCardStrings>;
}
