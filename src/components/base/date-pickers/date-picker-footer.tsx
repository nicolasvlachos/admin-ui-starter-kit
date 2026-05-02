import * as React from 'react';
import { Button, type ButtonStyle, type ButtonVariant } from '@/components/base/buttons';
import { Separator } from '@/components/base/display/separator';
import { Text } from '@/components/typography';
import { cn } from '@/lib/utils';
import type {
	DatePickerFooter as DatePickerFooterConfig,
	DateOutput,
	DateRangeOutput,
	MultipleDatesOutput
} from './datepicker.types';

interface DatePickerFooterProps {
	config: DatePickerFooterConfig;
	output: DateOutput | DateRangeOutput | MultipleDatesOutput;
	hasSelection: boolean;
	autoSummary?: string;
	className?: string;
}

export function DatePickerFooter({
	config,
	output,
	hasSelection,
	autoSummary,
	className
}: DatePickerFooterProps) {
	const { text, actions, showOnlyWhenSelected = false, showSummary = false } = config;

	// Resolve custom text
	const customText = React.useMemo(() => {
		if (!text) return undefined;
		return typeof text === 'function' ? text(output) : text;
	}, [text, output]);

	// Determine what text to show
	const displayText = customText || (showSummary ? autoSummary : undefined);

	// Don't render if showOnlyWhenSelected is true and no selection
	if (showOnlyWhenSelected && !hasSelection) {
		return null;
	}

	// Don't render if no text and no actions
	if (!displayText && (!actions || actions.length === 0)) {
		return null;
	}

	const resolveActionButton = (
		actionVariant?: string | null
	): { variant: ButtonVariant; buttonStyle: ButtonStyle } => {
		if (actionVariant === 'destructive') {
			return { variant: 'error', buttonStyle: 'solid' };
		}
		if (actionVariant === 'outline') {
			return { variant: 'secondary', buttonStyle: 'outline' };
		}
		if (actionVariant === 'ghost') {
			return { variant: 'secondary', buttonStyle: 'ghost' };
		}
		if (actionVariant === 'secondary') {
			return { variant: 'secondary', buttonStyle: 'solid' };
		}
		return { variant: 'primary', buttonStyle: 'solid' };
	};

	return (
		<>
			<Separator />
			<div className={cn('flex flex-col gap-3 p-3', className)}>
				{/* Text content */}
				{!!displayText && (
     <div className="text-sm">
						{!!showSummary && !!customText && !!autoSummary && <>
								<Text type="secondary">{autoSummary}</Text>
								<Text weight="medium" className="mt-1">{customText}</Text>
							</>}
						{!showSummary && !!customText && <Text weight="medium">{customText}</Text>}
						{!!showSummary && !customText && !!autoSummary && <Text type="secondary">{autoSummary}</Text>}
					</div>
   )}

				{/* Action buttons */}
				{!!actions && actions.length > 0 && (
     <div className="flex items-center gap-2">
						{actions.map((action) => {
							const isDisabled =
								typeof action.disabled === 'function'
									? action.disabled(output)
									: action.disabled;
							const resolved = resolveActionButton(action.variant ?? null);

							return (
								<Button
									key={action.label}
									variant={resolved.variant}
									buttonStyle={resolved.buttonStyle}
									disabled={isDisabled}
									onClick={() => action.onClick(output)}
									className="flex-1"
								>
									{action.label}
								</Button>
							);
						})}
					</div>
   )}
			</div>
		</>
	);
}

DatePickerFooter.displayName = 'DatePickerFooter';
