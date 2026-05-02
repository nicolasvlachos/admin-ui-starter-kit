import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Combobox = ComboboxPrimitive.Root;

function ComboboxInput({
	className,
	...props
}: ComboboxPrimitive.Input.Props) {
	return (
		<ComboboxPrimitive.Input
			data-slot="combobox-input"
			className={cn(
				'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:bg-destructive/15 aria-invalid:placeholder:text-destructive',
				className
			)}
			{...props}
		/>
	);
}

function ComboboxTrigger({
	className,
	children,
	...props
}: ComboboxPrimitive.Trigger.Props) {
	return (
		<ComboboxPrimitive.Trigger
			data-slot="combobox-trigger"
			className={cn(
				'border-input file:text-foreground placeholder:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:bg-destructive/15 aria-invalid:placeholder:text-destructive',
				'[&>span]:line-clamp-1',
				className
			)}
			{...props}
		>
			{children}
			<ComboboxPrimitive.Icon className="flex">
				<ChevronDownIcon className="size-4 opacity-50" />
			</ComboboxPrimitive.Icon>
		</ComboboxPrimitive.Trigger>
	);
}

function ComboboxValue({
	placeholder,
	...props
}: ComboboxPrimitive.Value.Props & { placeholder?: React.ReactNode }) {
	return (
		<ComboboxPrimitive.Value
			data-slot="combobox-value"
			placeholder={
				!!placeholder && <span className="text-muted-foreground">{placeholder}</span>
			}
			{...props}
		/>
	);
}

function ComboboxClear({
	className,
	...props
}: ComboboxPrimitive.Clear.Props) {
	return (
		<ComboboxPrimitive.Clear
			data-slot="combobox-clear"
			className={cn(
				'absolute right-8 top-1/2 -translate-y-1/2 rounded-sm opacity-50 ring-offset-background transition-opacity',
				'hover:opacity-100 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'disabled:pointer-events-none',
				className
			)}
			{...props}
		>
			<XIcon className="size-4" />
		</ComboboxPrimitive.Clear>
	);
}

export type ComboboxSize = 'sm' | 'md' | 'lg';

const inputSizeClasses: Record<ComboboxSize, string> = {
	sm: 'h-8 text-xs pl-2 pr-8',
	md: 'h-10 text-sm pl-3 pr-10',
	lg: 'h-12 text-base pl-4 pr-12',
};

const inputSizeWithClearClasses: Record<ComboboxSize, string> = {
	sm: 'pr-14',
	md: 'pr-16',
	lg: 'pr-20',
};

const iconContainerSizeClasses: Record<ComboboxSize, string> = {
	sm: 'right-1',
	md: 'right-2',
	lg: 'right-3',
};

const iconSizeClasses: Record<ComboboxSize, string> = {
	sm: 'size-3',
	md: 'size-4',
	lg: 'size-5',
};

type ComboboxInputTriggerProps = Omit<ComboboxPrimitive.Input.Props, 'size'> & {
	showClear?: boolean;
	size?: ComboboxSize;
	error?: boolean;
};

function ComboboxInputTrigger({
	className,
	showClear = false,
	size = 'md',
	error,
	...props
}: ComboboxInputTriggerProps) {
	return (
		<div className="relative">
			<ComboboxPrimitive.Input
				data-slot="combobox-input"
				className={cn(
					'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-md border bg-background shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
					'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
					'aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:bg-destructive/15 aria-invalid:placeholder:text-destructive',
					inputSizeClasses[size],
					showClear && inputSizeWithClearClasses[size],
					className
				)}
				aria-invalid={error || undefined}
				{...props}
			/>
			<div
				className={cn(
					'absolute top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground',
					iconContainerSizeClasses[size]
				)}
			>
				{!!showClear && (
                    <ComboboxPrimitive.Clear
						data-slot="combobox-clear"
						className="rounded-sm p-1 opacity-50 hover:opacity-100 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
					>
						<XIcon className={iconSizeClasses[size]} />
					</ComboboxPrimitive.Clear>
   )}
				<ComboboxPrimitive.Trigger className="rounded-sm p-1 hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
					<ChevronDownIcon className={iconSizeClasses[size]} />
				</ComboboxPrimitive.Trigger>
			</div>
		</div>
	);
}

