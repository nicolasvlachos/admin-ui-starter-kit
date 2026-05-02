/**
 * AiConfirmation — inline approval prompt rendered in-stream when an agent
 * needs user permission before taking a side-effecting action (run command,
 * call write API, charge a card). Carries title, description, icon, optional
 * details, and an approve/reject pair. After resolution, the action row
 * collapses into a status pill.
 */
import { Check, ShieldCheck, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { IconBadge } from '@/components/base/display';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiConfirmationStrings,
	type AiConfirmationProps,
	type AiConfirmationTone,
} from './types';

const TONE: Record<
	AiConfirmationTone,
	{ ring: string; icon: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted' }
> = {
	neutral: { ring: 'border-border/60 bg-card', icon: 'muted' },
	destructive: { ring: 'border-destructive/40 bg-destructive/5', icon: 'destructive' },
	warning: { ring: 'border-warning/40 bg-warning/5', icon: 'warning' },
	info: { ring: 'border-info/40 bg-info/5', icon: 'info' },
	primary: { ring: 'border-primary/40 bg-primary/5', icon: 'primary' },
};

export function AiConfirmation({
	title,
	description,
	icon,
	tone = 'neutral',
	status = 'pending',
	onApprove,
	onReject,
	approveLabel,
	rejectLabel,
	details,
	className,
	strings: stringsProp,
}: AiConfirmationProps) {
	const strings = useStrings(defaultAiConfirmationStrings, stringsProp);
	const Icon: LucideIcon = icon ?? ShieldCheck;
	const toneCfg = TONE[tone];

	return (
		<div
			role="region"
			aria-live="polite"
			className={cn(
				'rounded-lg border px-3 py-2.5',
				toneCfg.ring,
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<IconBadge icon={Icon} tone={toneCfg.icon} size="sm" shape="square" />
				<div className="min-w-0 flex-1">
					<Text weight="semibold">{title}</Text>
					{!!description && (
						<Text size="xs" type="secondary" className="mt-1">
							{description}
						</Text>
					)}
					{!!details && <div className="mt-2">{details}</div>}
				</div>
			</div>

			{status === 'pending' ? (
				<div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
					<Text size="xxs" type="secondary">
						{strings.pending}
					</Text>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="secondary"
							buttonStyle="ghost"
							onClick={onReject}
						>
							<X className="size-3.5" />
							{rejectLabel ?? strings.reject}
						</Button>
						<Button
							type="button"
							variant={tone === 'destructive' ? 'error' : 'primary'}
							onClick={onApprove}
						>
							<Check className="size-3.5" />
							{approveLabel ?? strings.approve}
						</Button>
					</div>
				</div>
			) : (
				<div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-2.5">
					{status === 'approved' ? (
						<>
							<Check className="size-3.5 text-success" />
							<Text size="xs" type="success" weight="medium">
								{strings.approved}
							</Text>
						</>
					) : (
						<>
							<X className="size-3.5 text-muted-foreground" />
							<Text size="xs" type="secondary" weight="medium">
								{strings.rejected}
							</Text>
						</>
					)}
				</div>
			)}
		</div>
	);
}

AiConfirmation.displayName = 'AiConfirmation';
