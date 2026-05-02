/**
 * BooleanIndicator — labelled yes/no chip showing the truth of a value with an
 * optional check/cross icon. Use for compact metadata grids where each row
 * answers a single boolean question. Strings overridable for i18n.
 */
import { CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';
import { Badge, type ComposedBadgeVariant } from '@/components/base/badge';
import { Text } from '@/components/typography';
import { useStrings } from '@/lib/strings';
import { cn } from '@/lib/utils';

export interface BooleanIndicatorStrings {
	true: string;
	false: string;
}

export const defaultBooleanIndicatorStrings: BooleanIndicatorStrings = {
	true: 'Yes',
	false: 'No',
};

export type BooleanIndicatorProps = {
	label: React.ReactNode;
	value?: boolean | null;
	showIcon?: boolean;
	trueVariant?: ComposedBadgeVariant;
	falseVariant?: ComposedBadgeVariant;
	className?: string;
	badgeClassName?: string;
	strings?: Partial<BooleanIndicatorStrings>;
	/** @deprecated Use `strings.true` instead. */
	trueLabel?: React.ReactNode;
	/** @deprecated Use `strings.false` instead. */
	falseLabel?: React.ReactNode;
};

export function BooleanIndicator({
	label,
	value = false,
	trueLabel,
	falseLabel,
	showIcon = true,
	trueVariant = 'success',
	falseVariant = 'secondary',
	className,
	badgeClassName,
	strings: stringsProp,
}: BooleanIndicatorProps) {
	const strings = useStrings(defaultBooleanIndicatorStrings, stringsProp);
	const isTrue = Boolean(value);
	const Icon = isTrue ? CheckCircle2 : XCircle;
	const badgeVariant = isTrue ? trueVariant : falseVariant;
	const fallback = isTrue ? trueLabel : falseLabel;
	const content = fallback ?? (isTrue ? strings.true : strings.false);

	return (
		<div
			className={cn(
				'flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2',
				className,
			)}
		>
			<Text size="xs" type="secondary" className="uppercase tracking-wide">
				{label}
			</Text>
			<Badge
				variant={badgeVariant}
				size="sm"
				className={cn('whitespace-nowrap', badgeClassName)}
			>
				{!!showIcon && <Icon className="h-3.5 w-3.5" />}
				{content}
			</Badge>
		</div>
	);
}

BooleanIndicator.displayName = 'BooleanIndicator';

export default BooleanIndicator;