// Portal
const ComboboxPortal = ComboboxPrimitive.Portal;

// Positioner
function ComboboxPositioner({
	className,
	sideOffset = 4,
	...props
}: ComboboxPrimitive.Positioner.Props) {
	return (
		<ComboboxPrimitive.Positioner
			data-slot="combobox-positioner"
			sideOffset={sideOffset}
			className={cn('z-50 outline-none', className)}
			{...props}
		/>
	);
}

// Popup (content)
function ComboboxPopup({
	className,
	...props
}: ComboboxPrimitive.Popup.Props) {
	return (
		<ComboboxPrimitive.Popup
			data-slot="combobox-popup"
			className={cn(
				'w-[var(--anchor-width)] min-w-[8rem] max-w-[var(--available-width)] max-h-[min(var(--available-height),24rem)]',
				'overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
				'origin-[var(--transform-origin)]',
				'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
				'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
				'transition-[opacity,transform] duration-150',
				className
			)}
			{...props}
		/>
	);
}

// List
function ComboboxList({
	className,
	...props
}: ComboboxPrimitive.List.Props) {
	return (
		<ComboboxPrimitive.List
			data-slot="combobox-list"
			className={cn(
				'max-h-[min(24rem,var(--available-height))] overflow-y-auto overscroll-contain p-1',
				'outline-none empty:hidden',
				className
			)}
			{...props}
		/>
	);
}

// Item
//
// Layout: `[content][indicator]` with the selection check pinned to the
// right (`justify-between`). Consumers render leading icons naturally inside
// `renderItem` — the `gap` between icon and label is set by the consumer.
const itemSizeClasses: Record<ComboboxSize, string> = {
	sm: 'py-1 px-2 text-xs gap-2',
	md: 'py-1.5 px-2.5 text-sm gap-2',
	lg: 'py-2 px-3 text-base gap-2.5',
};

const itemIndicatorSizeClasses: Record<ComboboxSize, string> = {
	sm: 'size-3',
	md: 'size-4',
	lg: 'size-5',
};

function ComboboxItem({
	className,
	children,
	size = 'md',
	...props
}: ComboboxPrimitive.Item.Props & { size?: ComboboxSize }) {
	return (
		<ComboboxPrimitive.Item
			data-slot="combobox-item"
			className={cn(
				'flex w-full cursor-default select-none items-center justify-between rounded-sm outline-none',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
				itemSizeClasses[size],
				className
			)}
			{...props}
		>
			<span className="flex min-w-0 flex-1 items-center gap-2 truncate">
				{children}
			</span>
			<ComboboxPrimitive.ItemIndicator
				className={cn(
					'flex shrink-0 items-center justify-center text-muted-foreground',
					itemIndicatorSizeClasses[size]
				)}
			>
				<CheckIcon className={itemIndicatorSizeClasses[size]} />
			</ComboboxPrimitive.ItemIndicator>
		</ComboboxPrimitive.Item>
	);
}

// Item Indicator (standalone)
function ComboboxItemIndicator({
	className,
	children,
	...props
}: ComboboxPrimitive.ItemIndicator.Props) {
	return (
		<ComboboxPrimitive.ItemIndicator
			data-slot="combobox-item-indicator"
			className={cn(className)}
			{...props}
		>
			{children ?? <CheckIcon className="size-4" />}
		</ComboboxPrimitive.ItemIndicator>
	);
}

// Empty
function ComboboxEmpty({
	className,
	children,
	...props
}: ComboboxPrimitive.Empty.Props) {
	return (
		<ComboboxPrimitive.Empty
			data-slot="combobox-empty"
			className={cn(
				'py-6 text-center text-sm text-muted-foreground empty:hidden',
				className
			)}
			{...props}
		>
			{children}
		</ComboboxPrimitive.Empty>
	);
}

// Status (for async loading states)
function ComboboxStatus({
	className,
	...props
}: ComboboxPrimitive.Status.Props) {
	return (
		<ComboboxPrimitive.Status
			data-slot="combobox-status"
			className={cn(
				'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground empty:hidden',
				className
			)}
			{...props}
		/>
	);
}

