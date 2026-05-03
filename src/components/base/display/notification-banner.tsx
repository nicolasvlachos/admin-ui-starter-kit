/**
 * NotificationBanner — full-width inline notification with type-specific
 * styling (info / success / error / warning). The icon sits in a soft circle
 * for clear hierarchy, the title (when present) reads at full strength, and
 * the message uses the muted secondary tone so the type colour highlights
 * without overwhelming. Optional dismiss button on the trailing edge.
 *
 * Use inside page bodies for non-blocking notices; reach for `Alert` when
 * the affordance is structural (e.g. inside a form), and Toast for transient
 * feedback.
 */
import { AlertTriangle, BadgeCheck, CircleAlert, Info, X } from 'lucide-react';
import React from 'react';

import { Text } from '@/components/typography';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { cn } from '@/lib/utils';

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface NotificationBannerProps {
	type?: NotificationType;
	dismissible?: boolean;
	title?: string;
	message?: string;
	onDismiss?: () => void;
	children?: React.ReactNode;
	asHTML?: boolean;
	dismissAriaLabel?: string;
	className?: string;
}

interface BannerTone {
	wrapper: string;
	iconRing: string;
	iconColor: string;
	title: string;
	close: string;
}

const TONES: Record<NotificationType, BannerTone> = {
	info: {
		wrapper: 'border-info/30 bg-info/5',
		iconRing: 'bg-info/15',
		iconColor: 'text-info',
		title: 'text-info',
		close: 'text-info/70 hover:text-info hover:bg-info/10',
	},
	success: {
		wrapper: 'border-success/30 bg-success/5',
		iconRing: 'bg-success/15',
		iconColor: 'text-success',
		title: 'text-success',
		close: 'text-success/70 hover:text-success hover:bg-success/10',
	},
	error: {
		wrapper: 'border-destructive/30 bg-destructive/5',
		iconRing: 'bg-destructive/15',
		iconColor: 'text-destructive',
		title: 'text-destructive',
		close: 'text-destructive/70 hover:text-destructive hover:bg-destructive/10',
	},
	warning: {
		wrapper: 'border-warning/40 bg-warning/10',
		iconRing: 'bg-warning/20',
		iconColor: 'text-warning-foreground',
		title: 'text-warning-foreground',
		close: 'text-warning-foreground/70 hover:text-warning-foreground hover:bg-warning/20',
	},
};

const ICONS: Record<NotificationType, React.ElementType> = {
	info: Info,
	success: BadgeCheck,
	error: CircleAlert,
	warning: AlertTriangle,
};

function SanitizedSpan({ html }: { html: string }) {
	return React.createElement('span', { dangerouslySetInnerHTML: { __html: html } });
}

export function NotificationBanner({
	type = 'info',
	dismissible = false,
	title,
	message,
	onDismiss,
	children,
	asHTML = false,
	dismissAriaLabel = 'Dismiss notification',
	className,
}: NotificationBannerProps) {
	const tone = TONES[type];
	const IconComponent = ICONS[type];
	const sanitizedHtml = React.useMemo(
		() => sanitizeHtml(message ?? (typeof children === 'string' ? children : '')),
		[children, message],
	);
	const hasTitle = !!title;

	return (
		<div
			role="status"
			className={cn('notification-banner--component', 
				'flex w-full items-start gap-3 rounded-lg border px-4 py-3',
				'animate-in fade-in-0 slide-in-from-bottom-1 duration-200',
				tone.wrapper,
				className,
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					'mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full',
					tone.iconRing,
					tone.iconColor,
				)}
			>
				<IconComponent className="size-4" />
			</span>

			<div className="min-w-0 flex-1">
				{hasTitle && (
					<Text
						tag="div"
						weight="semibold"
						className="leading-snug text-foreground"
					>
						{title}
					</Text>
				)}
				<Text
					tag="div"
					type={hasTitle ? 'secondary' : 'main'}
					className={cn('break-words leading-snug', hasTitle && 'mt-0.5')}
				>
					{!!asHTML && <SanitizedSpan html={sanitizedHtml} />}
					{!asHTML && (message ?? children)}
				</Text>
			</div>

			{!!dismissible && (
				<button
					type="button"
					aria-label={dismissAriaLabel}
					onClick={onDismiss}
					className={cn(
						'-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
						tone.close,
					)}
				>
					<X className="size-4" />
				</button>
			)}
		</div>
	);
}

NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner;
