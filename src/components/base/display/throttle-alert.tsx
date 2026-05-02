/**
 * ThrottleAlert — destructive alert for rate-limit / throttling errors.
 *
 * Single header icon, primary message, and a tight inline meta row showing
 * `attempts` and `remaining`. Use as a banner above a form when a request
 * has been blocked and the user must wait. Strings overridable for i18n.
 */
import { ShieldAlert, Clock, RotateCcw } from 'lucide-react';

import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export interface ThrottleAlertStrings {
	maxAttempts: string;
	tryAgainIn: string;
}

export const defaultThrottleAlertStrings: ThrottleAlertStrings = {
	maxAttempts: 'Max attempts',
	tryAgainIn: 'Try again in',
};

export interface ThrottleAlertProps {
	message: string;
	attempts: number;
	remaining: string;
	className?: string;
	strings?: Partial<ThrottleAlertStrings>;
}

export function ThrottleAlert({
	message,
	attempts,
	remaining,
	className,
	strings: stringsProp,
}: ThrottleAlertProps) {
	const strings = useStrings(defaultThrottleAlertStrings, stringsProp);

	return (
		<div
			role="alert"
			className={cn(
				'flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3',
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"
			>
				<ShieldAlert className="size-4" />
			</span>
			<div className="min-w-0 flex-1 space-y-1.5">
				<Text weight="medium" className="text-destructive leading-snug">
					{message}
				</Text>
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-destructive/80">
					<span className="inline-flex items-center gap-1.5">
						<RotateCcw className="size-3" aria-hidden="true" />
						<span>{strings.maxAttempts}</span>
						<span className="font-semibold tabular-nums text-destructive">{attempts}</span>
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock className="size-3" aria-hidden="true" />
						<span>{strings.tryAgainIn}</span>
						<span className="font-semibold tabular-nums text-destructive">{remaining}</span>
					</span>
				</div>
			</div>
		</div>
	);
}

ThrottleAlert.displayName = 'ThrottleAlert';