// Group
function ComboboxGroup({
	className,
	...props
}: ComboboxPrimitive.Group.Props) {
	return (
		<ComboboxPrimitive.Group
			data-slot="combobox-group"
			className={cn('overflow-hidden p-1', className)}
			{...props}
		/>
	);
}

// Group Label
function ComboboxGroupLabel({
	className,
	...props
}: ComboboxPrimitive.GroupLabel.Props) {
	return (
		<ComboboxPrimitive.GroupLabel
			data-slot="combobox-group-label"
			className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
			{...props}
		/>
	);
}

// Collection (for rendering items)
const ComboboxCollection = ComboboxPrimitive.Collection;

// Separator
function ComboboxSeparator({
	className,
	...props
}: ComboboxPrimitive.Separator.Props) {
	return (
		<ComboboxPrimitive.Separator
			data-slot="combobox-separator"
			className={cn('-mx-1 my-1 h-px bg-muted', className)}
			{...props}
		/>
	);
}

// Chips container (for multiple selection)
const chipsSizeClasses: Record<ComboboxSize, string> = {
	sm: 'min-h-8 gap-1 px-2 py-1 text-xs',
	md: 'min-h-10 gap-1.5 px-3 py-2 text-sm',
	lg: 'min-h-12 gap-2 px-4 py-2.5 text-base',
};

function ComboboxChips({
	className,
	size = 'md',
	error,
	...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & {
	size?: ComboboxSize;
	error?: boolean;
}) {
	return (
		<ComboboxPrimitive.Chips
			data-slot="combobox-chips"
			className={cn(
				'flex flex-wrap items-center rounded-md border border-input bg-background ring-offset-background shadow-xs transition-[color,box-shadow] outline-none',
				'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
				'aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:bg-destructive/15',
				chipsSizeClasses[size],
				className
			)}
			aria-invalid={error || undefined}
			{...props}
		/>
	);
}

// Chip
function ComboboxChip({
	className,
	children,
	...props
}: ComboboxPrimitive.Chip.Props) {
	return (
		<ComboboxPrimitive.Chip
			data-slot="combobox-chip"
			className={cn(
				'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground',
				'data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground',
				'focus-within:bg-primary focus-within:text-primary-foreground',
				className
			)}
			{...props}
		>
			{children}
			<ComboboxPrimitive.ChipRemove className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
				<XIcon className="size-3" />
			</ComboboxPrimitive.ChipRemove>
		</ComboboxPrimitive.Chip>
	);
}

// Chips Input
function ComboboxChipsInput({
	className,
	...props
}: ComboboxPrimitive.Input.Props) {
	return (
		<ComboboxPrimitive.Input
			data-slot="combobox-chips-input"
			className={cn(
				'min-w-[80px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
				className
			)}
			{...props}
		/>
	);
}

// Backdrop (for modal)
function ComboboxBackdrop({
	className,
	...props
}: ComboboxPrimitive.Backdrop.Props) {
	return (
		<ComboboxPrimitive.Backdrop
			data-slot="combobox-backdrop"
			className={cn(
				'fixed inset-0 z-50 bg-black/80',
				'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
				'transition-opacity duration-150',
				className
			)}
			{...props}
		/>
	);
}

// Arrow
function ComboboxArrow({
	className,
	...props
}: ComboboxPrimitive.Arrow.Props) {
	return (
		<ComboboxPrimitive.Arrow
			data-slot="combobox-arrow"
			className={cn('fill-popover', className)}
			{...props}
		/>
	);
}

// useFilter hook re-export
const useComboboxFilter = ComboboxPrimitive.useFilter;

export {
	Combobox,
	ComboboxInput,
	ComboboxInputTrigger,
	ComboboxTrigger,
	ComboboxValue,
	ComboboxClear,
	ComboboxPortal,
	ComboboxPositioner,
	ComboboxPopup,
	ComboboxList,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxEmpty,
	ComboboxStatus,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxCollection,
	ComboboxSeparator,
	ComboboxChips,
	ComboboxChip,
	ComboboxChipsInput,
	ComboboxBackdrop,
	ComboboxArrow,
	useComboboxFilter,
};
