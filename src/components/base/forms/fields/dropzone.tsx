import * as React from 'react';
/**
 * Dropzone — bare drag-and-drop chrome with click-to-browse fallback.
 *
 * Use this primitive directly when FileUpload / ImageUpload / MediaGallery
 * shapes don't fit (e.g. drag-to-attach into a chat composer, drag-into-grid
 * cell). Validation, file-state management, and previews are NOT included —
 * this component just surfaces a clean drop target and emits raw
 * `File` instances to the consumer via `onDrop`.
 *
 * Three sizes drive the minimum drop area, icon size, and instruction text
 * scale; `compact` is the smallest, `lg` matches a hero file picker.
 *
 * Strings overridable for i18n.
 */
import { useCallback, useRef, useState} from 'react';
import type { ReactNode, KeyboardEvent, MouseEvent, DragEvent, ChangeEvent, ForwardedRef} from 'react';
import { UploadCloud } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export type DropzoneSize = 'compact' | 'base' | 'lg';

export interface DropzoneStrings {
	instruction: string;
	helper: string;
	dragOver: string;
}

export const defaultDropzoneStrings: DropzoneStrings = {
	instruction: 'Drag files here or click to browse',
	helper: '',
	dragOver: 'Release to upload',
};

export interface DropzoneProps {
	onDrop: (files: File[]) => void;
	accept?: string;
	multiple?: boolean;
	disabled?: boolean;
	invalid?: boolean;
	size?: DropzoneSize;
	icon?: ReactNode;
	className?: string;
	/** Optional content rendered below the instruction (e.g. a "Browse" button). */
	children?: ReactNode;
	strings?: Partial<DropzoneStrings>;
}

const SIZE_CHROME: Record<DropzoneSize, { padding: string; minH: string; iconBox: string; iconSize: string }> = {
	compact: { padding: 'px-4 py-4', minH: 'min-h-[112px]', iconBox: 'h-9 w-9', iconSize: 'size-4' },
	base: { padding: 'px-6 py-8', minH: 'min-h-[180px]', iconBox: 'h-12 w-12', iconSize: 'size-6' },
	lg: { padding: 'px-8 py-12', minH: 'min-h-[260px]', iconBox: 'h-14 w-14', iconSize: 'size-7' },
};

function DropzoneImpl(
    {
	onDrop,
	accept,
	multiple = false,
	disabled = false,
	invalid = false,
	size = 'base',
	icon,
	className,
	children,
	strings: stringsProp,
}: DropzoneProps,
    forwardedRef: ForwardedRef<HTMLInputElement>,
) {
	const strings = useStrings(defaultDropzoneStrings, stringsProp);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const chrome = SIZE_CHROME[size];

	const openPicker = useCallback(() => {
		if (!disabled) inputRef.current?.click();
	}, [disabled]);

	const handleInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const list = e.target.files;
			if (!list || list.length === 0) return;
			onDrop(Array.from(list));
			if (inputRef.current) inputRef.current.value = '';
		},
		[onDrop],
	);

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
			onDrop(Array.from(list));
		},
		[disabled, onDrop],
	);

	const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openPicker();
		}
	};

	const handleClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.defaultPrevented) return;
		openPicker();
	};

	return (
		<div
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			aria-invalid={invalid || undefined}
			onClick={handleClick}
			onKeyDown={handleKey}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={cn('dropzone--component', 
				'relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center transition-colors duration-150',
				chrome.minH,
				chrome.padding,
				invalid ? 'border-destructive' : 'border-muted-foreground/40',
				'bg-muted/30 hover:border-primary hover:bg-primary/5 hover:text-primary',
				disabled && 'cursor-not-allowed opacity-50 hover:border-muted-foreground/40 hover:bg-muted/30 hover:text-muted-foreground',
				!disabled && isDragging && 'border-primary bg-primary/10 text-primary',
				className,
			)}
		>
			<input
				ref={(node) => { inputRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }}
				type="file"
				className="hidden"
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				onChange={handleInput}
				onClick={(e) => e.stopPropagation()}
			/>

			<span
				className={cn(
					'inline-flex items-center justify-center rounded-full bg-primary/10 text-primary',
					chrome.iconBox,
				)}
				aria-hidden="true"
			>
				{icon ?? <UploadCloud className={chrome.iconSize} />}
			</span>

			<div className="space-y-1">
				<Text size={size === 'compact' ? 'xs' : 'sm'} weight="medium">
					{isDragging ? strings.dragOver : strings.instruction}
				</Text>
				{!!strings.helper && (
					<Text size="xs" type="secondary">
						{strings.helper}
					</Text>
				)}
			</div>

			{!!children && (
				<div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
					{children}
				</div>
			)}
		</div>
	);
}

const Dropzone = React.forwardRef<HTMLInputElement, DropzoneProps>(DropzoneImpl);
Dropzone.displayName = 'Dropzone';

export { Dropzone };
