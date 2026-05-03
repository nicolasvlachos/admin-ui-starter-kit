/**
 * UploadTray — the canonical "drag-and-drop area + per-file progress
 * rows + summary toolbar" surface. Composes:
 *
 *   - `Dropzone`            — drag/drop chrome + click-to-browse
 *   - `UploadProgressList`  — per-file row with status icon + progress
 *                             bar + cancel/retry/remove actions
 *   - `Badge`               — status counters in the toolbar
 *   - `Button`              — "Clear all" action
 *
 * Framework-agnostic. Every action is callback-driven — the library
 * doesn't perform the upload; it surfaces the UX. The consumer wires
 * the actual transfer (XHR, fetch, S3 multipart, …) and feeds back
 * `progress` / `status` updates by mutating the `items` array.
 *
 * Pair with `useFiles` (the existing client-side validation hook) at
 * the call site if you want pre-flight size/type rejection.
 */
import { forwardRef, useCallback } from 'react';

import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/buttons';
import { Text } from '@/components/typography';
import { useStrings, type StringsProp } from '@/lib/strings';
import { cn } from '@/lib/utils';

import { Dropzone, type DropzoneProps } from './dropzone';
import {
	UploadProgressList,
	type UploadItem,
	type UploadProgressListStrings,
} from './upload-progress-list';

export interface UploadTrayStrings {
	heading: string;
	completedLabel: string;
	failedLabel: string;
	uploadingLabel: string;
	queuedLabel: string;
	clearAll: string;
}

export const defaultUploadTrayStrings: UploadTrayStrings = {
	heading: 'Upload progress',
	completedLabel: 'Completed',
	failedLabel: 'Failed',
	uploadingLabel: 'Uploading',
	queuedLabel: 'Queued',
	clearAll: 'Clear all',
};

export interface UploadTrayProps {
	/** Files currently in the tray (queued / uploading / done / error / cancelled). */
	items: UploadItem[];
	/**
	 * Fires when the user drops or browses files. The library does NOT
	 * write to the items array — the consumer turns these into queued
	 * `UploadItem`s, kicks off the actual transfer, and updates progress.
	 */
	onAddFiles: (files: File[]) => void;
	/** Per-row cancel handler (passed through to UploadProgressList). */
	onCancel?: (id: string) => void;
	/** Per-row retry handler. */
	onRetry?: (id: string) => void;
	/** Per-row remove handler. */
	onRemove?: (id: string) => void;
	/**
	 * Clears the entire tray. When omitted, the "Clear all" button is
	 * hidden — useful for surfaces where in-flight uploads can't be
	 * cancelled in bulk.
	 */
	onClearAll?: () => void;
	/** Forwarded to the inner `<Dropzone>`. Only the meaningful subset. */
	dropzone?: Pick<
		DropzoneProps,
		'accept' | 'multiple' | 'size' | 'disabled' | 'invalid' | 'strings'
	>;
	className?: string;
	strings?: StringsProp<UploadTrayStrings>;
	/** Strings forwarded to the inner `<UploadProgressList>`. */
	listStrings?: StringsProp<UploadProgressListStrings>;
}

function countStatus(items: UploadItem[]) {
	let completed = 0;
	let failed = 0;
	let uploading = 0;
	let queued = 0;
	for (const item of items) {
		if (item.status === 'done') completed += 1;
		else if (item.status === 'error') failed += 1;
		else if (item.status === 'uploading') uploading += 1;
		else if (item.status === 'queued') queued += 1;
	}
	return { completed, failed, uploading, queued };
}

export const UploadTray = forwardRef<HTMLDivElement, UploadTrayProps>(function UploadTray({
	items,
	onAddFiles,
	onCancel,
	onRetry,
	onRemove,
	onClearAll,
	dropzone,
	className,
	strings: stringsProp,
	listStrings,
}, ref) {
	const strings = useStrings(defaultUploadTrayStrings, stringsProp);
	const { completed, failed, uploading, queued } = countStatus(items);

	const handleDrop = useCallback(
		(files: File[]) => {
			if (files.length > 0) onAddFiles(files);
		},
		[onAddFiles],
	);

	const hasItems = items.length > 0;

	return (
		<div ref={ref} className={cn('upload-tray--component', 'flex flex-col gap-4', className)}>
			<Dropzone
				onDrop={handleDrop}
				accept={dropzone?.accept}
				multiple={dropzone?.multiple}
				size={dropzone?.size}
				disabled={dropzone?.disabled}
				invalid={dropzone?.invalid}
				strings={dropzone?.strings}
			/>

			{!!hasItems && (
				<>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<Text tag="span" weight="semibold">
								{strings.heading}
							</Text>
							{completed > 0 && (
								<Badge variant="success">
									{strings.completedLabel}: {completed}
								</Badge>
							)}
							{failed > 0 && (
								<Badge variant="destructive">
									{strings.failedLabel}: {failed}
								</Badge>
							)}
							{uploading > 0 && (
								<Badge variant="info">
									{strings.uploadingLabel}: {uploading}
								</Badge>
							)}
							{queued > 0 && (
								<Badge variant="secondary">
									{strings.queuedLabel}: {queued}
								</Badge>
							)}
						</div>
						{!!onClearAll && (
							<Button variant="secondary" buttonStyle="ghost" onClick={onClearAll}>
								{strings.clearAll}
							</Button>
						)}
					</div>

					<UploadProgressList
						items={items}
						onCancel={onCancel}
						onRetry={onRetry}
						onRemove={onRemove}
						strings={listStrings}
					/>
				</>
			)}

		</div>
	);
});

UploadTray.displayName = 'UploadTray';
