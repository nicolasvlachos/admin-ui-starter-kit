/**
 * Default per-event configuration. Consumers override individual events by
 * spreading this map and overwriting the keys they care about, e.g.:
 *
 *   import { defaultActivityEventConfig } from '@/components/features/activities';
 *
 *   const eventConfig = {
 *       ...defaultActivityEventConfig,
 *       order_refunded: { icon: Receipt, tone: 'warning', label: 'Refunded' },
 *   };
 *
 * The mass `eventConfig` prop on `<ActivityFeed />` is shallow-merged on top
 * of these defaults, so any unspecified event falls back to the library
 * default and ultimately to the neutral `defaultEvent` entry below.
 */
import {
    AlertTriangle,
    ArrowLeftRight,
    Ban,
    Check,
    CircleDot,
    FileEdit,
    Flag,
    Heart,
    LinkIcon,
    Mail,
    MailCheck,
    MailOpen,
    MailX,
    MessageSquare,
    Pencil,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Trash2,
    UserMinus,
    UserPlus,
} from 'lucide-react';

import type { ActivityEventConfig, ActivityEventConfigMap } from './activities.types';

/** Neutral fallback used when an event has no entry in the registry. */
export const defaultEventConfig: ActivityEventConfig = {
    icon: CircleDot,
    tone: 'neutral',
};

export const defaultActivityEventConfig: ActivityEventConfigMap = {
    // Lifecycle
    created: { icon: Plus, tone: 'success', label: 'Created' },
    updated: { icon: Pencil, tone: 'info', label: 'Updated' },
    edited: { icon: FileEdit, tone: 'info', label: 'Edited' },
    deleted: { icon: Trash2, tone: 'destructive', label: 'Deleted' },
    cancelled: { icon: Ban, tone: 'destructive', label: 'Cancelled' },
    restored: { icon: Sparkles, tone: 'success', label: 'Restored' },

    // Status transitions
    status_changed: { icon: ArrowLeftRight, tone: 'primary', label: 'Status changed' },
    status_transition: { icon: ArrowLeftRight, tone: 'primary', label: 'Status changed' },
    status_override: { icon: ArrowLeftRight, tone: 'warning', label: 'Status overridden' },

    // People
    assigned: { icon: UserPlus, tone: 'info', label: 'Assigned' },
    unassigned: { icon: UserMinus, tone: 'destructive', label: 'Unassigned' },

    // Mail
    mail_sent: { icon: Mail, tone: 'info', label: 'Email sent' },
    mail_delivered: { icon: MailCheck, tone: 'success', label: 'Email delivered' },
    mail_opened: { icon: MailOpen, tone: 'info', label: 'Email opened' },
    mail_clicked: { icon: MailOpen, tone: 'info', label: 'Email clicked' },
    mail_bounced: { icon: MailX, tone: 'destructive', label: 'Email bounced' },
    mail_failed: { icon: MailX, tone: 'destructive', label: 'Email failed' },

    // Comments
    comment_created: { icon: MessageSquare, tone: 'warning', label: 'Comment posted' },
    comment_deleted: { icon: MessageSquare, tone: 'destructive', label: 'Comment deleted' },

    // Commerce
    paid: { icon: Check, tone: 'success', label: 'Paid' },
    refunded: { icon: ArrowLeftRight, tone: 'warning', label: 'Refunded' },
    confirmed: { icon: ShieldCheck, tone: 'success', label: 'Confirmed' },
    favorited: { icon: Heart, tone: 'warning', label: 'Favorited' },
    ordered: { icon: ShoppingBag, tone: 'primary', label: 'Order placed' },

    // Publishing
    published: { icon: Star, tone: 'success', label: 'Published' },
    flagged: { icon: Flag, tone: 'warning', label: 'Flagged' },
    linked: { icon: LinkIcon, tone: 'info', label: 'Linked' },

    // Failures
    failed: { icon: AlertTriangle, tone: 'destructive', label: 'Failed' },
    health_check_failed: { icon: AlertTriangle, tone: 'destructive', label: 'Health check failed' },
};

/** Resolve `eventConfig[event]` with override + default fallback. */
export function resolveEventConfig(
    event: string,
    map: ActivityEventConfigMap,
): ActivityEventConfig {
    return map[event] ?? defaultEventConfig;
}
