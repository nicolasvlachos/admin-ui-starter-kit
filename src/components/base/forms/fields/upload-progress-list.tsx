/**
 * UploadProgressList — render-only list of in-flight uploads. Each row shows
 * a status icon (queued / uploading / done / error / cancelled), filename,
 * size, a progress bar driven by `progress` (0–100), and an action button
 * that maps to the row's status (cancel while uploading, retry on error,
 * remove when done). Pair with FileUpload / MediaGallery / Dropzone — those
 * components emit raw `File` instances; this one displays the upload UI
 * once the consumer has wired them to its API.
 *
 * Strings overridable for i18n.
 */
import {
	AlertCircle,
	Check,
	Clock,
	RefreshCw,
	UploadCloud,
	X,
} from 'lucide-react';
import { Text } from '@/components/typography';
import { Button } from '@/components/base/buttons';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export type UploadStatus = 'queued' | 'uploading' | 'done' | 'error' | 'cancelled';

export interface UploadItem {
	id: string;
	name: string;
	/** Pre-formatted size string (e.g. "2.4 MB"). */
	size?: string;
	/** Upload progress 0–100. Ignored when status is `done`/`error`/`cancelled`. */
	progress?: number;
	status: UploadStatus;
	/** Error message rendered under the row when status is `error`. */
	error?: string;
	/**
	 * Optional thumbnail URL — when set and the consumer renders this list
	 * inside `<UploadTray>`, the row uses the thumbnail in place of the
	 * status icon. Pure-`<UploadProgressList>` callers can ignore this.
	 */
	preview?: string;
}

export interface UploadProgressListStrings {
	queued: string;
	uploading: string;
	done: string;
	error: string;
	cancelled: string;
	cancel: string;
	retry: string;
	remove: string;
}

export const defaultUploadProgressListStrings: UploadProgressListStrings = {
	queued: 'Queued',
	uploading: 'Uploading',
	done: 'Uploaded',
	error: 'Failed',
	cancelled: 'Cancelled',
	cancel: 'Cancel',
	retry: 'Retry',
	remove: 'Remove',
};

export interface UploadProgressListProps {
	items: UploadItem[];
	onCancel?: (id: string) => void;
	onRetry?: (id: string) => void;
	onRemove?: (id: string) => void;
	className?: string;
	strings?: Partial<UploadProgressListStrings>;
}

const STATUS_TONE: Record<
	UploadStatus,
	{ icon: typeof Check; bg: string; fg: string; bar: string }
> = {
	queued: { icon: Clock, bg: 'bg-muted', fg: 'text-muted-foreground', bar: 'bg-muted-foreground/30' },
	uploading: { icon: UploadCloud, bg: 'bg-primary/15', fg: 'text-primary', bar: 'bg-primary' },
	done: { icon: Check, bg: 'bg-success/15', fg: 'text-success', bar: 'bg-success' },
	error: { icon: AlertCircle, bg: 'bg-destructive/15', fg: 'text-destructive', bar: 'bg-destructive' },
	cancelled: { icon: X, bg: 'bg-muted', fg: 'text-muted-foreground', bar: 'bg-muted-foreground/30' },
};

export function UploadProgressList({
	items,
	onCancel,
	onRetry,
	onRemove,
	className,
	strings: stringsProp,
}: UploadProgressListProps) {
	const strings = useStrings(defaultUploadProgressListStrings, stringsProp);
	const statusLabel: Record<UploadStatus, string> = {
		queued: strings.queued,
		uploading: strings.uploading,
		done: strings.done,
		error: strings.error,
		cancelled: strings.cancelled,
	};

	if (items.length === 0) return null;

	return (
		<ul className={cn('space-y-2', className)}>
			{items.map((item) => {
				const tone = STATUS_TONE[item.status];
				const Icon = tone.icon;
				const pct =
					item.status === 'done'
						? 100
						: item.status === 'cancelled' || item.status === 'error'
							? item.progress ?? 0
							: Math.max(0, Math.min(100, item.progress ?? 0));
				const showProgress = item.status === 'uploading' || item.status === 'queued';
				return (
					<li
						key={item.id}
						className="rounded-md border border-border/60 bg-card px-3 py-2"
					>
						<div className="flex items-center gap-3">
							<span
								className={cn(
									'inline-flex size-7 shrink-0 items-center justify-center rounded-md',
									tone.bg,
									tone.fg,
								)}
							>
								<Icon
									className={cn(
										'size-3.5',
										item.status === 'uploading' && 'animate-pulse',
									)}
								/>
							</span>
							<div className="min-w-0 flex-1">
								<div className="flex items-baseline justify-between gap-2">
									<Text weight="medium" className="truncate">
										{item.name}
									</Text>
									<Text size="xxs" type="secondary" className="shrink-0 tabular-nums">
										{item.size}
									</Text>
								</div>
								{showProgress ? (
									<div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
										<div
											className={cn('h-full rounded-full transition-[width] duration-200', tone.bar)}
											style={{ width: `${pct}%` }}
										/>
									</div>
								) : (
									<Text size="xxs" type={item.status === 'error' ? 'error' : 'secondary'}>
										{statusLabel[item.status]}
										{item.status === 'error' && !!item.error && ` — ${item.error}`}
									</Text>
								)}
							</div>

							<div className="flex shrink-0 items-center gap-1">
								{item.status === 'uploading' && !!onCancel && (
									<Button
										type="button"
										variant="secondary"
										buttonStyle="ghost"
										size="icon-xs"
										aria-label={strings.cancel}
										onClick={() => onCancel(item.id)}
									>
										<X className="size-3.5" />
									</Button>
								)}
								{item.status === 'error' && !!onRetry && (
									<Button
										type="button"
										variant="secondary"
										buttonStyle="ghost"
										size="icon-xs"
										aria-label={strings.retry}
										onClick={() => onRetry(item.id)}
									>
										<RefreshCw className="size-3.5" />
									</Button>
								)}
								{(item.status === 'done' ||
									item.status === 'error' ||
									item.status === 'cancelled') &&
									!!onRemove && (
										<Button
											type="button"
											variant="secondary"
											buttonStyle="ghost"
											size="icon-xs"
											aria-label={strings.remove}
											onClick={() => onRemove(item.id)}
										>
											<X className="size-3.5" />
										</Button>
									)}
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}

UploadProgressList.displayName = 'UploadProgressList';
