/**
 * MediaGallery — multi-image upload + sortable thumbnail grid. Drop a batch
 * of images onto the dashed top tile or click to open the picker; tiles
 * appear inline and can be reordered via drag (`@dnd-kit/sortable`). The
 * first tile is implicitly the "cover" and is marked with a small chip;
 * each tile has a hover-revealed remove button.
 *
 * Use for product galleries, mood boards, or any collection where the order
 * matters and the consumer needs the final `File[]` (and the order of those
 * files) on submit.
 *
 * Strings overridable for i18n.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import {
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	rectSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImagePlus, X } from 'lucide-react';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export interface MediaGalleryStrings {
	addInstruction: string;
	helper: string;
	dragOver: string;
	cover: string;
	removeAria: string;
	maxReached: string;
}

export const defaultMediaGalleryStrings: MediaGalleryStrings = {
	addInstruction: 'Drop or click to add images',
	helper: '',
	dragOver: 'Release to upload',
	cover: 'Cover',
	removeAria: 'Remove image',
	maxReached: 'You have reached the maximum number of images.',
};

export interface MediaGalleryProps {
	value?: File[];
	onChange?: (files: File[]) => void;
	accept?: string;
	maxFiles?: number;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
	tileClassName?: string;
	strings?: Partial<MediaGalleryStrings>;
}

interface InternalItem {
	id: string;
	file: File;
	previewUrl: string;
}

let counter = 0;
const makeId = () => `media-${Date.now().toString(36)}-${(counter++).toString(36)}`;

function SortableTile({
	item,
	isFirst,
	disabled,
	onRemove,
	strings,
	tileClassName,
}: {
	item: InternalItem;
	isFirst: boolean;
	disabled: boolean;
	onRemove: () => void;
	strings: MediaGalleryStrings;
	tileClassName?: string;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: item.id, disabled });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	} as React.CSSProperties;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted/30',
				'cursor-grab active:cursor-grabbing',
				isDragging && 'z-10 shadow-lg ring-2 ring-primary/40',
				disabled && 'pointer-events-none opacity-50',
				tileClassName,
			)}
			{...attributes}
			{...listeners}
		>
			<img
				src={item.previewUrl}
				alt={item.file.name}
				className="absolute inset-0 size-full object-cover"
				draggable={false}
			/>
			{isFirst && (
				<span
					className="absolute left-1.5 top-1.5 rounded-full bg-card/90 px-1.5 py-0.5 text-xxs font-semibold text-foreground shadow ring-1 ring-border"
				>
					{strings.cover}
				</span>
			)}
			<button
				type="button"
				aria-label={strings.removeAria}
				onPointerDown={(e) => e.stopPropagation()}
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				className={cn(
					'absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-card text-foreground shadow ring-1 ring-border',
					'opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
				)}
			>
				<X className="size-3.5" />
			</button>
		</div>
	);
}

export function MediaGallery({
	value,
	onChange,
	accept = '.png,.jpg,.jpeg,.gif,.webp',
	maxFiles,
	disabled = false,
	invalid = false,
	className,
	tileClassName,
	strings: stringsProp,
}: MediaGalleryProps) {
	const strings = useStrings(defaultMediaGalleryStrings, stringsProp);
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [items, setItems] = useState<InternalItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

	// Track the live preview-URL set in a ref so the unmount cleanup sees the
	// latest values without depending on render-time `items`. Without this,
	// the cleanup closes over the initial empty array and any object URLs
	// created during the lifetime of the component leak (the browser will
	// still hold them until the document unloads).
	const itemsRef = useRef<InternalItem[]>([]);
	itemsRef.current = items;

	// Reflect controlled value
	useEffect(() => {
		if (!value) return;
		setItems((prev) => {
			// Skip if files are equal references already (avoid resetting URLs).
			if (prev.length === value.length && prev.every((p, i) => p.file === value[i])) {
				return prev;
			}
			// Revoke old URLs we no longer use.
			prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
			return value.map((file) => ({
				id: makeId(),
				file,
				previewUrl: URL.createObjectURL(file),
			}));
		});
	}, [value]);

	// Cleanup on unmount — revoke whatever previews were live at the time.
	useEffect(() => {
		return () => {
			itemsRef.current.forEach((it) => URL.revokeObjectURL(it.previewUrl));
		};
	}, []);

	const emit = useCallback(
		(next: InternalItem[]) => {
			onChange?.(next.map((it) => it.file));
		},
		[onChange],
	);

	const addFiles = useCallback(
		(incoming: File[]) => {
			if (disabled) return;
			setItems((prev) => {
				const remaining = maxFiles !== undefined ? Math.max(0, maxFiles - prev.length) : incoming.length;
				const accepted = incoming.slice(0, remaining);
				const additions: InternalItem[] = accepted.map((file) => ({
					id: makeId(),
					file,
					previewUrl: URL.createObjectURL(file),
				}));
				const next = [...prev, ...additions];
				emit(next);
				return next;
			});
		},
		[disabled, emit, maxFiles],
	);

	const remove = useCallback(
		(id: string) => {
			setItems((prev) => {
				const target = prev.find((p) => p.id === id);
				if (target) URL.revokeObjectURL(target.previewUrl);
				const next = prev.filter((p) => p.id !== id);
				emit(next);
				return next;
			});
		},
		[emit],
	);

	const onPickerChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const list = e.target.files;
			if (!list || list.length === 0) return;
			addFiles(Array.from(list));
			if (inputRef.current) inputRef.current.value = '';
		},
		[addFiles],
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
			addFiles(Array.from(list));
		},
		[addFiles, disabled],
	);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;
			setItems((prev) => {
				const fromIdx = prev.findIndex((p) => p.id === active.id);
				const toIdx = prev.findIndex((p) => p.id === over.id);
				if (fromIdx === -1 || toIdx === -1) return prev;
				const next = [...prev];
				const [moved] = next.splice(fromIdx, 1);
				next.splice(toIdx, 0, moved);
				emit(next);
				return next;
			});
		},
		[emit],
	);

	const tileIds = useMemo(() => items.map((it) => it.id), [items]);
	const isFull = maxFiles !== undefined && items.length >= maxFiles;

	return (
		<div className={cn('space-y-3', className)}>
			<DndContext sensors={sensors} onDragEnd={onDragEnd}>
				<SortableContext items={tileIds} strategy={rectSortingStrategy}>
					<div
						className={cn(
							'grid grid-cols-2 gap-2',
							'sm:grid-cols-3 md:grid-cols-4',
						)}
					>
						{items.map((item, i) => (
							<SortableTile
								key={item.id}
								item={item}
								isFirst={i === 0}
								disabled={disabled}
								onRemove={() => remove(item.id)}
								strings={strings}
								tileClassName={tileClassName}
							/>
						))}

						{!isFull && (
							<div
								role="button"
								tabIndex={disabled ? -1 : 0}
								aria-disabled={disabled || undefined}
								aria-invalid={invalid || undefined}
								onClick={() => !disabled && inputRef.current?.click()}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										inputRef.current?.click();
									}
								}}
								onDragEnter={handleDragEnter}
								onDragOver={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								className={cn(
									'flex aspect-square items-center justify-center rounded-lg border border-dashed text-center outline-none transition-colors',
									'hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50',
									invalid ? 'border-destructive' : 'border-muted-foreground/40',
									disabled && 'cursor-not-allowed opacity-50',
									!disabled && isDragging && 'border-primary bg-primary/10 text-primary',
								)}
							>
								<input
									id={inputId}
									ref={inputRef}
									type="file"
									className="sr-only"
									accept={accept}
									multiple
									disabled={disabled}
									onChange={onPickerChange}
								/>
								<div className="flex flex-col items-center gap-2 px-2">
									<ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
									<Text size="xs" weight="medium">
										{isDragging ? strings.dragOver : strings.addInstruction}
									</Text>
								</div>
							</div>
						)}
					</div>
				</SortableContext>
			</DndContext>

			{!!isFull && (
				<Text size="xs" type="secondary">
					{strings.maxReached}
				</Text>
			)}
			{!isFull && !!strings.helper && (
				<Text size="xs" type="secondary">
					{strings.helper}
				</Text>
			)}
		</div>
	);
}

MediaGallery.displayName = 'MediaGallery';
