/**
 * AiAttachment — single attachment chip used in chat messages, prompt input
 * staging, and tool inputs. Renders an icon (or thumbnail), filename, and
 * optional meta line, with optional remove + click-to-open. When `progress`
 * is in `[0,1)` a thin progress bar runs underneath while the upload is in
 * flight.
 */
import {
	AlertCircle,
	Archive,
	AudioLines,
	FileCode,
	FileText,
	ImageIcon,
	Video,
	X,
	type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

import {
	defaultAiAttachmentStrings,
	type AiAttachmentKind,
	type AiAttachmentProps,
} from './types';

const KIND_ICON: Record<AiAttachmentKind, LucideIcon> = {
	image: ImageIcon,
	document: FileText,
	audio: AudioLines,
	video: Video,
	code: FileCode,
	archive: Archive,
	generic: FileText,
};

export function AiAttachment({
	name,
	meta,
	kind = 'generic',
	icon,
	thumbnailUrl,
	progress,
	errored = false,
	onOpen,
	onRemove,
	className,
	strings: stringsProp,
}: AiAttachmentProps) {
	const strings = useStrings(defaultAiAttachmentStrings, stringsProp);
	const Icon = icon ?? KIND_ICON[kind];
	const showProgress =
		!errored && typeof progress === 'number' && progress >= 0 && progress < 1;

	const Body = (
		<>
			{thumbnailUrl ? (
				<span
					aria-hidden
					className="size-9 shrink-0 overflow-hidden rounded-md bg-muted"
					style={{
						backgroundImage: `url(${thumbnailUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
			) : (
				<span
					aria-hidden
					className={cn(
						'inline-flex size-9 shrink-0 items-center justify-center rounded-md',
						errored
							? 'bg-destructive/10 text-destructive'
							: 'bg-muted text-muted-foreground',
					)}
				>
					{errored ? (
						<AlertCircle className="size-4" />
					) : (
						<Icon className="size-4" />
					)}
				</span>
			)}
			<div className="min-w-0 flex-1">
				<Text weight="medium" className="block truncate">
					{name}
				</Text>
				{!!meta && (
					<Text size="xxs" type="secondary" className="block truncate tabular-nums">
						{meta}
					</Text>
				)}
				{showProgress && (
					<div
						className="mt-1 h-1 overflow-hidden rounded-full bg-muted"
						aria-label="Upload progress"
					>
						<div
							className="h-full rounded-full bg-primary transition-[width] duration-150"
							style={{ width: `${Math.round((progress ?? 0) * 100)}%` }}
						/>
					</div>
				)}
			</div>
		</>
	);

	return (
		<div
			className={cn(
				'group inline-flex max-w-full items-center gap-2.5 rounded-lg border border-border/60 bg-card px-2.5 py-2',
				errored && 'border-destructive/40 bg-destructive/5',
				className,
			)}
		>
			{onOpen ? (
				<button
					type="button"
					onClick={onOpen}
					aria-label={strings.openAria}
					className={cn(
						'flex min-w-0 flex-1 items-center gap-2.5 text-left',
						'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
					)}
				>
					{Body}
				</button>
			) : (
				<div className="flex min-w-0 flex-1 items-center gap-2.5">{Body}</div>
			)}

			{!!onRemove && (
				<Button
					type="button"
					variant="secondary"
					buttonStyle="ghost"
					size="icon-xs"
					aria-label={strings.removeAria}
					onClick={onRemove}
					className="opacity-60 group-hover:opacity-100"
				>
					<X className="size-3.5" />
				</Button>
			)}
		</div>
	);
}

AiAttachment.displayName = 'AiAttachment';
