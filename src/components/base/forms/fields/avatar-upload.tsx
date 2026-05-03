import * as React from 'react';
/**
 * AvatarUpload — round avatar picker. Click or drag a file onto the circle to
 * upload; an X button (visible on hover) clears the selection. Honours
 * controlled `value` (a `File`), and reflects an existing `defaultPreviewUrl`
 * when no file is staged. Use for profile photos / org logos where the
 * preview is small and the only meaningful interaction is replace + clear.
 *
 * Pair with a separate "remove from server" handler if your data model
 * needs to delete a previously persisted image (this component only manages
 * the local staged file).
 *
 * Strings overridable for i18n.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent, ForwardedRef} from 'react';
import { Camera, X } from 'lucide-react';
import { Text } from '@/components/typography';
import { useFiles } from '@/hooks/use-files';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export type AvatarUploadSize = 'sm' | 'base' | 'lg';

export interface AvatarUploadStrings {
	change: string;
	remove: string;
	hint: string;
	dragOver: string;
}

export const defaultAvatarUploadStrings: AvatarUploadStrings = {
	change: 'Change photo',
	remove: 'Remove photo',
	hint: 'Click or drop an image',
	dragOver: 'Drop image to upload',
};

export interface AvatarUploadProps {
	value?: File;
	onChange?: (file?: File) => void;
	defaultPreviewUrl?: string;
	accept?: string;
	disabled?: boolean;
	invalid?: boolean;
	size?: AvatarUploadSize;
	className?: string;
	strings?: Partial<AvatarUploadStrings>;
	/** Initials shown when no preview is available. */
	initials?: string;
}

const SIZE_PX: Record<AvatarUploadSize, { box: string; icon: string; remove: string }> = {
	sm: { box: 'size-16', icon: 'size-4', remove: 'size-5' },
	base: { box: 'size-24', icon: 'size-5', remove: 'size-6' },
	lg: { box: 'size-32', icon: 'size-6', remove: 'size-7' },
};

function AvatarUploadImpl(
    {
	value,
	onChange,
	defaultPreviewUrl,
	accept = '.png,.jpg,.jpeg,.gif,.webp',
	disabled = false,
	invalid = false,
	size = 'base',
	className,
	strings: stringsProp,
	initials,
}: AvatarUploadProps,
    forwardedRef: ForwardedRef<HTMLInputElement>,
) {
	const strings = useStrings(defaultAvatarUploadStrings, stringsProp);
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const sizes = SIZE_PX[size];

	const { files, setFiles, removeAll } = useFiles({
		maxFiles: 1,
		allowedExtensions: useMemo(
			() =>
				accept
					.split(',')
					.map((s) => s.trim().replace(/^\./, '').toLowerCase())
					.filter(Boolean),
			[accept],
		),
	});

	useEffect(() => {
		if (value) setFiles([value]);
		else removeAll();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const selected = files[0];
	const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		const file = selected?.file ?? value;
		if (!file) {
			setFilePreviewUrl(undefined);
			return;
		}
		const url = URL.createObjectURL(file);
		setFilePreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [selected, value]);

	const previewUrl = filePreviewUrl ?? defaultPreviewUrl;
	const hasPreview = Boolean(previewUrl);

	const handleInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const list = e.target.files;
			if (!list || list.length === 0) return;
			setFiles(list);
			onChange?.(list[0]);
			if (inputRef.current) inputRef.current.value = '';
		},
		[onChange, setFiles],
	);

	const trigger = useCallback(() => {
		if (!disabled) inputRef.current?.click();
	}, [disabled]);

	const handleRemove = useCallback(() => {
		removeAll();
		onChange?.(undefined);
		if (inputRef.current) inputRef.current.value = '';
	}, [onChange, removeAll]);

	const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			trigger();
		}
	};

	const handleDragEnter = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (!disabled) setIsDragging(true);
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			if (disabled) return;
			const list = e.dataTransfer?.files;
			if (!list || list.length === 0) return;
			setFiles(list);
			onChange?.(list[0]);
		},
		[disabled, onChange, setFiles],
	);

	return (
		<div className={cn('avatar-upload--component', 'inline-flex flex-col items-center gap-2', className)}>
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled || undefined}
				aria-invalid={invalid || undefined}
				onClick={trigger}
				onKeyDown={handleKey}
				onDragEnter={handleDragEnter}
				onDragOver={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					'group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
					'border border-dashed transition-colors duration-150 outline-none',
					'focus-visible:ring-2 focus-visible:ring-ring/50',
					hasPreview
						? 'border-border/60 bg-muted/20'
						: cn(
								'bg-muted/30 hover:border-primary hover:bg-primary/5',
								invalid ? 'border-destructive' : 'border-muted-foreground/40',
							),
					disabled && 'cursor-not-allowed opacity-50',
					!disabled && isDragging && 'border-primary bg-primary/10',
					sizes.box,
				)}
			>
				<input
					id={inputId}
					ref={(node) => { inputRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
					type="file"
					className="sr-only"
					accept={accept}
					disabled={disabled}
					onChange={handleInput}
				/>

				{hasPreview && previewUrl ? (
					<img
						src={previewUrl}
						alt={strings.change}
						className="absolute inset-0 size-full object-cover"
					/>
				) : initials ? (
					<Text size={size === 'lg' ? 'lg' : 'base'} weight="bold" className="leading-none">
						{initials}
					</Text>
				) : (
					<Camera className={cn(sizes.icon, 'text-muted-foreground')} aria-hidden="true" />
				)}

				{/* Hover overlay */}
				{!disabled && hasPreview && (
					<div
						className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex"
						aria-hidden="true"
					>
						<Camera className={sizes.icon} />
					</div>
				)}

				{/* Remove pill */}
				{!disabled && hasPreview && (
					<button
						type="button"
						aria-label={strings.remove}
						onClick={(e) => {
							e.stopPropagation();
							handleRemove();
						}}
						className={cn(
							'absolute right-0.5 top-0.5 inline-flex items-center justify-center rounded-full bg-card text-foreground shadow ring-1 ring-border',
							'opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
							sizes.remove,
						)}
					>
						<X className="size-3" />
					</button>
				)}

				{!disabled && !hasPreview && isDragging && (
					<Text size="xxs" weight="medium" className="absolute inset-x-0 bottom-1.5 text-center text-primary">
						{strings.dragOver}
					</Text>
				)}
			</div>

			{!hasPreview && (
				<Text size="xs" type="secondary">
					{strings.hint}
				</Text>
			)}
		</div>
	);
}

const AvatarUpload = React.forwardRef<HTMLInputElement, AvatarUploadProps>(AvatarUploadImpl);
AvatarUpload.displayName = 'AvatarUpload';

export { AvatarUpload };
