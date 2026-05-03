/**
 * SwitchCard — bordered settings card with an icon, title, optional
 * description, optional hint, and a trailing switch. The whole card is
 * clickable and toggles the switch; clicking inside the actual switch only
 * toggles once. Active state lifts the border and tints the surface.
 *
 * Use for top-of-list "feature" toggles where the switch needs more visual
 * weight than a `ToggleField`. For dense rows, prefer `ToggleField`.
 */
import { type LucideIcon } from 'lucide-react';
import * as React from 'react';
import { useCallback, useId, useMemo, useState } from 'react';
import { Switch as SwitchPrimitive } from '@/components/ui/switch';
import { Label, Text } from '@/components/typography';
import { cn } from '@/lib/utils';

export interface SwitchCardProps {
	label: string;
	description?: string;
	hint?: string;
	icon?: LucideIcon;
	name?: string;
	value?: boolean;
	defaultValue?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
}

export function SwitchCard({
	label,
	description,
	hint,
	icon: Icon,
	name,
	value,
	defaultValue,
	onChange,
	disabled = false,
	invalid,
	className,
}: SwitchCardProps) {
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState<boolean>(defaultValue ?? false);
	const checked = isControlled ? value ?? false : internal;
	const generatedId = useId();
	const id = useMemo(() => name ?? generatedId, [name, generatedId]);

	const hasDescription = typeof description === 'string' && description.trim() !== '';
	const describedById = hasDescription ? `${id}-description` : undefined;

	const handleToggle = useCallback(
		(newChecked: boolean) => {
			if (disabled) return;
			if (!isControlled) setInternal(newChecked);
			onChange?.(newChecked);
		},
		[disabled, isControlled, onChange],
	);

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			if ((e.target as HTMLElement).closest('[role="switch"]')) return;
			handleToggle(!checked);
		},
		[checked, handleToggle],
	);

	return (
		<div
			role="button"
			tabIndex={disabled ? -1 : 0}
			onClick={handleCardClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleToggle(!checked);
				}
			}}
			className={cn(
				'group relative flex items-start gap-3 rounded-lg border bg-card p-4 transition-[background,border-color,box-shadow] duration-150',
				'border-border',
				checked && 'border-primary bg-primary/[0.04]',
				invalid && 'border-destructive ring-2 ring-destructive/20',
				!disabled && 'cursor-pointer hover:border-foreground/20 hover:bg-muted/30',
				disabled && 'cursor-not-allowed opacity-50',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
				className,
			)}
		>
			{!!name && (
				<input
					type="hidden"
					name={name}
					value={checked ? '1' : '0'}
					aria-hidden="true"
				/>
			)}

			{!!Icon && (
				<span
					className={cn(
						'mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors',
						checked
							? 'bg-primary/10 text-primary'
							: 'bg-muted text-muted-foreground group-hover:text-foreground',
					)}
				>
					<Icon className="size-4" />
				</span>
			)}

			<div className="min-w-0 flex-1 space-y-0.5">
				<Label
					htmlFor={id}
					className={cn(
						'block font-semibold tracking-tight',
						disabled ? 'cursor-not-allowed' : 'cursor-pointer',
					)}
				>
					{label}
				</Label>
				{!!hasDescription && (
					<Text type="secondary" className="leading-snug">
						{description}
					</Text>
				)}
				{!!hint && (
					<Text size="xs" type="discrete" className="leading-snug">
						{hint}
					</Text>
				)}
			</div>

			<div className="mt-1 flex shrink-0 items-center">
				<SwitchPrimitive
					id={id}
					checked={checked}
					onCheckedChange={(v) => handleToggle(v as boolean)}
					disabled={disabled}
					aria-label={label}
					aria-describedby={describedById}
				/>
			</div>

			{!!hasDescription && (
				<span id={`${id}-description`} className="sr-only">
					{description}
				</span>
			)}
		</div>
	);
}

SwitchCard.displayName = 'SwitchCard';
